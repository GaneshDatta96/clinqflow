import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest, unauthorized, internal } from "@/lib/api/errors";
import {
  getRazorpay,
  isRazorpayConfigured,
  RAZORPAY_PLAN_AMOUNTS_PAISE,
} from "@/lib/billing/razorpay-server";
import { env } from "@/lib/env";
import { requirePermission } from "@/lib/tenancy/context";

const schema = z
  .object({
    plan: z.enum(["starter", "growth"]).optional(),
    amount: z.number().int().min(100).optional(),
    currency: z.string().min(3).max(3).default("INR"),
    receipt: z.string().max(40).optional(),
  })
  .refine((data) => Boolean(data.plan || data.amount), {
    message: "Either plan or amount is required.",
  });

export const POST = createApiHandler({
  route: "/api/razorpay/create-order",
  step: "razorpay_create_order",
  rateLimit: "billing",
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

    const planKey = body.plan ?? "growth";
    const amount =
      body.amount ??
      (body.plan ? RAZORPAY_PLAN_AMOUNTS_PAISE[body.plan] : undefined);

    if (!amount || amount < 100) {
      throw badRequest("Amount must be at least 100 paise.");
    }

    const receipt =
      body.receipt ??
      `cf_${context.tenantId.slice(0, 8)}_${Date.now()}`.slice(0, 40);

    try {
      const order = await razorpay.orders.create({
        amount,
        currency: body.currency,
        receipt,
        notes: {
          tenant_id: context.tenantId,
          plan_key: planKey,
          user_id: context.userId,
        },
      });

      return jsonOk({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: env.razorpayKeyId,
        plan: planKey,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Razorpay order creation failed.";
      const statusCode =
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        (error as { statusCode?: number }).statusCode === 401
          ? 401
          : 500;

      if (statusCode === 401) {
        throw unauthorized("Razorpay authentication failed.");
      }

      throw internal(message);
    }
  },
});
