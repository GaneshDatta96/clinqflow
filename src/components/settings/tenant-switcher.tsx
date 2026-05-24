"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Building2, LoaderCircle } from "lucide-react";

export type TenantOption = {
  tenantId: string;
  tenantName: string;
  role: string;
};

export function TenantSwitcher({
  tenants,
  activeTenantId,
}: {
  tenants: TenantOption[];
  activeTenantId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (tenants.length <= 1) {
    return null;
  }

  function handleChange(tenantId: string) {
    if (tenantId === activeTenantId) return;

    startTransition(async () => {
      await fetch("/api/tenancy/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant_id: tenantId }),
      });
      router.refresh();
    });
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <Building2 className="h-4 w-4 text-[color:var(--muted)]" />
      <span className="sr-only">Switch organization</span>
      <select
        disabled={isPending}
        value={activeTenantId}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-[color:var(--line)] bg-white/80 px-2 py-1.5 text-sm font-semibold"
      >
        {tenants.map((tenant) => (
          <option key={tenant.tenantId} value={tenant.tenantId}>
            {tenant.tenantName} ({tenant.role})
          </option>
        ))}
      </select>
      {isPending && <LoaderCircle className="h-4 w-4 animate-spin text-[color:var(--muted)]" />}
    </label>
  );
}
