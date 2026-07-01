import { redirect } from "next/navigation";
import { requireTenantContextForPage } from "@/lib/tenancy/context";
import { hasPermission } from "@/lib/tenancy/permissions";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";
import { PLAN_LIMITS } from "@/lib/billing/plans";
import { BillingActions } from "@/components/settings/billing-actions";

export const dynamic = "force-dynamic";

type EntitlementsSummary = Awaited<ReturnType<typeof getEntitlementsSummary>>;

function defaultEntitlements(): EntitlementsSummary {
  return {
    planKey: "incomplete",
    status: "incomplete",
    seats: { used: 1, limit: PLAN_LIMITS.incomplete.seats },
    aiGenerations: { used: 0, limit: PLAN_LIMITS.incomplete.aiMonthly },
  };
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarded?: string }>;
}) {
  const { context, supabase } = await requireTenantContextForPage();
  const params = await searchParams;
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", context.userId)
    .maybeSingle();

  if (!hasPermission(context.role, "tenant:billing") && !context.isPlatformAdmin) {
    redirect("/app/dashboard");
  }

  let entitlements: EntitlementsSummary = defaultEntitlements();
  try {
    entitlements = await getEntitlementsSummary(context.tenantId);
  } catch {
    // Billing UI should still render when usage queries fail transiently.
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Billing</h1>
      {params.onboarded === "1" ? (
        <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Your clinic workspace is ready. Choose a plan below to activate it.
        </p>
      ) : null}
      {entitlements.status !== "active" ? (
        <p className="text-sm leading-6 text-[color:var(--muted)]">
          Subscribe to activate your clinic workspace. CliniqFlow does not include a free trial—choose
          a plan below after sign-up.
        </p>
      ) : null}
      <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-6 space-y-4">
        <p className="text-sm text-[color:var(--muted)]">Current plan</p>
        <p className="text-2xl font-semibold capitalize">{entitlements.planKey}</p>
        <p className="text-sm">Status: {entitlements.status}</p>
        <ul className="space-y-2 text-sm text-[color:var(--muted)]">
          <li>
            Seats: {entitlements.seats.used} / {entitlements.seats.limit}
          </li>
          <li>
            AI generations: {entitlements.aiGenerations.used} /{" "}
            {entitlements.aiGenerations.limit} this month
          </li>
        </ul>
        <BillingActions
          currentPlan={entitlements.planKey}
          userEmail={profile?.email ?? null}
        />
      </div>
    </div>
  );
}
