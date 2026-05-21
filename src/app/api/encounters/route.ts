import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { listEncountersForTenant } from "@/lib/db/repositories/encounters";
import { requirePermission } from "@/lib/tenancy/context";

export const GET = createApiHandler({
  route: "/api/encounters",
  step: "encounters_list",
  handler: async ({ request }) => {
    const { supabase, context } = await requirePermission("encounter:read");
    const url = new URL(request.url);
    const search = url.searchParams.get("q") ?? undefined;
    const limit = Number.parseInt(url.searchParams.get("limit") ?? "50", 10);
    const offset = Number.parseInt(url.searchParams.get("offset") ?? "0", 10);

    const encounters = await listEncountersForTenant(supabase, context.tenantId, {
      search,
      limit: Number.isFinite(limit) ? limit : 50,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return jsonOk({ encounters });
  },
});
