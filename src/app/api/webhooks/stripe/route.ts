import type Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/billing/stripe";
import { logInfo, logError } from "@/lib/logging/logger";

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

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.stripeWebhookSecret,
    );
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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const tenantId = session.metadata?.tenant_id;
        const planKey = session.metadata?.plan_key ?? "starter";

        if (tenantId) {
          const limits =
            planKey === "growth"
              ? { seats: 25, ai: 10000 }
              : planKey === "enterprise"
                ? { seats: 100, ai: 50000 }
                : { seats: 10, ai: 2000 };

          await admin
            .from("subscriptions")
            .update({
              plan_key: planKey,
              status: "active",
              seat_limit: limits.seats,
              ai_monthly_limit: limits.ai,
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
          await admin
            .from("subscriptions")
            .update({
              plan_key: planKey,
              status: subscription.status,
              stripe_subscription_id: subscription.id,
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
      default:
        break;
    }

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
