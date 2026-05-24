import { generateSoapDraft } from "@/lib/ai/generate-soap";
import { scorePatterns } from "@/lib/assessment/score-patterns";
import { badRequest, notFound } from "@/lib/api/errors";
import { getClinicByNiche } from "@/lib/clinics/niche-configs";
import { getClinicForSlug } from "@/lib/clinics/store";
import { persistEncounterPipeline } from "@/lib/db/repositories/encounters";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { transformNicheSubmission } from "@/lib/intake/niche-intake";
import {
  type AppointmentRequestInput,
  type NormalizedIntake,
} from "@/lib/schemas/intake";
import { type NicheIntakePayload } from "@/lib/schemas/niche-intake";
import { type AssessmentResult, type SoapDraft } from "@/lib/schemas/soap";
import { type SupabaseClient } from "@supabase/supabase-js";
import { verifyIntakeJwt } from "@/lib/auth/intake-tokens";
import { assertAiGenerationAllowed } from "@/lib/billing/entitlements";
import { assertPublicIntakeRateLimit } from "@/lib/api/rate-limit";

export type ProcessedEncounter = {
  encounterId: string;
  patientId: string;
  tenantId: string;
  clinicId: string;
  normalizedIntake: NormalizedIntake;
  assessmentResults: AssessmentResult[];
  soap: SoapDraft;
  promptVersion: string;
  model: string;
  usedFallback: boolean;
  supportsAppointments: boolean;
};

async function resolvePatient(
  supabase: SupabaseClient,
  patientId: string,
  tenantId: string,
) {
  const { data, error } = await supabase
    .from("patients")
    .select(
      "id, tenant_id, clinic_id, first_name, last_name, email, phone, sex_at_birth, gender_identity",
    )
    .eq("id", patientId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    throw notFound("Patient not found.");
  }

  return data;
}

export async function processAuthenticatedIntakeSubmission(
  input: NicheIntakePayload,
  context: {
    supabase: SupabaseClient;
    tenantId: string;
    userId: string;
  },
): Promise<ProcessedEncounter> {
  const clinic =
    (await getClinicForSlug(input.clinic_slug, context.tenantId)) ??
    getClinicByNiche(input.niche);

  if (!clinic?.id) {
    throw badRequest("Clinic configuration is invalid.");
  }

  const patient = await resolvePatient(
    context.supabase,
    input.patient_id,
    context.tenantId,
  );

  if (patient.clinic_id && patient.clinic_id !== clinic.id) {
    throw badRequest("Patient does not belong to this clinic.");
  }

  const transformed = transformNicheSubmission({
    clinic,
    payload: input,
    patient: {
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email ?? "",
      phone: patient.phone ?? "",
      sexAtBirth: patient.sex_at_birth ?? "Not specified",
      genderIdentity: patient.gender_identity ?? "",
    },
  });

  const normalizedIntake = transformed.normalizedIntake;
  const assessmentResults = scorePatterns(normalizedIntake);
  await assertAiGenerationAllowed(context.tenantId);
  const generated = await generateSoapDraft({
    intake: normalizedIntake,
    assessmentResults,
    clinic,
    soapContext: transformed.soapContext,
  });

  const encounterId = await persistEncounterPipeline({
    supabase: context.supabase,
    tenantId: context.tenantId,
    clinicId: clinic.id,
    patientId: patient.id,
    createdBy: context.userId,
    normalizedIntake,
    rawInput: input,
    assessmentResults,
    soap: generated.soap,
    promptVersion: generated.promptVersion,
    model: generated.model,
  });

  await context.supabase.from("ai_generations").insert({
    tenant_id: context.tenantId,
    encounter_id: encounterId,
    prompt_version: generated.promptVersion,
    model: generated.model,
    used_fallback: generated.usedFallback,
    created_by: context.userId,
  });

  await context.supabase.from("usage_tracking").insert({
    tenant_id: context.tenantId,
    metric_key: "ai_soap_generation",
    quantity: 1,
  });

  return {
    encounterId,
    patientId: patient.id,
    tenantId: context.tenantId,
    clinicId: clinic.id,
    normalizedIntake,
    assessmentResults,
    soap: generated.soap,
    promptVersion: generated.promptVersion,
    model: generated.model,
    usedFallback: generated.usedFallback,
    supportsAppointments: true,
  };
}

