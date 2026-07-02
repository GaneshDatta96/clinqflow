import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { NICHE_PAGES } from "@/lib/seo/niche-pages";

export const metadata: Metadata = buildPageMetadata({
  title: "Clinic Documentation Workflow Software",
  description:
    "See how CliniqFlow connects patient intake, encounter review, and draft documentation into one clinic documentation workflow for outpatient teams.",
  path: "/clinic-workflows",
  ogTitle: "Clinic intake and documentation workflows",
  ogSubtitle:
    "Structured intake, operational visibility, draft documentation, and practitioner approval in one layer.",
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
          title: "What clinic workflow software should actually do",
          content: (
            <>
              <p>
                Clinic workflow software should reduce operational friction—not replace clinical
                judgment. CliniqFlow focuses on the pre-visit and documentation-preparation steps:
                collecting structured intake, giving the team a shared status view, and preparing
                draft documentation for practitioner review.
              </p>
              <p>
                This is a workflow layer for outpatient teams. It is not an EHR, telehealth platform,
                insurance system, or appointment scheduler.
              </p>
            </>
          ),
        },
        {
          title: "Team roles in one shared workflow",
          content: (
            <>
              <p>
                <strong>Front desk and staff</strong> create patients, send signed intake links,
                and track who has completed pre-visit questionnaires. They see completion status
                without chasing patients by phone.
              </p>
              <p>
                <strong>Coordinators and admins</strong> manage clinic settings, team access, and
                billing. They keep the workspace organized as the practice grows.
              </p>
              <p>
                <strong>Practitioners</strong> review encounter context, assess structured intake,
                and approve documentation drafts. Final clinical decisions always stay with licensed
                professionals.
              </p>
            </>
          ),
        },
        {
          title: "Status queue: who is ready for the visit",
          content: (
            <>
              <p>
                Instead of scattered spreadsheets and inbox threads, the dashboard shows encounter
                status in one place: intake submitted, ready for review, documentation draft
                prepared, and practitioner approved.
              </p>
              <p>
                The goal is calmer handoffs. Everyone knows what stage each patient is in before the
                appointment begins.
              </p>
            </>
          ),
        },
        {
          title: "From intake link to practitioner dashboard",
          content: (
            <>
              <p>
                Patients complete structured intake through a secure link. Staff track completion
                and readiness. Practitioners review encounter context and draft documentation before
                approval.
              </p>
              <p>
                Learn the intake step in detail on{" "}
                <Link
                  href="/how-patient-intake-works"
                  className="font-semibold text-[color:var(--accent)]"
                >
                  how patient intake works
                </Link>
                , or see how AI-assisted drafting fits the review-first model on{" "}
                <Link href="/ai-documentation" className="font-semibold text-[color:var(--accent)]">
                  AI documentation
                </Link>
                .
              </p>
            </>
          ),
        },
        {
          title: "Workflow layer vs. full charting",
          content: (
            <>
              <p>
                Many clinics already have a charting or practice-management system. CliniqFlow does
                not try to replace it. It organizes intake collection and documentation preparation
                so practitioners begin each visit with clearer context and less repetitive discovery.
              </p>
              <p>
                Think of it as the operational layer between patient contact and practitioner
                review—not the system of record for the full medical chart.
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
                review-first documentation.
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
                    {" — "}
                    intake and documentation workflows for {page.label.toLowerCase()}.
                  </li>
                ))}
              </ul>
            </>
          ),
        },
        {
          title: "Healthcare workflow automation without overpromising",
          content: (
            <>
              <p>
                CliniqFlow automates repetitive intake collection and documentation preparation—not
                clinical decision-making. The workflow is designed to reduce operational friction
                while keeping licensed practitioners in control of every output.
              </p>
              <p>
                For safeguards and data handling, see the{" "}
                <Link href="/security" className="font-semibold text-[color:var(--accent)]">
                  security overview
                </Link>{" "}
                and{" "}
                <Link href="/security-policy" className="font-semibold text-[color:var(--accent)]">
                  Security Policy
                </Link>
                .
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
