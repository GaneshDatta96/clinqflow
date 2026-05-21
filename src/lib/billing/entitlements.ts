import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { forbidden, tooManyRequests } from "@/lib/api/errors";
import { PLAN_LIMITS } from "@/lib/billing/stripe";

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
  const planKey = (sub?.plan_key ?? "trial") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.trial;
  const monthlyLimit = sub?.ai_monthly_limit ?? limits.aiMonthly;

  if (sub?.status === "canceled" || sub?.status === "past_due") {
    throw forbidden("Subscription inactive. Update billing to continue AI features.");
  }

  const used = await getAiUsageThisMonth(tenantId);
  if (used >= monthlyLimit) {
    throw tooManyRequests(
      `AI generation limit reached (${used}/${monthlyLimit} this month). Upgrade your plan.`,
    );
  }
}

export async function assertSeatAvailable(tenantId: string) {
  const sub = await getTenantSubscription(tenantId);
  const planKey = (sub?.plan_key ?? "trial") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.trial;
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
  const planKey = (sub?.plan_key ?? "trial") as keyof typeof PLAN_LIMITS;
  const limits = PLAN_LIMITS[planKey] ?? PLAN_LIMITS.trial;

  return {
    planKey,
    status: sub?.status ?? "trialing",
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
