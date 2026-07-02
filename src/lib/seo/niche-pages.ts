export type NicheSection = {
  title: string;
  paragraphs: string[];
};

export type NichePage = {
  /** URL slug under /for/ */
  slug: string;
  /** Key in niche_configs.json this page maps to. */
  nicheKey: string;
  /** Short label for nav, breadcrumbs, and internal links. */
  label: string;
  /** <title> for search engines. */
  metaTitle: string;
  /** Meta description + OG subtitle. */
  metaDescription: string;
  /** On-page H1. */
  h1: string;
  /** Intro paragraph under the H1. */
  intro: string;
  sections: NicheSection[];
  relatedLinks: { href: string; label: string }[];
};

const COMMON_RELATED = [
  { href: "/how-patient-intake-works", label: "How patient intake works" },
  { href: "/clinic-workflows", label: "Clinic workflows" },
  { href: "/ai-documentation", label: "AI documentation" },
];

export const NICHE_PAGES: NichePage[] = [
  {
    slug: "general-practice",
    nicheKey: "general_practice",
    label: "General practice",
    metaTitle: "Patient Intake & Documentation Workflow for General Practice",
    metaDescription:
      "CliniqFlow gives general practice clinics structured pre-visit intake and review-first documentation drafts so teams start each appointment with clearer context.",
    h1: "Intake and documentation workflows for general practice clinics",
    intro:
      "General practice teams juggle broad, varied presentations every day. CliniqFlow structures pre-visit intake and prepares documentation drafts for practitioner review, so front desk staff and clinicians spend less time on repetitive discovery and more on the visit itself.",
    sections: [
      {
        title: "Structured intake before the appointment",
        paragraphs: [
          "Patients complete a signed intake link before they arrive, capturing chief complaint, history, medications, and context in a consistent structure. The clinic decides which questions appear, so intake matches how your practice actually works.",
          "Because the information arrives organized rather than scattered across calls and paper forms, the team can see who is ready and what still needs follow-up at a glance.",
        ],
      },
      {
        title: "A calmer queue for the whole team",
        paragraphs: [
          "One dashboard shows intake status, what is ready for review, and where a practitioner needs to step in. Front desk, staff, and clinicians share the same view without chasing each other for updates.",
          "This is a workflow layer, not an EHR replacement. CliniqFlow organizes the pre-visit and documentation-preparation steps around your existing tools and processes.",
        ],
      },
      {
        title: "Draft documentation, practitioner approval",
        paragraphs: [
          "CliniqFlow prepares SOAP-style documentation drafts from structured intake so clinicians begin with a starting point instead of a blank page. Every draft is reviewed and approved by a licensed practitioner before it is used.",
          "AI-assisted drafting is decision-support for review-first teams. It never makes clinical decisions and never replaces professional judgment.",
        ],
      },
      {
        title: "Built around your clinic, not a specialty silo",
        paragraphs: [
          "General practice covers a wide range of visits, so CliniqFlow keeps intake configurable and documentation flexible. As your clinic grows, roles from front desk to practitioner stay coordinated in one workflow.",
          "For the full picture of how intake connects to documentation, see how patient intake works and the clinic workflows overview.",
        ],
      },
    ],
    relatedLinks: COMMON_RELATED,
  },
  {
    slug: "functional-medicine",
    nicheKey: "functional_medicine",
    label: "Functional medicine",
    metaTitle: "Structured Patient Intake for Functional Medicine Practices",
    metaDescription:
      "CliniqFlow helps functional medicine practices collect detailed pre-visit intake with specialty questionnaires and prepare review-first documentation drafts.",
    h1: "Structured intake for functional medicine practices",
    intro:
      "Functional medicine visits depend on deep context — history, lifestyle, symptoms, and goals. CliniqFlow collects that context through structured pre-visit intake and prepares documentation drafts for practitioner review, so the first conversation starts further ahead.",
    sections: [
      {
        title: "Detailed intake without the back-and-forth",
        paragraphs: [
          "Specialty questionnaires capture symptoms, duration, diet, sleep, stress, medications, and health goals before the appointment. Patients share context openly in a structured format instead of trying to recall everything in the room.",
          "The clinic controls which questions appear, so intake reflects your functional medicine approach rather than a generic template.",
        ],
      },
      {
        title: "Turn long histories into organized context",
        paragraphs: [
          "Functional medicine generates a lot of information per patient. CliniqFlow organizes intake into a clear structure the practitioner can review quickly, reducing the cognitive load of piecing together a story from fragments.",
          "One dashboard tracks who has completed intake and what is ready for review, keeping the whole team aligned.",
        ],
      },
      {
        title: "Documentation drafts for review-first care",
        paragraphs: [
          "From structured intake, CliniqFlow prepares documentation drafts so practitioners begin with a starting point. Drafts are always reviewed and approved by a licensed clinician before use.",
          "AI-assisted documentation is clinical decision-support, not a diagnosis or treatment recommendation. Final judgment stays with the practitioner.",
        ],
      },
      {
        title: "Designed for the intake-to-documentation flow",
        paragraphs: [
          "CliniqFlow is a workflow layer that connects pre-visit intake to documentation preparation. It is not an EHR, telehealth, or treatment-management platform.",
          "See how patient intake works and AI documentation for more on the review-first workflow.",
        ],
      },
    ],
    relatedLinks: COMMON_RELATED,
  },
  {
    slug: "chiropractic",
    nicheKey: "chiropractor",
    label: "Chiropractic",
    metaTitle: "Patient Intake Workflow Software for Chiropractic Clinics",
    metaDescription:
      "CliniqFlow gives chiropractic clinics structured pre-visit intake and review-first documentation drafts, organizing patient context before the appointment.",
    h1: "Patient intake workflow for chiropractic clinics",
    intro:
      "Chiropractic clinics move quickly, and consistent intake keeps things calm. CliniqFlow structures pre-visit intake and prepares documentation drafts for practitioner review, so the team starts each visit with organized patient context.",
    sections: [
      {
        title: "Consistent intake for every patient",
        paragraphs: [
          "Signed intake links collect chief complaint, history, and relevant context in a consistent structure before the patient arrives. Staff spend less time on repetitive paperwork and phone follow-ups.",
          "The clinic configures the questions, so intake fits how your chiropractic practice runs.",
        ],
      },
      {
        title: "One clear view of the day",
        paragraphs: [
          "A shared dashboard shows who has completed intake, what is ready for review, and where the practitioner needs to step in. The whole team works from the same status view.",
          "CliniqFlow is a workflow layer that complements your existing tools — not an EHR or treatment-management system.",
        ],
      },
      {
        title: "Draft documentation, clinician approval",
        paragraphs: [
          "CliniqFlow prepares documentation drafts from structured intake so practitioners begin with a starting point rather than a blank page. Every draft is reviewed and approved by a licensed practitioner.",
          "AI-assisted drafting supports documentation; it does not make clinical or treatment decisions.",
        ],
      },
      {
        title: "Less friction, more focus on care",
        paragraphs: [
          "By moving repetitive discovery into a calm pre-visit step, CliniqFlow helps chiropractic teams reduce operational chaos and keep attention on the patient.",
          "Explore how patient intake works and clinic workflows to see the full flow.",
        ],
      },
    ],
    relatedLinks: COMMON_RELATED,
  },
  {
    slug: "aesthetic-clinics",
    nicheKey: "aesthetic_clinic",
    label: "Aesthetic clinics",
    metaTitle: "Intake & Documentation Workflow for Aesthetic Clinics",
    metaDescription:
      "CliniqFlow helps aesthetic clinics and med spas collect structured pre-visit intake and prepare review-first documentation drafts for practitioner approval.",
    h1: "Intake workflow for aesthetic clinics and med spas",
    intro:
      "Aesthetic clinics balance a polished patient experience with careful documentation. CliniqFlow structures pre-visit intake and prepares documentation drafts for practitioner review, so consultations begin with clear, organized context.",
    sections: [
      {
        title: "A smooth pre-visit experience",
        paragraphs: [
          "Patients complete a structured intake link before their appointment, sharing goals, history, and context in a consistent format. The experience feels organized and professional from the first touchpoint.",
          "Your clinic decides which questions appear, so intake matches your services and consultation style.",
        ],
      },
      {
        title: "Coordinated team, shared status",
        paragraphs: [
          "One dashboard shows intake completion, what is ready for review, and where the practitioner needs to step in. Front desk and clinical staff stay aligned without manual chasing.",
          "CliniqFlow is a workflow layer around your existing tools — not an EHR, and not a marketing or booking platform.",
        ],
      },
      {
        title: "Documentation drafts for practitioner review",
        paragraphs: [
          "CliniqFlow prepares documentation drafts from structured intake so practitioners start with a foundation. Drafts are always reviewed and approved by a licensed practitioner before use.",
          "AI-assisted documentation is decision-support for review-first teams and does not make clinical decisions or promise outcomes.",
        ],
      },
      {
        title: "Organized context, calmer consultations",
        paragraphs: [
          "By structuring intake ahead of time, CliniqFlow reduces repetitive discovery and helps the team focus on the consultation itself.",
          "See how patient intake works and AI documentation for the full review-first workflow.",
        ],
      },
    ],
    relatedLinks: COMMON_RELATED,
  },
  {
    slug: "holistic-practices",
    nicheKey: "holistic",
    label: "Holistic practices",
    metaTitle: "Documentation Workflow for Holistic & Wellness Practices",
    metaDescription:
      "CliniqFlow helps holistic and wellness practices collect structured pre-visit intake and prepare review-first documentation drafts for practitioner approval.",
    h1: "Documentation workflow for holistic practices",
    intro:
      "Holistic practices value context and continuity. CliniqFlow structures pre-visit intake and prepares documentation drafts for practitioner review, so practitioners begin each session with organized patient context and less administrative friction.",
    sections: [
      {
        title: "Context-rich intake, structured cleanly",
        paragraphs: [
          "Structured intake links capture symptoms, history, lifestyle, and goals before the visit. Patients share context openly in a format that is easy for the practitioner to review.",
          "The clinic configures the questionnaire, so intake reflects your holistic approach rather than a rigid template.",
        ],
      },
      {
        title: "One workflow for the whole team",
        paragraphs: [
          "A shared dashboard shows who has completed intake and what is ready for review, keeping practitioners and support staff coordinated.",
          "CliniqFlow is a workflow layer that organizes the pre-visit and documentation steps — not an EHR or treatment-management platform.",
        ],
      },
      {
        title: "Draft documentation with practitioner approval",
        paragraphs: [
          "From structured intake, CliniqFlow prepares documentation drafts so practitioners start with a foundation. Every draft is reviewed and approved by a licensed practitioner before use.",
          "AI-assisted drafting is clinical decision-support and never replaces professional judgment.",
        ],
      },
      {
        title: "Less admin, more presence",
        paragraphs: [
          "By moving repetitive discovery into a calm pre-visit step, CliniqFlow helps holistic teams reduce operational overhead and stay present with each patient.",
          "Explore how patient intake works and clinic workflows for the full flow.",
        ],
      },
    ],
    relatedLinks: COMMON_RELATED,
  },
];

export function getNichePage(slug: string): NichePage | undefined {
  return NICHE_PAGES.find((page) => page.slug === slug);
}
