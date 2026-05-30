import { PLAN_LIMITS } from "@/lib/billing/stripe";
import {
  extractPayPalPayerEmail,
  resolvePayPalPlanKey,
  verifyPayPalWebhookSignature,
  type PayPalWebhookEvent,
} from "@/lib/billing/paypal-server";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";
import { logError, logInfo, logWarn } from "@/lib/logging/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVATION_EVENTS = new Set([
  "PAYMENT.CAPTURE.COMPLETED",
  "PAYMENT.SALE.COMPLETED",
  "CHECKOUT.ORDER.APPROVED",
  "BILLING.SUBSCRIPTION.ACTIVATED",
  "BILLING.SUBSCRIPTION.RE-ACTIVATED",
]);

const CANCELLATION_EVENTS = new Set([
  "BILLING.SUBSCRIPTION.CANCELLED",
  "BILLING.SUBSCRIPTION.SUSPENDED",
  "BILLING.SUBSCRIPTION.EXPIRED",
]);

const PAST_DUE_EVENTS = new Set(["BILLING.SUBSCRIPTION.PAYMENT.FAILED"]);

function limitsForPlan(planKey: string) {
  const key = planKey as keyof typeof PLAN_LIMITS;
  return PLAN_LIMITS[key] ?? PLAN_LIMITS.growth;
}

async function isEventProcessed(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  eventId: string,
) {
  const { data } = await admin
    .from("paypal_webhook_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();

  return Boolean(data);
}

async function markEventProcessed(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  eventId: string,
  eventType: string,
) {
  const { error } = await admin.from("paypal_webhook_events").insert({
    id: eventId,
    event_type: eventType,
  });

  if (error?.code === "23505") {
    return false;
  }

  if (error) {
    throw error;
  }

  return true;
}

async function findTenantIdByEmail(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  email: string,
) {
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  const { data: memberships } = await admin
    .from("tenant_memberships")
    .select("tenant_id, role")
    .eq("user_id", profile.id);

  if (!memberships?.length) {
    return null;
  }

  const priority = ["owner", "admin", "practitioner", "staff", "support", "viewer"];
  memberships.sort(
    (a, b) => priority.indexOf(a.role) - priority.indexOf(b.role),
  );

  return memberships[0]?.tenant_id ?? null;
}

async function activateTenantPlan(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  tenantId: string,
  planKey: string,
) {
  const limits = limitsForPlan(planKey);

  await admin
    .from("subscriptions")
    .update({
      plan_key: planKey,
      status: "active",
      seat_limit: limits.seats,
      ai_monthly_limit: limits.aiMonthly,
      updated_at: new Date().toISOString(),
    })
    .eq("tenant_id", tenantId);

  await admin
    .from("tenants")
    .update({
      plan_key: planKey,
      subscription_status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId);
}

async function setTenantSubscriptionStatus(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  tenantId: string,
  status: "active" | "past_due" | "canceled",
) {
  await admin
    .from("subscriptions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("tenant_id", tenantId);

  await admin
    .from("tenants")
    .update({ subscription_status: status, updated_at: new Date().toISOString() })
    .eq("id", tenantId);
}

export async function POST(request: Request) {
  if (!env.paypalClientId || !env.paypalClientSecret || !env.paypalWebhookId) {
    return Response.json({ error: "PayPal webhook not configured" }, { status: 503 });
  }

  const body = Buffer.from(await request.arrayBuffer()).toString("utf8");

  try {
    const verification = await verifyPayPalWebhookSignature({
      headers: request.headers,
      body,
    });

    if (!verification.verified) {
      logWarn({
        message: "paypal.webhook.verification_failed",
        step: "billing_webhook",
        status: "error",
        metadata: {
          verificationStatus: verification.verificationStatus,
          transmissionId: verification.transmissionId,
          missingHeaders: verification.missingHeaders,
          webhookIdConfigured: Boolean(env.paypalWebhookId),
        },
      });
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    logError({
      message: "paypal.webhook.invalid",
      step: "billing_webhook",
      status: "error",
      error,
    });
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as PayPalWebhookEvent;
  const eventId = event.id;
  const eventType = event.event_type ?? "unknown";

  if (!eventId) {
    return Response.json({ error: "Missing event id" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  if (await isEventProcessed(admin, eventId)) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    if (ACTIVATION_EVENTS.has(eventType)) {
      const payerEmail = extractPayPalPayerEmail(event);
      const planKey = resolvePayPalPlanKey(event);

      if (payerEmail) {
        const tenantId = await findTenantIdByEmail(admin, payerEmail);
        if (tenantId) {
          await activateTenantPlan(admin, tenantId, planKey);
        } else {
          logInfo({
            message: "paypal.webhook.no_tenant_match",
            step: "billing_webhook",
            status: "ok",
            metadata: { eventType, payerEmail },
          });
        }
      }
    } else if (CANCELLATION_EVENTS.has(eventType)) {
      const payerEmail = extractPayPalPayerEmail(event);
      if (payerEmail) {
        const tenantId = await findTenantIdByEmail(admin, payerEmail);
        if (tenantId) {
          await setTenantSubscriptionStatus(admin, tenantId, "canceled");
        }
      }
    } else if (PAST_DUE_EVENTS.has(eventType)) {
      const payerEmail = extractPayPalPayerEmail(event);
      if (payerEmail) {
        const tenantId = await findTenantIdByEmail(admin, payerEmail);
        if (tenantId) {
          await setTenantSubscriptionStatus(admin, tenantId, "past_due");
        }
      }
    }

    await markEventProcessed(admin, eventId, eventType);

    logInfo({
      message: "paypal.webhook.processed",
      step: "billing_webhook",
      status: "ok",
      metadata: { eventType },
    });

    return Response.json({ received: true });
  } catch (error) {
    logError({
      message: "paypal.webhook.failed",
      step: "billing_webhook",
      status: "error",
      error,
    });
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
