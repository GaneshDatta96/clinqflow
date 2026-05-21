import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { requirePermission } from "@/lib/tenancy/context";

const schema = z.object({
  link_id: z.string().uuid(),
});

export const POST = createApiHandler({
  route: "/api/intake/links/revoke",
  step: "intake_link_revoke",
  schema,
  handler: async ({ body }) => {
    const { context } = await requirePermission("intake:link:create");
    const admin = getSupabaseAdmin();

    if (!admin) {
      throw new Error("Database not configured.");
    }

    await admin
      .from("intake_links")
      .update({ status: "revoked" })
      .eq("id", body.link_id)
      .eq("tenant_id", context.tenantId);

    await admin.from("audit_logs").insert({
      tenant_id: context.tenantId,
      actor_id: context.userId,
      action: "intake_link.revoked",
      resource_type: "intake_link",
      resource_id: body.link_id,
    });

    return jsonOk({ revoked: true });
  },
});
