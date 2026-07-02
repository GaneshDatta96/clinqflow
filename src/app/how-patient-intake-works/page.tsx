import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { howToSchema } from "@/lib/seo/schema";
import { NICHE_PAGES } from "@/lib/seo/niche-pages";

const INTAKE_HOW_TO = howToSchema({
  name: "How structured patient intake works in CliniqFlow",
  description:
    "A step-by-step clinic intake workflow from patient link to practitioner review.",
  steps: [
    {
      name: "Create the patient record",
      text: "Staff add a patient in the clinic workspace and choose the specialty configuration that matches the visit.",
    },
    {
      name: "Send a signed intake link",
      text: "CliniqFlow generates a secure intake URL. The patient completes structured questionnaires before the appointment.",
    },
    {
      name: "Track completion status",
      text: "The team sees who has submitted intake, what is ready for review, and what still needs follow-up from one dashboard.",
    },
    {
      name: "Review structured responses",
      text: "Practitioners open the encounter with organized intake context instead of piecing together scattered notes.",
    },
    {
      name: "Prepare documentation drafts",
      text: "CliniqFlow prepares draft documentation from structured intake. Licensed practitioners review and approve before use.",
    },
  ],
});

export const metadata: Metadata = buildPageMetadata({
  title: "Patient Intake Software for Clinics",
  description:
    "Learn how CliniqFlow structures digital patient intake, specialty questionnaires, and pre-visit workflows for outpatient clinics.",
  path: "/how-patient-intake-works",
  ogTitle: "Structured patient intake for clinics",
  ogSubtitle:
    "Secure intake links, specialty questionnaires, and review-first workflows before the visit.",
});

export default function HowPatientIntakeWorksPage() {
  return (
    <MarketingPageShell
      label="Patient intake"
      title="How structured patient intake works in CliniqFlow"
      description="CliniqFlow helps clinics collect organized patient intake before the visit through secure links, specialty questionnaires, and a review-first workflow—not an EHR replacement."
      breadcrumbLabel="How patient intake works"
      breadcrumbPath="/how-patient-intake-works"
      extraJsonLd={INTAKE_HOW_TO}
      relatedLinks={[
        { href: "/ai-documentation", label: "AI-assisted documentation" },
        { href: "/clinic-workflows", label: "Clinic workflows" },
        { href: "/security", label: "Security" },
        { href: "/faq", label: "FAQ" },
      ]}
      sections={[
        {
          title: "Secure intake links before the appointment",
          content: (
            <>
              <p>
                Clinics send signed intake links so patients can complete structured forms at home.
                This moves repetitive discovery into a calmer pre-visit step and gives practitioners
                clearer context before the conversation begins.
              </p>
              <p>
                Intake flows are configured by specialty so questions match the clinic&apos;s
                workflow instead of forcing a generic questionnaire. Supported practice types
                include general practice, functional medicine, chiropractic, aesthetic clinics, and
                holistic practices.
              </p>
            </>
          ),
        },
        {
          title: "Step-by-step: from intake link to practitioner review",
          content: (
            <>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Create the patient record</strong> — staff add the patient and select the
                  specialty configuration for the visit.
                </li>
                <li>
                  <strong>Send the signed intake link</strong> — the patient completes structured
                  questionnaires on their own time before the appointment.
                </li>
                <li>
                  <strong>Track completion</strong> — the team sees submission status and what is
                  ready for review from one operational view.
                </li>
                <li>
                  <strong>Review organized context</strong> — practitioners open the encounter with
                  structured intake instead of scattered follow-up notes.
                </li>
                <li>
                  <strong>Prepare draft documentation</strong> — documentation drafts are prepared
                  for licensed practitioner review and approval.
                </li>
              </ol>
            </>
          ),
        },
        {
          title: "Intake workflow vs. EHR charting",
          content: (
            <>
              <p>
                CliniqFlow is a workflow layer for pre-visit intake and documentation preparation.
                It organizes the work <em>before and around</em> the visit—it is not an electronic
                health record, billing system, or full charting replacement.
              </p>
              <p>
                Many clinics use CliniqFlow alongside existing tools: intake and draft documentation
                happen in CliniqFlow; the authoritative medical record stays in the systems your
                practice already relies on.
              </p>
            </>
          ),
        },
        {
          title: "Healthcare intake workflow for the whole team",
          content: (
            <>
              <p>
                Front desk staff send links and track completion. Coordinators see who is ready.
                Practitioners review encounter context and approve documentation drafts. Everyone
                works from the same status view instead of chasing updates across inboxes and notes.
              </p>
              <p>
                Explore how intake connects to documentation in our{" "}
                <Link href="/clinic-workflows" className="font-semibold text-[color:var(--accent)]">
                  clinic workflow overview
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          title: "Specialty intake by practice type",
          content: (
            <>
              <p>
                Each practice type can use intake questionnaires aligned to how that clinic works.
                Browse workflow pages by specialty:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {NICHE_PAGES.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/for/${page.slug}`}
                      className="font-semibold text-[color:var(--accent)]"
                    >
                      {page.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          title: "Patient intake management without diagnostic claims",
          content: (
            <>
              <p>
                CliniqFlow organizes intake themes for practitioner review. It does not diagnose
                patients, prescribe treatment, or replace licensed clinical judgment.
              </p>
              <p>
                All outputs remain drafts until a licensed practitioner reviews and approves them.
                See the{" "}
                <Link href="/medical-disclaimer" className="font-semibold text-[color:var(--accent)]">
                  medical disclaimer
                </Link>{" "}
                and{" "}
                <Link href="/ai-disclaimer" className="font-semibold text-[color:var(--accent)]">
                  AI disclaimer
                </Link>{" "}
                for more detail.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
