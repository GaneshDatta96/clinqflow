import { z } from "zod";
import { createApiHandler, invalidateTenantCache, jsonOk } from "@/lib/api/handler";
import { notFound } from "@/lib/api/errors";
import { getEncounterForTenant } from "@/lib/db/repositories/encounters";
import { storeAppointmentRequest } from "@/lib/intake/workflow";
import { appointmentRequestSchema } from "@/lib/schemas/intake";
import { requirePermission } from "@/lib/tenancy/context";

const bodySchema = appointmentRequestSchema;

export const POST = createApiHandler({
  route: "/api/encounters/[id]/appointment-request",
  step: "appointment_request",
  rateLimit: "write",
  schema: bodySchema,
  handler: async ({ body, request }) => {
    const id = request.url.split("/encounters/")[1]?.split("/")[0];
    if (!id) throw notFound();

    const { supabase, context } = await requirePermission("encounter:write");
    const encounter = await getEncounterForTenant(supabase, context.tenantId, id);

    if (!encounter) throw notFound();

    const result = await storeAppointmentRequest(
      supabase,
      context.tenantId,
      id,
      body,
      { ownershipVerified: true },
    );

    invalidateTenantCache(context.tenantId, ["encounters"]);

    return jsonOk(result);
  },
});
