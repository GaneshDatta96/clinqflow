import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { listClinicsForTenant } from "@/lib/clinics/store";
import { requireTenantContext } from "@/lib/tenancy/context";

export const GET = createApiHandler({
  route: "/api/clinics",
  step: "clinics_list",
  handler: async () => {
    const { context } = await requireTenantContext();
    const clinics = await listClinicsForTenant(context.tenantId);
    return jsonOk({ clinics });
  },
});
