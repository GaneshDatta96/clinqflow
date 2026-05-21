import { type EncounterListItem } from "@/lib/db/repositories/encounters";

export type EncounterDashboardCase = {
  id: string;
  patient: {
    first_name: string;
    last_name: string;
    email: string | null;
  };
  submitted_at: string | null;
  status: string;
  chief_complaint: string;
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    review_status: string;
  } | null;
  patterns: Array<{
    pattern_key: string;
    confidence: number;
    risk_level: string;
    evidence: string[];
  }>;
  appointment_request: EncounterListItem["appointment_request"];
};

export function mapEncounterToDashboardCase(
  item: EncounterListItem,
): EncounterDashboardCase {
  return {
    id: item.id,
    patient: item.patient,
    submitted_at: item.submitted_at,
    status: item.status,
    chief_complaint: item.chief_complaint,
    soap: item.soap_notes,
    appointment_request: item.appointment_request,
    patterns: item.assessment_results.map((p) => ({
      pattern_key: p.pattern_key,
      confidence: p.confidence,
      risk_level: p.risk_level,
      evidence: Array.isArray(p.evidence) ? p.evidence : [],
    })),
  };
}
