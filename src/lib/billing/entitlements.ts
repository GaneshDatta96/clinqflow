import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { forbidden, tooManyRequests } from "@/lib/api/errors";
import { PLAN_LIMITS, isActiveSubscriptionStatus } from "@/lib/billing/plans";

export const getTenantSubscription = cache(async (tenantId: string) => {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data } = await admin
    .from("subscriptions")
    .select("plan_key, seat_limit, ai_monthly_limit, status")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  return data;
});

export async function getAiUsageThisMonth(tenantId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count } = await admin
    .from("usage_tracking")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("metric_key", "ai_soap_generation")
    .gte("recorded_at", monthStart.toISOString());

  return count ?? 0;
}

export async function getSeatCount(tenantId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return 0;

  const { count } = await admin
    .from("tenant_memberships")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  return count ?? 0;
}

export async function assertAiGenerationAllowed(tenantId: string) {
  const summary = await getEntitlementsSummary(tenantId);

  if (!isActiveSubscriptionStatus(summary.status)) {
    throw forbidden("Active subscription required. Subscribe in Billing to use AI features.");
  }

  const { used, limit } = summary.aiGenerations;
  if (used >= limit) {
    throw tooManyRequests(
      `AI generation limit reached (${used}/${limit} this month). Upgrade your plan.`,
    );
  }
}

export async function assertActiveSubscription(tenantId: string) {
  const sub = await getTenantSubscription(tenantId);
  if (!isActiveSubscriptionStatus(sub?.status ?? "incomplete")) {
    throw forbidden("Active subscription required. Subscribe in Billing to continue.");
  }
}

export async function assertSeatAvailable(tenantId: string) {
  const [sub, used] = await Promise.all([
    getTenantSubscription(tenantId),
    getSeatCount(tenantId),
  ]);

  if (!isActiveSubscriptionStatus(sub?.status ?? "incomplete")) {
    throw forbidden("Active subscription required. Subscribe in Billing to continue.");
  }

  const planKey = (sub?.plan_key ?? "incomplete") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.incomplete;
  const seatLimit = sub?.seat_limit ?? limits.seats;

  if (used >= seatLimit) {
    throw forbidden(
      `Seat limit reached (${used}/${seatLimit}). Upgrade your plan to invite more users.`,
    );
  }
}

async function computeEntitlementsSummary(tenantId: string) {
  const sub = await getTenantSubscription(tenantId);
  const planKey = (sub?.plan_key ?? "incomplete") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.incomplete;

  const [seatCount, aiUsage] = await Promise.all([
    getSeatCount(tenantId),
    getAiUsageThisMonth(tenantId),
  ]);

  return {
    planKey,
    status: sub?.status ?? "incomplete",
    seats: {
      used: seatCount,
      limit: sub?.seat_limit ?? limits.seats,
    },
    aiGenerations: {
      used: aiUsage,
      limit: sub?.ai_monthly_limit ?? limits.aiMonthly,
    },
  };
}

export const getEntitlementsSummary = cache(computeEntitlementsSummary);
