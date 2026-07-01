import { unstable_cache } from "next/cache";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { listEncountersForTenant } from "@/lib/db/repositories/encounters";

export const TENANT_CACHE_TTL_SECONDS = 60;

export type TenantCacheResource = "encounters" | "entitlements";

export function tenantCacheTag(tenantId: string, resource: TenantCacheResource) {
  return `tenant:${tenantId}:${resource}`;
}

type EncounterListOptions = {
  search?: string;
  limit?: number;
  offset?: number;
};

export async function getCachedEncountersForTenant(
  tenantId: string,
  options?: EncounterListOptions,
) {
  const search = options?.search?.trim() ?? "";
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  return unstable_cache(
    async () => {
      const admin = getSupabaseAdmin();
      if (!admin) return [];

      return listEncountersForTenant(admin, tenantId, {
        search: search || undefined,
        limit,
        offset,
      });
    },
    ["encounters", tenantId, search, String(limit), String(offset)],
    {
      revalidate: TENANT_CACHE_TTL_SECONDS,
      tags: [tenantCacheTag(tenantId, "encounters")],
    },
  )();
}

export async function getCachedEntitlementsSummary(tenantId: string) {
  return unstable_cache(
    async () => getEntitlementsSummary(tenantId),
    ["entitlements", tenantId],
    {
      revalidate: TENANT_CACHE_TTL_SECONDS,
      tags: [tenantCacheTag(tenantId, "entitlements")],
    },
  )();
}
