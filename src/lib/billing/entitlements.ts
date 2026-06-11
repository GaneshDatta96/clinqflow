import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { forbidden, tooManyRequests } from "@/lib/api/errors";
import { PLAN_LIMITS, isActiveSubscriptionStatus } from "@/lib/billing/plans";

export async function getTenantSubscription(tenantId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  const { data } = await admin
    .from("subscriptions")
    .select("plan_key, seat_limit, ai_monthly_limit, status")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  return data;
}

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
  const sub = await getTenantSubscription(tenantId);
  const planKey = (sub?.plan_key ?? "incomplete") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.incomplete;
  const monthlyLimit = sub?.ai_monthly_limit ?? limits.aiMonthly;

  if (!isActiveSubscriptionStatus(sub?.status ?? "incomplete")) {
    throw forbidden("Active subscription required. Subscribe in Billing to use AI features.");
  }

  const used = await getAiUsageThisMonth(tenantId);
  if (used >= monthlyLimit) {
    throw tooManyRequests(
      `AI generation limit reached (${used}/${monthlyLimit} this month). Upgrade your plan.`,
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
  await assertActiveSubscription(tenantId);
  const sub = await getTenantSubscription(tenantId);
  const planKey = (sub?.plan_key ?? "incomplete") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.incomplete;
  const seatLimit = sub?.seat_limit ?? limits.seats;
  const used = await getSeatCount(tenantId);

  if (used >= seatLimit) {
    throw forbidden(
      `Seat limit reached (${used}/${seatLimit}). Upgrade your plan to invite more users.`,
    );
  }
}

export async function getEntitlementsSummary(tenantId: string) {
  const sub = await getTenantSubscription(tenantId);
  const planKey = (sub?.plan_key ?? "incomplete") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.incomplete;

  return {
    planKey,
    status: sub?.status ?? "incomplete",
    seats: {
      used: await getSeatCount(tenantId),
      limit: sub?.seat_limit ?? limits.seats,
    },
    aiGenerations: {
      used: await getAiUsageThisMonth(tenantId),
      limit: sub?.ai_monthly_limit ?? limits.aiMonthly,
    },
  };
}
