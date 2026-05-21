import { z } from "zod";
import { createApiHandler, jsonCreated } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import {
  generateRawIntakeToken,
  getIntakeLinkExpiry,
  hashToken,
  signIntakeJwt,
} from "@/lib/auth/intake-tokens";
import { env } from "@/lib/env";
import { requirePermission, requireClinicAccess } from "@/lib/tenancy/context";

const createLinkSchema = z.object({
  patient_id: z.string().uuid(),
  clinic_id: z.string().uuid(),
});

export const POST = createApiHandler({
  route: "/api/intake/links",
  step: "intake_link_create",
  schema: createLinkSchema,
  handler: async ({ body }) => {
    const { context } = await requirePermission("intake:link:create");
    await requireClinicAccess(body.clinic_id);

    const admin = getSupabaseAdmin();
    if (!admin) {
      throw badRequest("Intake links require database configuration.");
    }

    const rawToken = generateRawIntakeToken();
    const expiresAt = getIntakeLinkExpiry();

    const { data: link, error } = await admin
      .from("intake_links")
      .insert({
        tenant_id: context.tenantId,
        clinic_id: body.clinic_id,
        patient_id: body.patient_id,
        token_hash: hashToken(rawToken),
        expires_at: expiresAt.toISOString(),
        created_by: context.userId,
      })
      .select("id")
      .single();

    if (error || !link) {
      throw error ?? badRequest("Unable to create intake link.");
    }

    const jwt = await signIntakeJwt({
      tenantId: context.tenantId,
      clinicId: body.clinic_id,
      patientId: body.patient_id,
      linkId: link.id,
    });

    const clinic = await admin
      .from("clinics")
      .select("slug")
      .eq("id", body.clinic_id)
      .single();

    const slug = clinic.data?.slug ?? "intake";
    const url = `${env.appUrl}/c/${slug}?patientId=${body.patient_id}&token=${encodeURIComponent(jwt)}`;

    return jsonCreated({
      linkId: link.id,
      expiresAt: expiresAt.toISOString(),
      url,
      token: jwt,
    });
  },
});
