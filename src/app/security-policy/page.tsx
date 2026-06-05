import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Security & Data Protection Policy",
  description: `Security practices for ${LEGAL.productName}.`,
  path: "/security-policy",
});

export default function SecurityPolicyPage() {
  return (
    <LegalPageShell
      title="Security & Data Protection Policy"
      description={`This policy describes security and data protection measures for ${LEGAL.productName}.`}
    >
      <h2>1. Overview</h2>
      <p>
        {LEGAL.legalName} implements administrative, technical, and organizational measures
        designed to protect information processed through {LEGAL.productName}. No system is
        completely secure; we cannot guarantee absolute security.
      </p>

      <h2>2. Infrastructure</h2>
      <ul>
        <li>HTTPS/TLS encryption for data in transit.</li>
        <li>Cloud-hosted database and authentication via Supabase.</li>
        <li>Application hosting via Vercel.</li>
        <li>Rate limiting via Upstash Redis in production.</li>
        <li>Error monitoring via Sentry (purpose-limited; no patient content in logs).</li>
      </ul>

      <h2>3. Authentication and access control</h2>
      <ul>
        <li>Email and password authentication with email verification in production.</li>
        <li>Multi-tenant isolation via row-level security and application permissions.</li>
        <li>Role-based access within clinic workspaces.</li>
        <li>
          <strong>CliniqFlow Support:</strong> no access to patient or clinical records.
        </li>
        <li>
          <strong>Platform administrators:</strong> access for maintenance, security,
          compliance, and operations; access is logged in audit logs.
        </li>
      </ul>

      <h2>4. AI data minimization</h2>
      <p>
        Production AI uses restricted mode by default, sending minimized clinical context (age,
        sex, symptoms, questionnaire responses, intake theme highlights) without direct patient
        identifiers. Requests to OpenRouter include a zero-retention data policy header; provider
        compliance is not guaranteed. See <Link href="/ai-disclaimer">AI Disclaimer</Link>.
      </p>

      <h2>5. Audit logging</h2>
      <p>We log security-relevant events including PHI access by platform administrators, tenant lifecycle events, billing events, and SOAP review actions. Clinic administrators may export tenant audit logs from compliance settings.</p>

      <h2>6. Retention and deletion</h2>
      <ul>
        <li>Audit logs: approximately six years.</li>
        <li>Usage metrics: ninety (90) days.</li>
        <li>Intake drafts: seven (7) days.</li>
        <li>Clinical records: until Customer requests deletion, subject to backups.</li>
      </ul>
      <p>
        Deletion requests: <Link href="/privacy-request">Privacy Requests</Link>.
      </p>

      <h2>7. Incident response</h2>
      <p>
        We maintain procedures to detect, contain, investigate, and remediate security incidents.
        We will notify affected clinic customers without undue delay of confirmed breaches
        involving personal data we process on their behalf.
      </p>

      <h2>8. Customer responsibilities</h2>
      <ul>
        <li>Protect account credentials and revoke access for departed staff.</li>
        <li>Use secure devices and networks.</li>
        <li>Configure roles appropriately within your workspace.</li>
        <li>Obtain required patient consents before submitting health information.</li>
      </ul>

      <h2>9. Vulnerability reporting</h2>
      <p>
        Report security issues to{" "}
        <a href={`mailto:${LEGAL.securityEmail}`}>{LEGAL.securityEmail}</a>. Do not publicly
        disclose vulnerabilities before we have had reasonable time to remediate.
      </p>
    </LegalPageShell>
  );
}
