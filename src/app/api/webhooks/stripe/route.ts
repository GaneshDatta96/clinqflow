import type Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";
import { getStripe, PLAN_LIMITS } from "@/lib/billing/stripe";
import { logInfo, logError } from "@/lib/logging/logger";

function limitsForPlan(planKey: string) {
  const key = planKey as keyof typeof PLAN_LIMITS;
  return PLAN_LIMITS[key] ?? PLAN_LIMITS.starter;
}

async function isEventProcessed(
  admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  eventId: string,
) {
  const { data } = await admin
    .from("stripe_webhook_events")
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
  const { error } = await admin.from("stripe_webhook_events").insert({
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

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe || !env.stripeWebhookSecret) {
    return Response.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    logError({
      message: "stripe.webhook.invalid",
      step: "billing_webhook",
      status: "error",
      error,
    });
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  if (!admin) {
    return Response.json({ error: "Database not configured" }, { status: 503 });
  }

  if (await isEventProcessed(admin, event.id)) {
    return Response.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenant_id;
        const planKey = session.metadata?.plan_key ?? "starter";
        const limits = limitsForPlan(planKey);

        if (tenantId) {
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
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata?.tenant_id;
        const periodStart = subscription.items?.data[0]?.current_period_start;
        const periodEnd = subscription.items?.data[0]?.current_period_end;

        if (tenantId) {
          const planKey = subscription.metadata?.plan_key ?? "starter";
          const limits = limitsForPlan(planKey);
          await admin
            .from("subscriptions")
            .update({
              plan_key: planKey,
              status: subscription.status,
              stripe_subscription_id: subscription.id,
              seat_limit: limits.seats,
              ai_monthly_limit: limits.aiMonthly,
              current_period_start: periodStart
                ? new Date(periodStart * 1000).toISOString()
                : null,
              current_period_end: periodEnd
                ? new Date(periodEnd * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq("tenant_id", tenantId);

          await admin
            .from("tenants")
            .update({
              plan_key: planKey,
              subscription_status: subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq("id", tenantId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const tenantId = subscription.metadata?.tenant_id;
        if (tenantId) {
          await admin
            .from("subscriptions")
            .update({ status: "canceled", updated_at: new Date().toISOString() })
            .eq("tenant_id", tenantId);
          await admin
            .from("tenants")
            .update({ subscription_status: "canceled", updated_at: new Date().toISOString() })
            .eq("id", tenantId);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const tenantId = invoice.metadata?.tenant_id;
        if (tenantId) {
          await admin
            .from("tenants")
            .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
            .eq("id", tenantId);
          await admin
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("tenant_id", tenantId);
        }
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const tenantId = invoice.metadata?.tenant_id;
        if (tenantId) {
          await admin
            .from("tenants")
            .update({ subscription_status: "active", updated_at: new Date().toISOString() })
            .eq("id", tenantId);
        }
        break;
      }
      default:
        break;
    }

    await markEventProcessed(admin, event.id, event.type);

    logInfo({
      message: "stripe.webhook.processed",
      step: "billing_webhook",
      status: "ok",
      metadata: { type: event.type },
    });

    return Response.json({ received: true });
  } catch (error) {
    logError({
      message: "stripe.webhook.failed",
      step: "billing_webhook",
      status: "error",
      error,
    });
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
