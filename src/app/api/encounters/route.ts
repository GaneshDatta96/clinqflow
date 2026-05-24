import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { listEncountersForTenant } from "@/lib/db/repositories/encounters";
import { logPhiAccessIfPlatformStaff, requirePermission } from "@/lib/tenancy/context";

export const GET = createApiHandler({
  route: "/api/encounters",
  step: "encounters_list",
  handler: async ({ request }) => {
    const { supabase, context } = await requirePermission("encounter:read");
    const url = new URL(request.url);
    const search = url.searchParams.get("q") ?? undefined;
    const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "50", 10);
    const limit = Math.min(Math.max(Number.isFinite(limitParam) ? limitParam : 50, 1), 100);
    const offset = Number.parseInt(url.searchParams.get("offset") ?? "0", 10);

    await logPhiAccessIfPlatformStaff({
      supabase,
      context,
      action: "phi.encounter.list",
      resourceType: "encounter",
      metadata: { search: search ?? null },
    });

    const encounters = await listEncountersForTenant(supabase, context.tenantId, {
      search,
      limit,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return jsonOk({ encounters });
  },
});
