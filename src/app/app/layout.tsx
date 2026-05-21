import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  Building2,
  CreditCard,
  Shield,
} from "lucide-react";
import {
  requirePlatformAdminContext,
  tryGetTenantContext,
} from "@/lib/tenancy/context";
import { hasPermission } from "@/lib/tenancy/permissions";
import { getActingTenantIdFromCookies } from "@/lib/tenancy/acting-tenant";
import type { TenantContext } from "@/lib/tenancy/types";

const nav = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/patients", label: "Patients", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/billing", label: "Billing", icon: CreditCard, permission: "tenant:billing" as const },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let context: TenantContext;
  let platformAdminOnly = false;

  const tenantResult = await tryGetTenantContext();

  if (tenantResult) {
    context = tenantResult.context;
  } else {
    try {
      const adminResult = await requirePlatformAdminContext();
      context = adminResult.context;
      platformAdminOnly = true;
    } catch {
      redirect("/login");
    }
  }

  const actingTenantId = await getActingTenantIdFromCookies();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col pt-20">
      {context.isPlatformAdmin && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950 lg:px-8">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Shield className="h-4 w-4" />
            Platform Admin
          </span>
          {actingTenantId ? (
            <>
              {" · "}Supporting tenant{" "}
              <code className="rounded bg-amber-100 px-1 text-xs">{actingTenantId}</code>
            </>
          ) : (
            <> · Select an organization to use the workspace</>
          )}
          {" · "}
          <Link href="/app/admin" className="font-semibold underline">
            Support console
          </Link>
        </div>
      )}

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-[color:var(--line)] bg-white/80 p-4 lg:block">
          <p className="section-label">Workspace</p>
          <p className="mt-1 text-sm font-semibold">
            {platformAdminOnly && !actingTenantId
              ? "No org selected"
              : context.tenantName}
          </p>
          <nav className="mt-6 space-y-1">
            {context.isPlatformAdmin && (
              <Link
                href="/app/admin"
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-900 bg-amber-50"
              >
                <Shield className="h-4 w-4" />
                Platform Admin
              </Link>
            )}
            {(!platformAdminOnly || actingTenantId) &&
              nav.map((item) => {
                if (
                  item.permission &&
                  !context.isPlatformAdmin &&
                  !hasPermission(context.role, item.permission)
                ) {
                  return null;
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-[color:var(--muted-strong)] transition hover:bg-[color:var(--surface-strong)]"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </aside>
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
