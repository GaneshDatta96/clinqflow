import { CreditCard, LayoutDashboard, Settings, Users } from "lucide-react";
import type { ReactNode } from "react";
import { proofDashboardMeta } from "@/lib/marketing/proof-data";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Patients", icon: Users, active: false },
  { label: "Settings", icon: Settings, active: false },
  { label: "Billing", icon: CreditCard, active: false },
] as const;

export function AppWorkspacePreviewShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full bg-[color:var(--background)]">
      <aside className="w-[13.5rem] shrink-0 border-r border-[color:var(--line)] bg-white/95 px-4 py-5">
        <p className="section-label">Workspace</p>
        <p className="mt-2 text-sm font-semibold leading-snug text-[color:var(--foreground)]">
          {proofDashboardMeta.tenantName}
        </p>
        <nav className="mt-6 space-y-0.5" aria-hidden>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
                item.active
                  ? "bg-[color:var(--surface-muted)] text-[color:var(--foreground)]"
                  : "text-[color:var(--muted-strong)]"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 px-5 py-5">{children}</div>
    </div>
  );
}

export function DashboardHeaderPreview() {
  return (
    <section className="rounded-[1.75rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-6 py-5">
      <p className="section-label">Practitioner dashboard</p>
      <h1 className="mt-2 text-[1.65rem] font-semibold tracking-tight text-[color:var(--foreground)]">
        {proofDashboardMeta.tenantName}
      </h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">
        AI usage: {proofDashboardMeta.aiUsed} / {proofDashboardMeta.aiLimit} this month · 3
        encounters
      </p>
    </section>
  );
}
