import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: `Acceptable use rules for ${LEGAL.productName}.`,
};

export default function AcceptableUsePage() {
  return (
    <LegalPageShell
      title="Acceptable Use Policy"
      description={`This Acceptable Use Policy (&quot;AUP&quot;) governs use of ${LEGAL.productName} by all users.`}
    >
      <h2>1. Scope</h2>
      <p>
        This AUP supplements the <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/terms-of-use">Terms of Use</Link>. Violations may result in suspension or
        termination.
      </p>

      <h2>2. Permitted use</h2>
      <ul>
        <li>Lawful clinical and business intake and documentation workflows.</li>
        <li>Collection of patient information with required consents and notices.</li>
        <li>Practitioner review and approval of all draft outputs.</li>
      </ul>

      <h2>3. Prohibited use</h2>
      <p>You may not:</p>
      <ul>
        <li>Access accounts, tenants, or data without authorization.</li>
        <li>Probe, scan, or test vulnerabilities without written consent.</li>
        <li>Upload malware, spam, or unlawful content.</li>
        <li>Provide unauthorized medical advice or impersonate a clinician.</li>
        <li>Use the platform for emergencies, triage replacement, or autonomous diagnosis.</li>
        <li>Submit PHI without lawful basis and clinic authorization.</li>
        <li>Circumvent billing controls, rate limits, or tenant isolation.</li>
        <li>Scrape or harvest data through automated means without permission.</li>
        <li>Reverse engineer except where legally permitted.</li>
        <li>Interfere with other tenants or platform security.</li>
      </ul>

      <h2>4. AI-specific restrictions</h2>
      <ul>
        <li>Do not present AI draft outputs to patients as final medical guidance.</li>
        <li>Do not use outputs for billing or clinical decisions without practitioner review.</li>
        <li>Do not attempt to extract training data or bypass AI safety configurations.</li>
      </ul>

      <h2>5. Enforcement</h2>
      <p>
        We may investigate suspected violations, remove content, restrict features, or terminate
        access. Report abuse to{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
      </p>
    </LegalPageShell>
  );
}
