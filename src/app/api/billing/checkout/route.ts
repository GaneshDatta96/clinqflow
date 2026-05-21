import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import { getStripe, PLAN_LIMITS } from "@/lib/billing/stripe";
import { env } from "@/lib/env";
import { requirePermission } from "@/lib/tenancy/context";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

const schema = z.object({
  plan: z.enum(["starter", "growth", "enterprise"]),
});

const PLAN_PRICES: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  growth: process.env.STRIPE_PRICE_GROWTH,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

export const POST = createApiHandler({
  route: "/api/billing/checkout",
  step: "billing_checkout",
  schema,
  handler: async ({ body }) => {
    const { context } = await requirePermission("tenant:billing");
    const stripe = getStripe();

    if (!stripe) {
      throw badRequest("Stripe is not configured.");
    }

    const admin = getSupabaseAdmin();
    if (!admin) {
      throw badRequest("Database not configured.");
    }

    const { data: tenant } = await admin
      .from("tenants")
      .select("stripe_customer_id, name")
      .eq("id", context.tenantId)
      .single();

    let customerId = tenant?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: tenant?.name ?? context.tenantName,
        metadata: { tenant_id: context.tenantId },
      });
      customerId = customer.id;
      await admin.from("tenants").update({ stripe_customer_id: customerId }).eq("id", context.tenantId);
    }

    const priceId = PLAN_PRICES[body.plan];
    const limits = PLAN_LIMITS[body.plan];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      success_url: `${env.appUrl}/app/billing?checkout=success`,
      cancel_url: `${env.appUrl}/app/billing?checkout=canceled`,
      metadata: {
        tenant_id: context.tenantId,
        plan_key: body.plan,
      },
      subscription_data: {
        metadata: {
          tenant_id: context.tenantId,
          plan_key: body.plan,
        },
      },
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              price_data: {
                currency: "usd",
                unit_amount: body.plan === "starter" ? 9900 : 29900,
                recurring: { interval: "month" },
                product_data: {
                  name: `Cliniqflow ${body.plan}`,
                  metadata: { plan_key: body.plan },
                },
              },
              quantity: 1,
            },
      ],
    });

    await admin.from("audit_logs").insert({
      tenant_id: context.tenantId,
      actor_id: context.userId,
      action: "billing.checkout_started",
      resource_type: "tenant",
      resource_id: context.tenantId,
      metadata: { plan: body.plan, seat_limit: limits.seats },
    });

    return jsonOk({ url: session.url });
  },
});
