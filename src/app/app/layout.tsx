import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  Shield,
} from "lucide-react";
import {
  listUserTenants,
  requirePlatformAdminContext,
  tryGetTenantContext,
} from "@/lib/tenancy/context";
import { getActiveTenantIdFromCookies } from "@/lib/tenancy/active-tenant";
import { TenantSwitcher } from "@/components/settings/tenant-switcher";
import { hasPermission } from "@/lib/tenancy/permissions";
import { getActingTenantIdFromCookies } from "@/lib/tenancy/acting-tenant";
import { getWorkspaceNav } from "@/lib/tenancy/role-routing";
import type { TenantContext } from "@/lib/tenancy/types";
import { isAuthConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

const NAV_ICONS: Record<string, typeof LayoutDashboard> = {
  "/app/dashboard": LayoutDashboard,
  "/app/patients": Users,
  "/app/settings": Settings,
  "/app/billing": CreditCard,
  "/app/admin": Shield,
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthConfigured()) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col px-4 py-20 pt-28">
        <p className="text-center text-[color:var(--muted)]">
          Configure Supabase environment variables to use the application workspace.
        </p>
        {children}
      </div>
    );
  }

  let context: TenantContext;
  let platformStaffOnly = false;

  const tenantResult = await tryGetTenantContext();

  if (tenantResult) {
    context = tenantResult.context;
  } else {
    try {
      const staffResult = await requirePlatformAdminContext();
      context = staffResult.context;
      platformStaffOnly = true;
    } catch {
      redirect("/login");
    }
  }

  const actingTenantId = await getActingTenantIdFromCookies();
  const activeTenantId =
    (await getActiveTenantIdFromCookies()) ?? context.tenantId;
  const tenantOptions =
    !platformStaffOnly && context.userId
      ? await listUserTenants(context.userId)
      : [];

  const navItems = getWorkspaceNav({
    role: context.role,
    isPlatformAdmin: context.isPlatformAdmin ?? false,
    isPlatformSupport: context.isPlatformSupport ?? false,
    platformStaffOnly,
    actingTenantId,
  });

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col pt-20">
      {(context.isPlatformAdmin || context.isPlatformSupport) && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-950 lg:px-8">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Shield className="h-4 w-4" />
            {context.isPlatformAdmin
              ? "God mode · Platform Admin"
              : "Cliniqflow Customer Support"}
          </span>
          {actingTenantId ? (
            <>
              {" · "}Supporting clinic{" "}
              <code className="rounded bg-amber-100 px-1 text-xs">{actingTenantId}</code>
            </>
          ) : (
            <> · Select a clinic organization in the support console</>
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
          <div className="mt-2 space-y-2">
            <p className="text-sm font-semibold">
              {platformStaffOnly && !actingTenantId
                ? "No org selected"
                : context.tenantName}
            </p>
            {tenantOptions.length > 1 && (
              <TenantSwitcher
                tenants={tenantOptions.map((t) => ({
                  tenantId: t.tenantId,
                  tenantName: t.tenantName,
                  role: t.role,
                }))}
                activeTenantId={activeTenantId}
              />
            )}
          </div>
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              if (
                item.permission &&
                !context.isPlatformAdmin &&
                !context.isPlatformSupport &&
                !hasPermission(context.role, item.permission)
              ) {
                return null;
              }
              const Icon = NAV_ICONS[item.href] ?? LayoutDashboard;
              const isAdmin = item.href === "/app/admin";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition hover:bg-[color:var(--surface-strong)] ${
                    isAdmin
                      ? "bg-amber-50 text-amber-900"
                      : "text-[color:var(--muted-strong)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
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
