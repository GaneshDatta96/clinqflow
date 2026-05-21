import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { requirePlatformAdminContext } from "@/lib/tenancy/context";
import { getActingTenantIdFromCookies } from "@/lib/tenancy/acting-tenant";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requirePlatformAdminContext();
  } catch {
    redirect("/login");
  }

  const actingTenantId = await getActingTenantIdFromCookies();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-4 pt-20">
      <div className="mx-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 lg:mx-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-semibold">
            <Shield className="h-4 w-4" />
            Platform Admin
          </span>
          {actingTenantId ? (
            <span>
              Acting as tenant{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
                {actingTenantId}
              </code>
              {" · "}
              <Link href="/app/dashboard" className="font-semibold underline">
                Open workspace
              </Link>
            </span>
          ) : (
            <span>Select an organization below to support a customer.</span>
          )}
        </div>
      </div>
      <div className="flex-1 px-4 lg:px-8">{children}</div>
    </div>
  );
}