export async function processPublicIntakeSubmission(
  input: NicheIntakePayload,
  intakeToken: string,
  meta?: { ipAddress?: string | null; userAgent?: string | null },
): Promise<ProcessedEncounter> {
  const claims = await verifyIntakeJwt(intakeToken);
  const admin = getSupabaseAdmin();

  if (!admin) {
    throw badRequest("Intake service is not configured.");
  }

  if (claims.patientId !== input.patient_id) {
    throw badRequest("Intake token does not match patient.");
  }

  await assertPublicIntakeRateLimit(claims.tenantId);

  const clinic = await getClinicForSlug(input.clinic_slug, claims.tenantId);

  if (!clinic?.id || clinic.id !== claims.clinicId) {
    throw badRequest("Invalid clinic for intake token.");
  }

  const { data: linkRow } = await admin
    .from("intake_links")
    .select("id, status, expires_at")
    .eq("id", claims.linkId)
    .maybeSingle();

  if (
    !linkRow ||
    linkRow.status !== "active" ||
    new Date(linkRow.expires_at) < new Date()
  ) {
    throw badRequest("Intake link is expired or invalid.");
  }

  const patient = await resolvePatient(admin, input.patient_id, claims.tenantId);

  const transformed = transformNicheSubmission({
    clinic,
    payload: input,
    patient: {
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email ?? "",
      phone: patient.phone ?? "",
      sexAtBirth: patient.sex_at_birth ?? "Not specified",
      genderIdentity: patient.gender_identity ?? "",
    },
  });

  const normalizedIntake = transformed.normalizedIntake;
  const assessmentResults = scorePatterns(normalizedIntake);
  await assertAiGenerationAllowed(claims.tenantId);
  const generated = await generateSoapDraft({
    intake: normalizedIntake,
    assessmentResults,
    clinic,
    soapContext: transformed.soapContext,
  });

  const encounterId = await persistEncounterPipeline({
    supabase: admin,
    tenantId: claims.tenantId,
    clinicId: clinic.id,
    patientId: patient.id,
    normalizedIntake,
    rawInput: input,
    assessmentResults,
    soap: generated.soap,
    promptVersion: generated.promptVersion,
    model: generated.model,
  });

  await admin
    .from("intake_links")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", claims.linkId);

  await admin.from("ai_generations").insert({
    tenant_id: claims.tenantId,
    encounter_id: encounterId,
    prompt_version: generated.promptVersion,
    model: generated.model,
    used_fallback: generated.usedFallback,
  });

  await admin.from("usage_tracking").insert({
    tenant_id: claims.tenantId,
    metric_key: "ai_soap_generation",
    quantity: 1,
  });

  const { recordConsent } = await import("@/services/consent.service");
  await recordConsent({
    tenantId: claims.tenantId,
    patientId: patient.id,
    encounterId,
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return {
    encounterId,
    patientId: patient.id,
    tenantId: claims.tenantId,
    clinicId: clinic.id,
    normalizedIntake,
    assessmentResults,
    soap: generated.soap,
    promptVersion: generated.promptVersion,
    model: generated.model,
    usedFallback: generated.usedFallback,
    supportsAppointments: true,
  };
}

export async function storeAppointmentRequest(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
  input: AppointmentRequestInput,
) {
  const encounter = await supabase
    .from("encounters")
    .select("id")
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (!encounter.data) {
    throw notFound("Encounter not found.");
  }

  const insert = await supabase.from("appointment_requests").upsert(
    {
      encounter_id: encounterId,
      preferred_day: input.preferred_day,
      preferred_time: input.preferred_time,
      notes: input.notes,
      status: "requested",
    },
    { onConflict: "encounter_id" },
  );

  if (insert.error) {
    throw insert.error;
  }

  return {
    status: "requested",
    requested_at: new Date().toISOString(),
    ...input,
  };
}
