import crypto from "crypto";
import Razorpay from "razorpay";
import { PLAN_LIMITS } from "@/lib/billing/plans";
import { env } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

let razorpayClient: Razorpay | null = null;

export const RAZORPAY_PLAN_AMOUNTS_PAISE: Record<"starter" | "growth", number> = {
  starter: Number.parseInt(process.env.RAZORPAY_AMOUNT_STARTER ?? "3990000", 10),
  growth: Number.parseInt(process.env.RAZORPAY_AMOUNT_GROWTH ?? "4490000", 10),
};

export function isRazorpayConfigured() {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret);
}

export function getRazorpay() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    return null;
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }

  return razorpayClient;
}

export function verifyRazorpayPaymentSignature(args: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const secret = env.razorpayKeySecret;
  if (!secret) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${args.orderId}|${args.paymentId}`)
    .digest("hex");

  const received = args.signature.trim();
  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

type RazorpaySubscriptionPeriod = {
  currentStart?: number | null;
  currentEnd?: number | null;
  subscriptionId?: string | null;
};

export async function activateTenantPlanFromRazorpay(
  tenantId: string,
  planKey: "starter" | "growth" | "enterprise",
  period?: RazorpaySubscriptionPeriod,
) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error("Database not configured.");
  }

  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.growth;
  const subscriptionUpdate: Record<string, string | number | null> = {
    plan_key: planKey,
    status: "active",
    seat_limit: limits.seats,
    ai_monthly_limit: limits.aiMonthly,
    updated_at: new Date().toISOString(),
  };

  if (period?.subscriptionId) {
    subscriptionUpdate.razorpay_subscription_id = period.subscriptionId;
  }
  if (period?.currentStart) {
    subscriptionUpdate.current_period_start = new Date(
      period.currentStart * 1000,
    ).toISOString();
  }
  if (period?.currentEnd) {
    subscriptionUpdate.current_period_end = new Date(
      period.currentEnd * 1000,
    ).toISOString();
  }

  await admin
    .from("subscriptions")
    .update(subscriptionUpdate)
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

export async function setTenantRazorpaySubscriptionStatus(
  tenantId: string,
  status: "active" | "past_due" | "canceled",
  period?: RazorpaySubscriptionPeriod,
) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw new Error("Database not configured.");
  }

  const subscriptionUpdate: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (period?.currentStart) {
    subscriptionUpdate.current_period_start = new Date(
      period.currentStart * 1000,
    ).toISOString();
  }
  if (period?.currentEnd) {
    subscriptionUpdate.current_period_end = new Date(
      period.currentEnd * 1000,
    ).toISOString();
  }

  await admin
    .from("subscriptions")
    .update(subscriptionUpdate)
    .eq("tenant_id", tenantId);

  await admin
    .from("tenants")
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId);
}

export function verifyRazorpayWebhookSignature(body: string, signature: string) {
  const secret = env.razorpayWebhookSecret;
  if (!secret) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const received = signature.trim();

  if (expected.length !== received.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

type RazorpayWebhookPayload = {
  subscription?: { entity?: Record<string, unknown> };
  payment?: { entity?: Record<string, unknown> };
  payment_link?: { entity?: Record<string, unknown> };
};

export type RazorpayWebhookEvent = {
  event?: string;
  payload?: RazorpayWebhookPayload;
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function extractRazorpayPayerEmail(event: RazorpayWebhookEvent) {
  const payment = event.payload?.payment?.entity;
  const subscription = event.payload?.subscription?.entity;

  return (
    readString(payment?.email) ??
    readString(subscription?.customer_email) ??
    readString((subscription?.notes as Record<string, unknown> | undefined)?.email)
  );
}

function razorpayPaymentLinkSlug(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  const match = url.match(/rzp\.io\/rzp\/([^/?#]+)/i);
  return match?.[1]?.toLowerCase() ?? null;
}

function planKeyFromPaymentLinkSlug(slug: string | null) {
  if (!slug) {
    return null;
  }

  const starterSlug = razorpayPaymentLinkSlug(
    process.env.NEXT_PUBLIC_RAZORPAY_STARTER_PAYMENT_LINK,
  );
  const growthSlug = razorpayPaymentLinkSlug(
    process.env.NEXT_PUBLIC_RAZORPAY_GROWTH_PAYMENT_LINK,
  );

  if (growthSlug && slug === growthSlug) {
    return "growth" as const;
  }

  if (starterSlug && slug === starterSlug) {
    return "starter" as const;
  }

  return null;
}

function planKeyFromRazorpayPlanId(planId: string | null) {
  if (!planId) {
    return null;
  }

  const growthPlanId = process.env.RAZORPAY_GROWTH_PLAN_ID?.trim();
  const starterPlanId = process.env.RAZORPAY_STARTER_PLAN_ID?.trim();

  if (growthPlanId && planId === growthPlanId) {
    return "growth" as const;
  }

  if (starterPlanId && planId === starterPlanId) {
    return "starter" as const;
  }

  return null;
}

export function resolveRazorpayPlanKey(event: RazorpayWebhookEvent) {
  const subscription = event.payload?.subscription?.entity;
  const paymentLink = event.payload?.payment_link?.entity;
  const notes = subscription?.notes as Record<string, unknown> | undefined;
  const notePlan = readString(notes?.plan_key);

  if (notePlan === "starter" || notePlan === "growth" || notePlan === "enterprise") {
    return notePlan;
  }

  const planFromPlanId = planKeyFromRazorpayPlanId(readString(subscription?.plan_id));
  if (planFromPlanId) {
    return planFromPlanId;
  }

  const paymentLinkUrl =
    readString(paymentLink?.short_url) ??
    readString(paymentLink?.url) ??
    readString(paymentLink?.shorturl);
  const planFromLink = planKeyFromPaymentLinkSlug(razorpayPaymentLinkSlug(paymentLinkUrl));
  if (planFromLink) {
    return planFromLink;
  }

  return "starter";
}

export function extractRazorpaySubscriptionPeriod(event: RazorpayWebhookEvent) {
  const subscription = event.payload?.subscription?.entity;
  if (!subscription) {
    return null;
  }

  return {
    currentStart: readNumber(subscription.current_start),
    currentEnd: readNumber(subscription.current_end),
    subscriptionId: readString(subscription.id),
  };
}

export async function findTenantIdByRazorpaySubscription(
  subscriptionId: string,
) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  const { data } = await admin
    .from("subscriptions")
    .select("tenant_id")
    .eq("razorpay_subscription_id", subscriptionId)
    .maybeSingle();

  return data?.tenant_id ?? null;
}
