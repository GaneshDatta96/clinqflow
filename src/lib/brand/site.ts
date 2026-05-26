export const BRAND = {
  name: "CliniqFlow",
  nameDisplay: "CliniqFlow",
  tagline: "Calm intake and documentation workflows for clinics",
  bigIdea: "Reduce chaos before the appointment begins.",
  positioning:
    "A clinical intake infrastructure platform that helps teams collect structured patient context, reduce repetitive discovery conversations, and keep documentation review-first.",
  narrative:
    "CliniqFlow organizes pre-visit intake, patient communication, and documentation setup so practitioners begin with clearer context and less operational chaos.",
  signupHref: "/signup",
  loginHref: "/login",
  colors: {
    primary: "#0B1020",
    secondary: "#7C3AED",
    background: "#FAFAF7",
    accentSoft: "#E5E7EB",
    text: "#0B1020",
  },
  pillars: [
    {
      title: "Operational efficiency",
      description:
        "Reduce repetitive intake and documentation work before appointments begin.",
    },
    {
      title: "Better patient communication",
      description:
        "Help patients share context openly through structured pre-visit questionnaires.",
    },
    {
      title: "Practitioner support",
      description:
        "Reduce cognitive overload and preserve mental energy for patient care.",
    },
    {
      title: "Structured clinical workflows",
      description:
        "Turn fragmented intake into organized context practitioners can review quickly.",
    },
  ],
  hero: {
    headline: "Reduce intake chaos before the appointment even begins.",
    subheadline:
      "CliniqFlow helps clinics collect structured patient intake, reduce repetitive discovery conversations, and streamline practitioner documentation workflows.",
    emotional:
      "Calmer prep for practitioners. Less friction for staff.",
    functional:
      "Structured patient communication, practitioner-review-first drafting, and clearer operational visibility before the visit starts.",
  },
} as const;
