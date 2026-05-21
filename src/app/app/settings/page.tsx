import { requireTenantContext } from "@/lib/tenancy/context";
import { hasPermission } from "@/lib/tenancy/permissions";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";
import { TeamInvitesPanel } from "@/components/settings/team-invites-panel";

export default async function SettingsPage() {
  const { context } = await requireTenantContext();
  const entitlements = await getEntitlementsSummary(context.tenantId);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Organization settings</h1>
      <dl className="space-y-3 rounded-2xl border border-[color:var(--line)] bg-white/80 p-6">
        <div>
          <dt className="text-sm text-[color:var(--muted)]">Organization</dt>
          <dd className="font-semibold">{context.tenantName}</dd>
        </div>
        <div>
          <dt className="text-sm text-[color:var(--muted)]">Slug</dt>
          <dd className="font-mono text-sm">{context.tenantSlug}</dd>
        </div>
        <div>
          <dt className="text-sm text-[color:var(--muted)]">Your role</dt>
          <dd className="font-semibold capitalize">{context.role}</dd>
        </div>
        <div>
          <dt className="text-sm text-[color:var(--muted)]">Plan</dt>
          <dd className="font-semibold capitalize">{context.planKey}</dd>
        </div>
        <div>
          <dt className="text-sm text-[color:var(--muted)]">Seats</dt>
          <dd>
            {entitlements.seats.used} / {entitlements.seats.limit}
          </dd>
        </div>
      </dl>
      {hasPermission(context.role, "members:invite") && <TeamInvitesPanel />}
    </div>
  );
}
