import { requireTenantContextForPage, requireActiveSubscriptionForPage } from "@/lib/tenancy/context";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { context } = await requireTenantContextForPage();
  requireActiveSubscriptionForPage(context);
  return children;
}
