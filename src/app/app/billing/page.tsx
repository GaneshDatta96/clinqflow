import { redirect } from "next/navigation";
import { requireTenantContextForPage } from "@/lib/tenancy/context";
import { hasPermission } from "@/lib/tenancy/permissions";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";
import { BillingActions } from "@/components/settings/billing-actions";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const { context, supabase } = await requireTenantContextForPage();
  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", context.userId)
    .maybeSingle();

  if (!hasPermission(context.role, "tenant:billing") && !context.isPlatformAdmin) {
    redirect("/app/dashboard");
  }

  const entitlements = await getEntitlementsSummary(context.tenantId);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Billing</h1>
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
