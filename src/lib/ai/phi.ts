import type { NormalizedIntake } from "@/lib/schemas/intake";
import { isAiPhiRestricted } from "@/lib/env";

export function minimizeIntakeForAi(intake: NormalizedIntake): NormalizedIntake {
  if (!isAiPhiRestricted()) {
    return intake;
  }

  return {
    ...intake,
    patient_info: {
      ...intake.patient_info,
      first_name: "Patient",
      last_name: intake.patient_info.last_name?.slice(0, 1) ?? "X",
      contact: {
        phone: "[redacted]",
        email: "[redacted]",
      },
    },
    chief_complaint: {
      ...intake.chief_complaint,
      primary_issue: intake.chief_complaint.primary_issue.slice(0, 500),
    },
    goals: {
      ...intake.goals,
      expectations: intake.goals.expectations?.slice(0, 300) ?? intake.goals.expectations,
    },
    history: {
      ...intake.history,
      medications: intake.history.medications.map(() => "[redacted]"),
      family_history: intake.history.family_history.map((item) =>
        item.length > 80 ? `${item.slice(0, 80)}…` : item,
      ),
    },
  };
}
