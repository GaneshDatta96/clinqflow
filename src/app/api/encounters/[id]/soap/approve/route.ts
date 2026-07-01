import { z } from "zod";
import { createApiHandler, invalidateTenantCache, jsonOk } from "@/lib/api/handler";
import { notFound } from "@/lib/api/errors";
import { getEncounterForTenant } from "@/lib/db/repositories/encounters";
import { requirePermission } from "@/lib/tenancy/context";

const schema = z.object({
  review_status: z.enum(["approved", "draft", "needs_revision"]).default("approved"),
});

export const POST = createApiHandler({
  route: "/api/encounters/[id]/soap/approve",
  step: "soap_approve",
  rateLimit: "write",
  schema,
  handler: async ({ body, request }) => {
    const id = request.url.split("/encounters/")[1]?.split("/")[0];
    if (!id) throw notFound();

    const { supabase, context } = await requirePermission("soap:approve");
    const encounter = await getEncounterForTenant(supabase, context.tenantId, id);

    if (!encounter) throw notFound();

    const { error } = await supabase
      .from("soap_notes")
      .update({ review_status: body.review_status })
      .eq("encounter_id", id);

    if (error) throw error;

    await supabase.from("audit_logs").insert({
      tenant_id: context.tenantId,
      actor_id: context.userId,
      action: "soap.review_updated",
      resource_type: "encounter",
      resource_id: id,
      metadata: { review_status: body.review_status },
    });

    invalidateTenantCache(context.tenantId, ["encounters"]);

    return jsonOk({ review_status: body.review_status });
  },
});
