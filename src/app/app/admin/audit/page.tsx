import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { requireGodModeContextForPage } from "@/lib/tenancy/context";

export const dynamic = "force-dynamic";

type AuditLogRow = {
  id: string;
  tenant_id: string | null;
  actor_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  metadata: unknown;
  created_at: string;
};

export default async function AdminAuditPage() {
  await requireGodModeContextForPage();
  const admin = getSupabaseAdmin();
  let logs: AuditLogRow[] = [];

  if (admin) {
    const { data, error } = await admin
      .from("audit_logs")
      .select(
        "id, tenant_id, actor_id, action, resource_type, resource_id, metadata, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (!error && data) {
      logs = data;
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <h1 className="text-2xl font-semibold">Audit log</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Cross-tenant activity including impersonation and billing events.
      </p>
      <div className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white/80">
        <table className="w-full text-left text-xs">
          <thead className="border-b bg-[color:var(--surface-strong)]">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Tenant</th>
              <th className="px-3 py-2">Resource</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-[color:var(--line)]/50">
                <td className="px-3 py-2 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-3 py-2 font-mono">{log.action}</td>
                <td className="px-3 py-2 font-mono">{log.tenant_id?.slice(0, 8)}…</td>
                <td className="px-3 py-2">
                  {log.resource_type}
                  {log.resource_id ? ` · ${log.resource_id.slice(0, 8)}…` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
