import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { setActiveTenantCookie } from "@/lib/tenancy/active-tenant";
import { listUserTenants, requireUser } from "@/lib/tenancy/context";

const schema = z.object({
  tenant_id: z.string().uuid(),
});

export const POST = createApiHandler({
  route: "/api/tenancy/switch",
  step: "tenancy_switch",
  schema,
  handler: async ({ body }) => {
    const { user } = await requireUser();
    const memberships = await listUserTenants(user.id);
    const allowed = memberships.some((m) => m.tenantId === body.tenant_id);

    if (!allowed) {
      return Response.json({ error: "Organization not found." }, { status: 403 });
    }

    await setActiveTenantCookie(body.tenant_id);

    return jsonOk({ tenant_id: body.tenant_id });
  },
});
