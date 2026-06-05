import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clinic Documentation Workflow Software",
  description:
    "See how CliniqFlow connects patient intake, encounter review, and draft documentation into one clinic documentation workflow for outpatient teams.",
  path: "/clinic-workflows",
});

export default function ClinicWorkflowsPage() {
  return (
    <MarketingPageShell
      label="Clinic workflows"
      title="Clinic intake and documentation workflows"
      description="CliniqFlow organizes the work before and around the visit: structured intake, operational visibility, draft documentation, and practitioner approval in one workflow layer."
      breadcrumbLabel="Clinic workflows"
      breadcrumbPath="/clinic-workflows"
      relatedLinks={[
        { href: "/how-patient-intake-works", label: "How patient intake works" },
        { href: "/ai-documentation", label: "AI documentation" },
        { href: "/security", label: "Security" },
        { href: "/faq", label: "FAQ" },
      ]}
      sections={[
        {
          title: "Healthcare workflow automation without overpromising",
          content: (
            <>
              <p>
                CliniqFlow automates repetitive intake collection and documentation preparation—not
                clinical decision-making. The workflow is designed to reduce operational friction
                while keeping licensed practitioners in control.
              </p>
            </>
          ),
        },
        {
          title: "From intake link to practitioner dashboard",
          content: (
            <>
              <p>
                Patients complete structured intake. Staff track completion and readiness. Practitioners
                review encounter context and draft documentation before approval.
              </p>
              <p>
                Learn the intake step in detail on{" "}
                <Link
                  href="/how-patient-intake-works"
                  className="font-semibold text-[color:var(--accent)]"
                >
                  how patient intake works
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          title: "Clinical workflow software for specialty clinics",
          content: (
            <>
              <p>
                Specialty configurations help clinics collect context that fits their practice.
                CliniqFlow supports outpatient teams that want calmer pre-visit preparation and
                review-first documentation—not a full charting replacement.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
