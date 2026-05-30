import type { NormalizedIntake } from "@/lib/schemas/intake";
import { isAiPhiRestricted } from "@/lib/env";

/**
 * Restricted AI mode: send only age, sex, symptoms, and symptom-related chief complaint text.
 * Questionnaire Q&A is passed separately via SOAP_CONTEXT in generateSoapDraft.
 */
export function minimizeIntakeForAi(intake: NormalizedIntake): NormalizedIntake {
  if (!isAiPhiRestricted()) {
    return intake;
  }

  return {
    ...intake,
    patient_info: {
      first_name: "Patient",
      last_name: "X",
      age: intake.patient_info.age,
      sex_at_birth: intake.patient_info.sex_at_birth,
      gender_identity: intake.patient_info.gender_identity,
      contact: {
        phone: "[redacted]",
        email: "[redacted]",
      },
    },
    chief_complaint: {
      primary_issue: intake.chief_complaint.primary_issue.slice(0, 500),
      duration: "",
      severity_0_10: intake.chief_complaint.severity_0_10,
      onset: "",
      aggravating_factors: [],
      relieving_factors: [],
    },
    symptoms: intake.symptoms,
    history: {
      conditions: [],
      medications: [],
      surgeries: [],
      family_history: [],
    },
    lifestyle: {
      diet: "",
      exercise: "",
      sleep: "",
      stress: "",
      substance_use: "",
    },
    goals: {
      patient_priorities: [],
      expectations: "",
    },
    red_flags: intake.red_flags,
    metadata: intake.metadata,
  };
}
