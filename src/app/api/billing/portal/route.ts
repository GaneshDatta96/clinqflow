import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import { getStripe } from "@/lib/billing/stripe";
import { env } from "@/lib/env";
import { requirePermission } from "@/lib/tenancy/context";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

export const POST = createApiHandler({
  route: "/api/billing/portal",
  step: "billing_portal",
  handler: async () => {
    const { context } = await requirePermission("tenant:billing");
    const stripe = getStripe();

    if (!stripe) {
      throw badRequest("Stripe is not configured.");
    }

    const admin = getSupabaseAdmin();
    const { data: tenant } = await admin
      ?.from("tenants")
      .select("stripe_customer_id")
      .eq("id", context.tenantId)
      .single() ?? { data: null };

    if (!tenant?.stripe_customer_id) {
      throw badRequest("No billing account yet. Start a subscription first.");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripe_customer_id,
      return_url: `${env.appUrl}/app/billing`,
    });

    return jsonOk({ url: session.url });
  },
});
