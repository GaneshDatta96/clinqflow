import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import {
  activateTenantPlanFromRazorpay,
  getRazorpay,
  isRazorpayConfigured,
  verifyRazorpayPaymentSignature,
} from "@/lib/billing/razorpay-server";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { requirePermission } from "@/lib/tenancy/context";

const schema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const POST = createApiHandler({
  route: "/api/razorpay/verify-payment",
  step: "razorpay_verify_payment",
  schema,
  handler: async ({ body }) => {
    if (!isRazorpayConfigured()) {
      throw badRequest("Razorpay is not configured.");
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      throw badRequest("Razorpay is not configured.");
    }

    const { context } = await requirePermission("tenant:billing");

    const valid = verifyRazorpayPaymentSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!valid) {
      throw badRequest("Payment signature verification failed.");
    }

    const order = await razorpay.orders.fetch(body.razorpay_order_id);
    const notes = (order.notes ?? {}) as Record<string, string>;
    const tenantId = notes.tenant_id;
    const planKey = notes.plan_key as "starter" | "growth" | "enterprise" | undefined;

    if (!tenantId || tenantId !== context.tenantId) {
      throw badRequest("Order does not belong to this workspace.");
    }

    if (!planKey || !["starter", "growth", "enterprise"].includes(planKey)) {
      throw badRequest("Invalid plan on order.");
    }

    await activateTenantPlanFromRazorpay(tenantId, planKey);

    const admin = getSupabaseAdmin();
    if (admin) {
      await admin.from("audit_logs").insert({
        tenant_id: tenantId,
        actor_id: context.userId,
        action: "billing.razorpay_paid",
        resource_type: "tenant",
        resource_id: tenantId,
        metadata: {
          plan: planKey,
          order_id: body.razorpay_order_id,
          payment_id: body.razorpay_payment_id,
        },
      });
    }

    return jsonOk({
      success: true,
      plan: planKey,
      payment_id: body.razorpay_payment_id,
      order_id: body.razorpay_order_id,
    });
  },
});
