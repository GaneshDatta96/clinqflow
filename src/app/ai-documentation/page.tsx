import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { softwareApplicationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "AI-Assisted Clinical Documentation Software",
  description:
    "CliniqFlow provides AI-assisted documentation and clinical decision-support as draft outputs for licensed practitioner review—not autonomous clinical decisions.",
  path: "/ai-documentation",
});

export default function AiDocumentationPage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <MarketingPageShell
        label="AI documentation"
        title="AI-assisted documentation for practitioner review"
        description="CliniqFlow uses AI-assisted documentation and clinical decision-support to help prepare draft SOAP-style sections from structured intake context. Licensed practitioners review, edit, and approve every output."
        breadcrumbLabel="AI documentation"
        breadcrumbPath="/ai-documentation"
        relatedLinks={[
          { href: "/how-patient-intake-works", label: "How patient intake works" },
          { href: "/ai-disclaimer", label: "AI disclaimer" },
          { href: "/medical-disclaimer", label: "Medical disclaimer" },
          { href: "/faq", label: "FAQ" },
        ]}
        sections={[
          {
            title: "Draft documentation, not final clinical records",
            content: (
              <>
                <p>
                  AI outputs in CliniqFlow are draft documentation prepared for review. They do not
                  finalize notes, make diagnoses, or replace the judgment of licensed healthcare
                  professionals.
                </p>
                <p>
                  Practitioners remain responsible for interpretation, editing, and approval before
                  any clinical or operational use.
                </p>
              </>
            ),
          },
          {
            title: "AI clinical documentation software with minimized context",
            content: (
              <>
                <p>
                  In restricted mode, CliniqFlow sends minimized clinical context to AI providers and
                  requests zero-retention handling where supported. Provider terms and configuration
                  still apply.
                </p>
                <p>
                  Read the full{" "}
                  <Link href="/ai-disclaimer" className="font-semibold text-[color:var(--accent)]">
                    AI disclaimer
                  </Link>{" "}
                  for details on draft-only outputs and practitioner responsibility.
                </p>
              </>
            ),
          },
          {
            title: "Practitioner documentation software that stays review-first",
            content: (
              <>
                <p>
                  Encounter review surfaces draft sections alongside intake context so clinicians can
                  see evidence, data gaps, and documentation themes before approval.
                </p>
                <p>
                  CliniqFlow is an intake and documentation workflow layer designed to work alongside
                  your existing systems—not an EHR replacement.
                </p>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
