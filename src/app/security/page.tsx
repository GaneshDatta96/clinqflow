import type { Metadata } from "next";
import Link from "next/link";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clinic Data Security for Intake Workflows",
  description:
    "How CliniqFlow safeguards clinic intake and documentation data with tenant isolation, role-based access, and documented security practices.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <MarketingPageShell
      label="Security"
      title="How CliniqFlow safeguards clinic intake data"
      description="A plain-language overview of safeguards for clinic intake and documentation workflows. For contractual and legal detail, see the full Security & Data Protection Policy."
      breadcrumbLabel="Security"
      breadcrumbPath="/security"
      relatedLinks={[
        { href: "/security-policy", label: "Security & Data Protection Policy" },
        { href: "/subprocessors", label: "Subprocessors" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/dpa", label: "Data Processing Addendum" },
      ]}
      sections={[
        {
          title: "Transport and access controls",
          content: (
            <>
              <p>
                CliniqFlow uses HTTPS/TLS for data in transit and role-based access within each
                clinic organization. Tenant data is isolated so teams only access their own workspace
                context.
              </p>
            </>
          ),
        },
        {
          title: "Support access and audit visibility",
          content: (
            <>
              <p>
                CliniqFlow customer support does not access patient clinical records. Platform admin
                access for operational needs is logged and restricted to authorized staff functions.
              </p>
            </>
          ),
        },
        {
          title: "AI data handling",
          content: (
            <>
              <p>
                AI calls use minimized clinical context in restricted mode. Identifiers are redacted
                where configured, and CliniqFlow requests zero-retention handling from AI providers
                where supported.
              </p>
              <p>
                See the{" "}
                <Link href="/ai-disclaimer" className="font-semibold text-[color:var(--accent)]">
                  AI disclaimer
                </Link>{" "}
                and{" "}
                <Link href="/subprocessors" className="font-semibold text-[color:var(--accent)]">
                  subprocessor list
                </Link>{" "}
                for more detail.
              </p>
            </>
          ),
        },
        {
          title: "Full legal security documentation",
          content: (
            <>
              <p>
                This page is a marketing summary only. The authoritative policy is the{" "}
                <Link
                  href="/security-policy"
                  className="font-semibold text-[color:var(--accent)]"
                >
                  Security & Data Protection Policy
                </Link>
                . No system is completely secure; clinics maintain their own compliance programs.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
