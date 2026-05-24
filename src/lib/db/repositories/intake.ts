import type { SupabaseClient } from "@supabase/supabase-js";
import { patternLibrary } from "@/lib/assessment/pattern-library";
import { normalizedIntakeSchema, type NormalizedIntake } from "@/lib/schemas/intake";
import { assessmentResultSchema, type AssessmentResult } from "@/lib/schemas/soap";

export async function getEncounterIntakeSubmission(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
): Promise<NormalizedIntake | null> {
  const { data: encounter } = await supabase
    .from("encounters")
    .select("id")
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (!encounter) {
    return null;
  }

  const { data: submission } = await supabase
    .from("intake_submissions")
    .select("normalized_json")
    .eq("encounter_id", encounterId)
    .maybeSingle();

  if (!submission?.normalized_json) {
    return null;
  }

  return normalizedIntakeSchema.parse(submission.normalized_json);
}

export async function getEncounterAssessmentResults(
  supabase: SupabaseClient,
  tenantId: string,
  encounterId: string,
): Promise<AssessmentResult[]> {
  const { data: encounter } = await supabase
    .from("encounters")
    .select("id")
    .eq("id", encounterId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (!encounter) {
    return [];
  }

  const { data: rows } = await supabase
    .from("assessment_results")
    .select("pattern_key, confidence, evidence, data_gaps, risk_level, rank")
    .eq("encounter_id", encounterId)
    .order("rank", { ascending: true });

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
