import { Suspense } from "react";
import { EncounterDashboardShell } from "@/components/dashboard/encounter-dashboard-shell";
import { EncounterSearch } from "@/components/dashboard/encounter-search";
import { ProofScreenShell } from "@/components/home/proof-screen-shell";
import { proofCases, proofDashboardMeta } from "@/lib/marketing/proof-data";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProofDashboardPage() {
  return (
    <ProofScreenShell>
      <div data-proof-screen="dashboard" className="mx-auto max-w-[1380px]">
        <div className="flex w-full flex-1 flex-col gap-6">
          <section className="rounded-[2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-6 py-6 sm:px-8">
            <p className="section-label">Practitioner dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {proofDashboardMeta.tenantName}
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              AI usage: {proofDashboardMeta.aiUsed} / {proofDashboardMeta.aiLimit} this month ·{" "}
              {proofCases.length} encounters
            </p>
            <div className="mt-4">
              <Suspense fallback={null}>
                <EncounterSearch />
              </Suspense>
            </div>
          </section>

          <EncounterDashboardShell cases={proofCases} />
        </div>
      </div>
    </ProofScreenShell>
  );
}
