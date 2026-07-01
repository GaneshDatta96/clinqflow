import { z } from "zod";
import {
  createApiHandler,
  jsonCreated,
} from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import { createPatientForClinic } from "@/lib/db/repositories/patients";
import { assertActiveSubscription } from "@/lib/billing/entitlements";
import { requirePermission, requireClinicAccess } from "@/lib/tenancy/context";

const createPatientSchema = z.object({
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  email: z.string().trim().email(),
  clinic_id: z.string().uuid(),
  phone: z.string().trim().optional(),
});

export const POST = createApiHandler({
  route: "/api/patients/create",
  step: "patient_create",
  rateLimit: "write",
  schema: createPatientSchema,
  handler: async ({ body }) => {
    const { supabase, context } = await requirePermission("patient:create");
    await assertActiveSubscription(context.tenantId);
    const { context: clinicContext } = await requireClinicAccess(body.clinic_id);

    if (clinicContext.tenantId !== context.tenantId) {
      throw badRequest("Clinic does not belong to your organization.");
    }

    const patient = await createPatientForClinic(supabase, {
      tenantId: context.tenantId,
      clinicId: body.clinic_id,
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      phone: body.phone,
      createdBy: context.userId,
    });

    return jsonCreated({
      id: patient.id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      created_at: patient.created_at,
    });
  },
});
