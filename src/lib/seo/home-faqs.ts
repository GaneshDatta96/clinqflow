export type HomeFaq = {
  question: string;
  answer: string;
};

export const HOME_FAQS: HomeFaq[] = [
  {
    question: "Is CliniqFlow an EHR?",
    answer:
      "No. CliniqFlow is an intake, documentation, and practitioner-support workflow layer. It is designed to organize the work before and around the visit, not replace a full EHR.",
  },
  {
    question: "Does it diagnose patients or finalize notes automatically?",
    answer:
      "No. CliniqFlow structures intake, organizes responses into documentation themes, and prepares draft documentation. Licensed practitioners remain responsible for diagnosis, interpretation, and final approval.",
  },
  {
    question: "Can intake be tailored by clinic or specialty?",
    answer:
      "Yes. Intake flows are driven by specialty-specific configurations so clinics can collect structured context that fits their workflow instead of forcing a generic questionnaire.",
  },
  {
    question: "What happens after a clinic signs up?",
    answer:
      "Teams create their workspace, complete onboarding, and begin sending signed intake links. From there, the dashboard, encounter review, and documentation workflow become the operating surface for pre-visit preparation.",
  },
  {
    question: "What is AI-assisted documentation and clinical decision-support?",
    answer:
      "CliniqFlow uses AI to help prepare draft documentation from structured intake context. Outputs are drafts for licensed practitioner review and approval—not autonomous clinical decisions.",
  },
  {
    question: "How does CliniqFlow handle patient data security?",
    answer:
      "CliniqFlow uses HTTPS/TLS, tenant-isolated access controls, and role-based permissions. See our Security page and Security Policy for full details on safeguards and subprocessors.",
  },
];
