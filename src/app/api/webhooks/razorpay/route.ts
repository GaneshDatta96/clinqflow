import {
  activateTenantPlanFromRazorpay,
  extractRazorpayPayerEmail,
  extractRazorpaySubscriptionPeriod,
  findTenantIdByRazorpaySubscription,
  resolveRazorpayPlanKey,
  setTenantRazorpaySubscriptionStatus,
  verifyRazorpayWebhookSignature,
  type RazorpayWebhookEvent,
} from "@/lib/billing/razorpay-server";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";
import { logError, logInfo, logWarn } from "@/lib/logging/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVATION_EVENTS = new Set([
  "subscription.authenticated",
  "subscription.activated",
  "subscription.charged",
  "payment_link.paid",
]);

const CANCELLATION_EVENTS = new Set([
  "subscription.cancelled",
  "subscription.completed",
]);

const PAST_DUE_EVENTS = new Set(["subscription.halted"]);

async function isEventProcessed(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  eventId: string,
) {
  const { data } = await admin
    .from("razorpay_webhook_events")
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
  const { error } = await admin.from("razorpay_webhook_events").insert({
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

async function resolveTenantId(event: RazorpayWebhookEvent) {
  const period = extractRazorpaySubscriptionPeriod(event);
  if (period?.subscriptionId) {
    const bySubscription = await findTenantIdByRazorpaySubscription(
      period.subscriptionId,
    );
    if (bySubscription) {
      return bySubscription;
    }
  }

  const payerEmail = extractRazorpayPayerEmail(event);
  if (!payerEmail) {
    return null;
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  return findTenantIdByEmail(admin, payerEmail);
}

export async function POST(request: Request) {
  if (!env.razorpayWebhookSecret) {
    return Response.json({ error: "Razorpay webhook not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature || !verifyRazorpayWebhookSignature(body, signature)) {
    logWarn({
      message: "razorpay.webhook.invalid_signature",
      step: "billing_webhook",
      status: "error",
    });
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventId = request.headers.get("x-razorpay-event-id");
  if (!eventId) {
    return Response.json({ error: "Missing event id" }, { status: 400 });
  }

  const event = JSON.parse(body) as RazorpayWebhookEvent;
  const eventType = event.event ?? "unknown";

  const admin = getSupabaseAdmin();
  if (!admin) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  if (await isEventProcessed(admin, eventId)) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    const tenantId = await resolveTenantId(event);
    const period = extractRazorpaySubscriptionPeriod(event);

    if (ACTIVATION_EVENTS.has(eventType) && tenantId) {
      const planKey = resolveRazorpayPlanKey(event);
      await activateTenantPlanFromRazorpay(tenantId, planKey, period ?? undefined);

      await admin.from("audit_logs").insert({
        tenant_id: tenantId,
        actor_id: null,
        action: "billing.razorpay_subscription_activated",
        resource_type: "tenant",
        resource_id: tenantId,
        metadata: {
          eventType,
          plan: planKey,
          subscription_id: period?.subscriptionId ?? null,
        },
      });
    } else if (ACTIVATION_EVENTS.has(eventType)) {
      logInfo({
        message: "razorpay.webhook.no_tenant_match",
        step: "billing_webhook",
        status: "ok",
        metadata: {
          eventType,
          payerEmail: extractRazorpayPayerEmail(event),
        },
      });
    } else if (CANCELLATION_EVENTS.has(eventType) && tenantId) {
      await setTenantRazorpaySubscriptionStatus(tenantId, "canceled", period ?? undefined);
    } else if (PAST_DUE_EVENTS.has(eventType) && tenantId) {
      await setTenantRazorpaySubscriptionStatus(tenantId, "past_due", period ?? undefined);
    }

    await markEventProcessed(admin, eventId, eventType);

    logInfo({
      message: "razorpay.webhook.processed",
      step: "billing_webhook",
      status: "ok",
      metadata: { eventType },
    });

    return Response.json({ received: true });
  } catch (error) {
    logError({
      message: "razorpay.webhook.failed",
      step: "billing_webhook",
      status: "error",
      error,
    });
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
