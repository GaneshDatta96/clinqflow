import { getClinicBySlug } from "@/lib/clinics/niche-configs";
import { type EncounterDashboardCase } from "@/lib/dashboard/encounter-view";

export const proofClinic = getClinicBySlug("functional-medicine")!;

export const proofDashboardMeta = {
  tenantName: "Summit Functional Medicine",
  aiUsed: 18,
  aiLimit: 100,
};

export const proofCases: EncounterDashboardCase[] = [
  {
    id: "proof-enc-1",
    patient: {
      first_name: "Maya",
      last_name: "Chen",
      email: "maya.chen@example.com",
    },
    submitted_at: "2026-05-24T10:00:00.000Z",
    status: "ready_for_review",
    chief_complaint: "Fatigue, brain fog, and disrupted sleep",
    soap: {
      subjective:
        "Patient reports a 4-month history of low energy, afternoon crashes, and difficulty staying asleep. Symptoms worsened after a period of high work stress and inconsistent meals.",
      objective:
        "Pre-visit intake only. No vitals or physical exam documented yet. Questionnaire responses indicate irregular sleep schedule, high caffeine use, and moderate exercise tolerance.",
      assessment:
        "Structured intake suggests sleep-stress dysregulation with symptom clustering around fatigue, concentration, and recovery. Thyroid-related history and lab follow-up should be reviewed during the visit.",
      plan:
        "Draft only. Practitioner to confirm history, complete exam, and decide on counseling, labs, and follow-up plan.",
      review_status: "draft",
    },
    patterns: [
      {
        pattern_key: "sleep_stress_axis",
        confidence: 0.86,
        risk_level: "medium",
        evidence: [
          "Patient reports difficulty falling asleep 4 nights per week.",
          "Afternoon energy crashes increase on days with delayed meals.",
        ],
      },
      {
        pattern_key: "thyroid_review_flag",
        confidence: 0.63,
        risk_level: "low",
        evidence: [
          "Family history includes hypothyroidism.",
          "Cold sensitivity and brain fog were selected in symptom intake.",
        ],
      },
    ],
    appointment_request: {
      preferred_day: "Thursday",
      preferred_time: "Afternoon",
      notes: "Prefers telehealth if available.",
      status: "pending",
    },
  },
  {
    id: "proof-enc-2",
    patient: {
      first_name: "Jordan",
      last_name: "Ortiz",
      email: "jordan.ortiz@example.com",
    },
    submitted_at: "2026-05-23T14:45:00.000Z",
    status: "intake_submitted",
    chief_complaint: "Digestive discomfort and bloating after meals",
    soap: {
      subjective:
        "Patient reports bloating after lunch and dinner, intermittent abdominal discomfort, and increased symptom severity during travel weeks.",
      objective:
        "Pre-visit intake only. No physical findings yet. Questionnaire highlights meal timing variability and low water intake.",
      assessment:
        "Structured intake suggests digestive pattern review with dietary and stress-related triggers worth exploring in visit.",
      plan:
        "Draft only. Practitioner to validate symptom history, review red flags, and determine testing or diet trial approach.",
      review_status: "approved",
    },
    patterns: [
      {
        pattern_key: "digestive_irritation",
        confidence: 0.74,
        risk_level: "medium",
        evidence: [
          "Symptoms reported after larger evening meals.",
          "Travel and schedule disruption correlate with flare-ups.",
        ],
      },
    ],
    appointment_request: null,
  },
  {
    id: "proof-enc-3",
    patient: {
      first_name: "Aisha",
      last_name: "Patel",
      email: "aisha.patel@example.com",
    },
    submitted_at: "2026-05-22T09:30:00.000Z",
    status: "link_sent",
    chief_complaint: "Hormonal symptoms and cycle irregularity",
    soap: null,
    patterns: [],
    appointment_request: null,
  },
];

export const proofEncounter = proofCases[0];
