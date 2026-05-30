import Link from "next/link";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/tenancy/permissions";
import { requireTenantContext } from "@/lib/tenancy/context";

export const dynamic = "force-dynamic";

export default async function ComplianceSettingsPage() {
  const { context } = await requireTenantContext();

  if (!hasPermission(context.role, "tenant:manage") && !context.isPlatformAdmin) {
    redirect("/app/settings");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Compliance</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Export audit activity and review HIPAA-oriented controls for your organization.
      </p>
      <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-6 space-y-4">
        <a
          href="/api/compliance/audit-export"
          className="inline-flex rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Download audit log (JSON)
        </a>
        <p className="text-xs text-[color:var(--muted)]">
          Includes tenant-scoped audit events. Do not share exports outside your compliance program.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[color:var(--accent)]">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/dpa">Data Processing Addendum</Link>
          <Link href="/security-policy">Security Policy</Link>
          <Link href="/subprocessors">Subprocessors</Link>
          <Link href="/privacy-request">Privacy Requests</Link>
        </div>
      </div>
    </div>
  );
}
