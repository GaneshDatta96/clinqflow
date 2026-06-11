import { Suspense } from "react";
import { EncounterDashboardShell } from "@/components/dashboard/encounter-dashboard-shell";
import { EncounterSearch } from "@/components/dashboard/encounter-search";
import { mapEncounterToDashboardCase } from "@/lib/dashboard/encounter-view";
import { listEncountersForTenant } from "@/lib/db/repositories/encounters";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";
import { requireTenantContextForPage } from "@/lib/tenancy/context";

export const dynamic = "force-dynamic";

export default async function AppDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { supabase, context } = await requireTenantContextForPage();

  const [encounters, entitlements] = await Promise.all([
    listEncountersForTenant(supabase, context.tenantId, { search: q }),
    getEntitlementsSummary(context.tenantId),
  ]);
  const cases = encounters.map(mapEncounterToDashboardCase);

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <section className="rounded-[2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-6 py-6 sm:px-8">
        <p className="section-label">Practitioner dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {context.tenantName}
        </h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          AI usage: {entitlements.aiGenerations.used} / {entitlements.aiGenerations.limit}{" "}
          this month · {cases.length} encounter{cases.length === 1 ? "" : "s"}
        </p>
        <div className="mt-4">
          <Suspense fallback={null}>
            <EncounterSearch />
          </Suspense>
        </div>
      </section>
      <EncounterDashboardShell cases={cases} />
    </div>
  );
}
