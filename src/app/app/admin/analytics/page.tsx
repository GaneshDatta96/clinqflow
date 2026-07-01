import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { requireGodModeContextForPage } from "@/lib/tenancy/context";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  await requireGodModeContextForPage();
  const admin = getSupabaseAdmin();

  const [tenantCount, encounterCount, aiUsage] = admin
    ? await Promise.all([
        admin
          .from("tenants")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
        admin
          .from("encounters")
          .select("id", { count: "exact", head: true })
          .is("deleted_at", null),
        admin
          .from("usage_tracking")
          .select("id", { count: "exact", head: true })
          .eq("metric_key", "ai_soap_generation"),
      ])
    : [{ count: 0 }, { count: 0 }, { count: 0 }];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <h1 className="text-2xl font-semibold">Platform analytics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active tenants" value={tenantCount.count ?? 0} />
        <StatCard label="Encounters" value={encounterCount.count ?? 0} />
        <StatCard label="AI generations (all time)" value={aiUsage.count ?? 0} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-6">
      <p className="text-sm text-[color:var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
