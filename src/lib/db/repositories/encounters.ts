import { type SupabaseClient } from "@supabase/supabase-js";
import { type AssessmentResult, type SoapDraft } from "@/lib/schemas/soap";
import { type NormalizedIntake } from "@/lib/schemas/intake";

export type EncounterListItem = {
  id: string;
  patient_id: string;
  status: string;
  chief_complaint: string;
  submitted_at: string | null;
  created_at: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string | null;
  };
  soap_notes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    review_status: string;
  } | null;
  assessment_results: Array<{
    pattern_key: string;
    confidence: number;
    risk_level: string;
    rank: number;
    evidence: string[];
  }>;
  appointment_request: {
    preferred_day: string;
    preferred_time: string;
    notes: string;
    status: string;
  } | null;
};

export async function listEncountersForTenant(
  supabase: SupabaseClient,
  tenantId: string,
  options?: { limit?: number; offset?: number; search?: string },
) {
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  let query = supabase
    .from("encounters")
    .select(
      `
      id,
      patient_id,
      status,
      chief_complaint,
      submitted_at,
      created_at,
      patients!inner (
        first_name,
        last_name,
        email,
        tenant_id
      ),
      soap_notes (
        subjective,
        objective,
        assessment,
        plan,
        review_status
      ),
      assessment_results (
        pattern_key,
        confidence,
        risk_level,
        rank,
        evidence
      ),
      appointment_requests (
        preferred_day,
        preferred_time,
        notes,
        status
      )
    `,
    )
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (options?.search?.trim()) {
    const term = options.search.trim().replace(/[%_,]/g, "");
    query = query.or(
      `chief_complaint.ilike.%${term}%,patients.first_name.ilike.%${term}%,patients.last_name.ilike.%${term}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const patient = Array.isArray(row.patients) ? row.patients[0] : row.patients;
    const soap = Array.isArray(row.soap_notes)
      ? row.soap_notes[0]
      : row.soap_notes;
    const assessments = Array.isArray(row.assessment_results)
      ? row.assessment_results
      : [];
    const appointment = Array.isArray(row.appointment_requests)
      ? row.appointment_requests[0]
      : row.appointment_requests;

    return {
      id: row.id,
      patient_id: row.patient_id,
      status: row.status,
      chief_complaint: row.chief_complaint,
      submitted_at: row.submitted_at,
      created_at: row.created_at,
      patient: {
        first_name: patient?.first_name ?? "",
        last_name: patient?.last_name ?? "",
        email: patient?.email ?? null,
      },
      soap_notes: soap
        ? {
            subjective: soap.subjective,
            objective: soap.objective,
            assessment: soap.assessment,
            plan: soap.plan,
            review_status: soap.review_status,
          }
        : null,
      assessment_results: assessments.sort(
        (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
      ),
      appointment_request: appointment
        ? {
            preferred_day: appointment.preferred_day,
            preferred_time: appointment.preferred_time,
            notes: appointment.notes ?? "",
            status: appointment.status,
          }
        : null,
    } satisfies EncounterListItem;
  });
}

export async function getEncounterForTenant(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
) {
  const { data, error } = await supabase
    .from("encounters")
    .select("id, tenant_id, patient_id, clinic_id, status")
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getEncounterDetailForTenant(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
) {
  const { data, error } = await supabase
    .from("encounters")
    .select(
      `
      id,
      patient_id,
      status,
      chief_complaint,
      submitted_at,
      created_at,
      patients!inner (
        first_name,
        last_name,
        email,
        tenant_id
      ),
      soap_notes (
        subjective,
        objective,
        assessment,
        plan,
        review_status
      ),
      assessment_results (
        pattern_key,
        confidence,
        risk_level,
        rank,
        evidence
      ),
      appointment_requests (
        preferred_day,
        preferred_time,
        notes,
        status
      )
    `,
    )
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const patient = Array.isArray(data.patients) ? data.patients[0] : data.patients;
  const soap = Array.isArray(data.soap_notes) ? data.soap_notes[0] : data.soap_notes;
  const assessments = Array.isArray(data.assessment_results)
    ? data.assessment_results
    : [];
  const appointment = Array.isArray(data.appointment_requests)
    ? data.appointment_requests[0]
    : data.appointment_requests;

  return {
    id: data.id,
    patient_id: data.patient_id,
    status: data.status,
    chief_complaint: data.chief_complaint,
    submitted_at: data.submitted_at,
    created_at: data.created_at,
    patient: {
      first_name: patient?.first_name ?? "",
      last_name: patient?.last_name ?? "",
      email: patient?.email ?? null,
    },
    soap_notes: soap
      ? {
          subjective: soap.subjective,
          objective: soap.objective,
          assessment: soap.assessment,
          plan: soap.plan,
          review_status: soap.review_status,
        }
      : null,
    assessment_results: assessments.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)),
    appointment_request: appointment
      ? {
          preferred_day: appointment.preferred_day,
          preferred_time: appointment.preferred_time,
          notes: appointment.notes ?? "",
          status: appointment.status,
        }
      : null,
  } satisfies EncounterListItem;
}

export async function persistEncounterPipeline(args: {
  supabase: SupabaseClient;
  tenantId: string;
  clinicId: string;
  patientId: string;
  createdBy?: string;
  normalizedIntake: NormalizedIntake;
  rawInput: unknown;
  assessmentResults: AssessmentResult[];
  soap: SoapDraft;
  promptVersion: string;
  model: string;
}) {
  const encounterId = crypto.randomUUID();

  const patientUpdate = await args.supabase
    .from("patients")
    .update({
      tenant_id: args.tenantId,
      clinic_id: args.clinicId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", args.patientId);

  if (patientUpdate.error) {
    throw patientUpdate.error;
  }

  const encounterInsert = await args.supabase.from("encounters").insert({
    id: encounterId,
    tenant_id: args.tenantId,
    clinic_id: args.clinicId,
    patient_id: args.patientId,
    status: "submitted",
    chief_complaint: args.normalizedIntake.chief_complaint.primary_issue,
    submitted_at: args.normalizedIntake.metadata.submitted_at,
    created_by: args.createdBy ?? null,
  });

  if (encounterInsert.error) {
    throw encounterInsert.error;
  }

  const intakeInsert = await args.supabase.from("intake_submissions").insert({
    encounter_id: encounterId,
    schema_version: args.normalizedIntake.schema_version,
    raw_json: args.rawInput,
    normalized_json: args.normalizedIntake,
  });

  if (intakeInsert.error) {
    throw intakeInsert.error;
  }

  const assessmentInsert = await args.supabase.from("assessment_results").insert(
    args.assessmentResults.map((item) => ({
      encounter_id: encounterId,
      pattern_key: item.pattern_key,
      confidence: item.confidence,
      evidence: item.evidence,
      data_gaps: item.data_gaps,
      risk_level: item.risk_level,
      rank: item.rank,
    })),
  );

  if (assessmentInsert.error) {
    throw assessmentInsert.error;
  }

  const soapInsert = await args.supabase.from("soap_notes").upsert(
    {
      encounter_id: encounterId,
      subjective: args.soap.subjective,
      objective: args.soap.objective,
      assessment: args.soap.assessment,
      plan: args.soap.plan_draft,
      soap_json: args.soap,
      prompt_version: args.promptVersion,
      model: args.model,
      review_status: "draft",
    },
    { onConflict: "encounter_id" },
  );

  if (soapInsert.error) {
    throw soapInsert.error;
  }

  return encounterId;
}
