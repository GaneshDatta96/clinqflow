"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Building2, ExternalLink, LoaderCircle } from "lucide-react";
import { useSessionRole } from "@/lib/query/hooks";

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  plan_key: string;
  subscription_status: string;
  created_at: string;
};

export default function PlatformAdminPage() {
  const { data: sessionRole } = useSessionRole();
  const isGodMode = sessionRole?.isPlatformAdmin ?? false;
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/tenants")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTenants(data.tenants ?? []);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load tenants"),
      );
  }, []);

  function actAsTenant(tenantId: string) {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      try {
        const res = await fetch("/api/admin/acting-tenant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_id: tenantId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to set acting tenant");
        setMessage(data.message ?? "Organization selected.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed");
      }
    });
  }

  function clearActing() {
    startTransition(async () => {
      await fetch("/api/admin/acting-tenant", { method: "DELETE" });
      setMessage("Cleared acting organization.");
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Customer support console
        </h1>
        <p className="mt-2 max-w-2xl text-[color:var(--muted)]">
          Cross-tenant access for support and data fixes. Select an organization,
          then use the normal dashboard and patients tools as that tenant.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={clearActing}
          disabled={isPending}
          className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
        >
          Clear selection
        </button>
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-white"
        >
          Open workspace
          <ExternalLink className="h-4 w-4" />
        </Link>
        {isGodMode && (
          <>
            <Link
              href="/app/admin/audit"
              className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
            >
              Audit log
            </Link>
            <Link
              href="/app/admin/analytics"
              className="rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
            >
              Analytics
            </Link>
          </>
        )}
      </div>

      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[color:var(--line)] bg-white/80">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[color:var(--line)] bg-[color:var(--surface-strong)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Organization</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id} className="border-b border-[color:var(--line)]/60">
                <td className="px-4 py-3">
                  <p className="font-semibold">{t.name}</p>
                  <p className="font-mono text-xs text-[color:var(--muted)]">
                    {t.slug}
                  </p>
                </td>
                <td className="px-4 py-3 capitalize">{t.plan_key}</td>
                <td className="px-4 py-3">{t.subscription_status}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => actAsTenant(t.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  >
                    {isPending ? (
                      <LoaderCircle className="h-3 w-3 animate-spin" />
                    ) : (
                      <Building2 className="h-3 w-3" />
                    )}
                    Act as this org
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && !error && (
          <p className="px-4 py-8 text-center text-[color:var(--muted)]">
            No organizations yet.
          </p>
        )}
      </div>
    </div>
  );
}
