import Link from "next/link";
import { notFound } from "next/navigation";
import { EncounterDetailView } from "@/components/dashboard/encounter-detail-view";
import { getEncounterDetailForTenant } from "@/lib/db/repositories/encounters";
import { mapEncounterToDashboardCase } from "@/lib/dashboard/encounter-view";
import { writeAuditLog } from "@/services/audit.service";
import { requireTenantContextForPage } from "@/lib/tenancy/context";

export const dynamic = "force-dynamic";

export default async function EncounterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, context } = await requireTenantContextForPage();
  const encounter = await getEncounterDetailForTenant(supabase, context.tenantId, id);

  if (!encounter) {
    notFound();
  }

  if (!context.isPlatformAdmin) {
    await writeAuditLog({
      supabase,
      tenantId: context.tenantId,
      actorId: context.userId,
      action: "phi.encounter.view",
      resourceType: "encounter",
      resourceId: id,
    });
  }

  const caseView = mapEncounterToDashboardCase(encounter);

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <Link
        href="/app/dashboard"
        className="text-sm font-semibold text-[color:var(--accent)]"
      >
        ← Back to dashboard
      </Link>
      <EncounterDetailView encounter={caseView} />
    </div>
  );
}
