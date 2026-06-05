import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Patient Intake Software for Clinics",
  description:
    "Learn how CliniqFlow structures digital patient intake, specialty questionnaires, and pre-visit workflows for outpatient clinics.",
  path: "/how-patient-intake-works",
});

export default function HowPatientIntakeWorksPage() {
  return (
    <MarketingPageShell
      label="Patient intake"
      title="How structured patient intake works in CliniqFlow"
      description="CliniqFlow helps clinics collect organized patient intake before the visit through secure links, specialty questionnaires, and a review-first workflow—not an EHR replacement."
      breadcrumbLabel="How patient intake works"
      breadcrumbPath="/how-patient-intake-works"
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
                workflow instead of forcing a generic questionnaire.
              </p>
            </>
          ),
        },
        {
          title: "Healthcare intake workflow for the whole team",
          content: (
            <>
              <p>
                Staff can see completion status, review structured responses, and prepare for the
                visit from one operational layer. The goal is less scattered follow-up across
                inboxes, notes, and memory.
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
          title: "Patient intake management without diagnostic claims",
          content: (
            <>
              <p>
                CliniqFlow organizes intake themes for practitioner review. It does not diagnose
                patients, prescribe treatment, or replace licensed clinical judgment.
              </p>
              <p>
                All outputs remain drafts until a licensed practitioner reviews and approves them.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
