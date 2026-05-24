import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest, forbidden } from "@/lib/api/errors";
import { assertPatientInTenantClinic } from "@/lib/db/repositories/intake";
import { requirePermission } from "@/lib/tenancy/context";

const saveSchema = z.object({
  patient_id: z.string().uuid(),
  clinic_id: z.string().uuid(),
  step_index: z.number().int().min(0).default(0),
  answers_json: z.record(z.string(), z.unknown()),
});

export const GET = createApiHandler({
  route: "/api/intake/drafts",
  step: "intake_draft_get",
  handler: async ({ request }) => {
    const { supabase, context } = await requirePermission("encounter:write");
    const url = new URL(request.url);
    const patientId = url.searchParams.get("patient_id");
    const clinicId = url.searchParams.get("clinic_id");

    if (!patientId || !clinicId) {
      throw badRequest("patient_id and clinic_id are required.");
    }

    const allowed = await assertPatientInTenantClinic({
      supabase,
      tenantId: context.tenantId,
      patientId,
      clinicId,
    });

    if (!allowed) {
      throw forbidden("Patient not found in this clinic.");
    }

    const { data } = await supabase
      .from("intake_drafts")
      .select("step_index, answers_json, updated_at")
      .eq("tenant_id", context.tenantId)
      .eq("patient_id", patientId)
      .eq("clinic_id", clinicId)
      .maybeSingle();

    return jsonOk({ draft: data ?? null });
  },
});

export const PUT = createApiHandler({
  route: "/api/intake/drafts",
  step: "intake_draft_save",
  schema: saveSchema,
  handler: async ({ body }) => {
    const { supabase, context } = await requirePermission("encounter:write");

    const allowed = await assertPatientInTenantClinic({
      supabase,
      tenantId: context.tenantId,
      patientId: body.patient_id,
      clinicId: body.clinic_id,
    });

    if (!allowed) {
      throw forbidden("Patient not found in this clinic.");
    }

    const { data, error } = await supabase
      .from("intake_drafts")
      .upsert(
        {
          tenant_id: context.tenantId,
          clinic_id: body.clinic_id,
          patient_id: body.patient_id,
          step_index: body.step_index,
          answers_json: body.answers_json,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "patient_id,clinic_id" },
      )
      .select("step_index, updated_at")
      .single();

    if (error) {
      throw error;
    }

    return jsonOk({ draft: data });
  },
});
