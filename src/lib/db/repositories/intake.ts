import type { SupabaseClient } from "@supabase/supabase-js";
import { patternLibrary } from "@/lib/assessment/pattern-library";
import { normalizedIntakeSchema, type NormalizedIntake } from "@/lib/schemas/intake";
import { assessmentResultSchema, type AssessmentResult } from "@/lib/schemas/soap";

function parseAssessmentRows(
  rows: Array<{
    pattern_key: string;
    confidence: number;
    evidence: string[] | null;
    data_gaps: string[] | null;
    risk_level: string;
    rank: number;
  }> | null | undefined,
): AssessmentResult[] {
  if (!rows?.length) {
    return [];
  }

  return rows.map((row) => {
    const pattern = patternLibrary.find((item) => item.key === row.pattern_key);
    return assessmentResultSchema.parse({
      pattern_key: row.pattern_key,
      label: pattern?.label ?? row.pattern_key.replaceAll("_", " "),
      confidence: row.confidence,
      evidence: row.evidence ?? [],
      data_gaps: row.data_gaps ?? [],
      risk_level: row.risk_level,
      matched_context: [],
      rank: row.rank,
    });
  });
}

function parseIntakeSubmission(
  submission: { normalized_json: unknown } | Array<{ normalized_json: unknown }> | null | undefined,
): NormalizedIntake | null {
  const row = Array.isArray(submission) ? submission[0] : submission;
  if (!row?.normalized_json) {
    return null;
  }

  return normalizedIntakeSchema.parse(row.normalized_json);
}

export type EncounterSoapContext = {
  encounterId: string;
  intake: NormalizedIntake | null;
  assessmentResults: AssessmentResult[];
};

/** Single query for SOAP generation — avoids repeated encounter ownership checks. */
export async function getEncounterSoapContext(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
): Promise<EncounterSoapContext | null> {
  const { data, error } = await supabase
    .from("encounters")
    .select(
      `
      id,
      intake_submissions (
        normalized_json
      ),
      assessment_results (
        pattern_key,
        confidence,
        evidence,
        data_gaps,
        risk_level,
        rank
      )
    `,
    )
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    encounterId: data.id,
    intake: parseIntakeSubmission(data.intake_submissions),
    assessmentResults: parseAssessmentRows(data.assessment_results).sort(
      (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
    ),
  };
}

export async function getEncounterIntakeSubmission(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
): Promise<NormalizedIntake | null> {
  const { data, error } = await supabase
    .from("encounters")
    .select(
      `
      id,
      intake_submissions (
        normalized_json
      )
    `,
    )
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return parseIntakeSubmission(data.intake_submissions);
}

export async function getEncounterAssessmentResults(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
): Promise<AssessmentResult[]> {
  const { data, error } = await supabase
    .from("encounters")
    .select(
      `
      id,
      assessment_results (
        pattern_key,
        confidence,
        evidence,
        data_gaps,
        risk_level,
        rank
      )
    `,
    )
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return parseAssessmentRows(data.assessment_results).sort(
    (a, b) => (a.rank ?? 0) - (b.rank ?? 0),
  );
}

export async function assertPatientInTenantClinic(args: {
  supabase: SupabaseClient;
  tenantId: string;
  patientId: string;
  clinicId: string;
}) {
  const { data: patient } = await args.supabase
    .from("patients")
    .select("id, clinic_id")
    .eq("id", args.patientId)
    .eq("tenant_id", args.tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!patient) {
    return false;
  }

  if (patient.clinic_id && patient.clinic_id !== args.clinicId) {
    return false;
  }

  return true;
}
