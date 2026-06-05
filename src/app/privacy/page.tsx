import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { AI_DISCLAIMER_SHORT, SERVICE_DESCRIPTION } from "@/lib/legal/clauses";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${LEGAL.productName} collects, uses, and protects information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description={`This Privacy Policy describes how ${LEGAL.legalName}, ${LEGAL.entityDescription}, handles personal information when you use ${LEGAL.productName}.`}
    >
      <h2>1. Who this policy applies to</h2>
      <p>
        This policy applies to clinic staff and administrators who create accounts, individuals
        who complete intake questionnaires through clinic links, and visitors to our website.
        For patient health information submitted by a clinic, the clinic is generally the
        controller and CliniqFlow acts as a processor/service provider on the clinic&apos;s
        behalf.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> name, email, organization name, role, and
          authentication credentials.
        </li>
        <li>
          <strong>Clinical workflow data:</strong> patient demographics, contact information,
          intake questionnaire responses, symptoms, structured intake highlights, documentation
          drafts, consent records, and related metadata submitted by clinics or patients via
          secure intake links.
        </li>
        <li>
          <strong>Billing information:</strong> subscription plan and payment metadata processed
          by Razorpay. We do not store full payment card numbers.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type, device information, log
          data, and error diagnostics needed to operate and secure the platform.
        </li>
        <li>
          <strong>Consent records:</strong> consent version, timestamp, truncated or hashed IP
          where stored, and user agent string for audit purposes.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Provide, maintain, and improve {LEGAL.productName}.</li>
        <li>Authenticate users, enforce access controls, and protect tenant isolation.</li>
        <li>
          Generate draft documentation and structured intake highlights through rule-based logic
          and AI-assisted documentation and clinical decision-support.
        </li>
        <li>Process subscriptions and account communications.</li>
        <li>Monitor performance, prevent abuse, and comply with legal obligations.</li>
      </ul>
      <p>
        We do not sell personal information. We do not use patient intake content for
        advertising.
      </p>

      <h2>4. AI processing</h2>
      <p>{AI_DISCLAIMER_SHORT}</p>
      <p>
        In restricted mode, we send minimized clinical context to AI providers: age, sex,
        symptoms, intake questionnaire responses, and rule-based intake theme highlights. We
        do not send patient name, email, phone, or physical address to AI providers in this
        mode.
      </p>
      <p>
        We configure our OpenRouter integration to send{" "}
        <code>X-OpenRouter-Data-Policy: deny</code> to request that the provider not retain
        request data for training. Third-party provider policies govern actual retention. We do
        not guarantee provider compliance.
      </p>

      <h2>5. Access roles</h2>
      <ul>
        <li>
          <strong>Practitioners and clinic staff</strong> access records within their clinic
          according to role permissions.
        </li>
        <li>
          <strong>CliniqFlow Support</strong> does not access patient records.
        </li>
        <li>
          <strong>Platform administrators</strong> may access tenant systems for maintenance,
          security, compliance, and operations. Access is logged and auditable.
        </li>
      </ul>

      <h2>6. Sharing and subprocessors</h2>
      <p>
        We share information with service providers listed in our{" "}
        <Link href="/subprocessors">Subprocessor Disclosure</Link>, with your clinic
        organization per permissions, and with legal recipients when required by law.
      </p>

      <h2>7. Health information</h2>
      <p>
        Clinics may submit protected health information. Clinics are responsible for lawful
        bases and patient consents. CliniqFlow is a software platform, not a medical provider.
        We do not provide medical advice, diagnosis, or treatment. See{" "}
        <Link href="/medical-disclaimer">Medical Disclaimer</Link>.
      </p>

      <h2>8. Retention</h2>
      <ul>
        <li>
          Clinical records: retained while your subscription is active and until deletion is
          requested, subject to backup cycles.
        </li>
        <li>Audit logs: approximately six years (configurable).</li>
        <li>Usage metrics: ninety (90) days.</li>
        <li>Intake drafts: seven (7) days if not submitted.</li>
      </ul>

      <h2>9. Security</h2>
      <p>
        We use administrative, technical, and organizational measures described in our{" "}
        <Link href="/security-policy">Security Policy</Link>. No method of transmission or
        storage is completely secure.
      </p>

      <h2>10. Your rights and requests</h2>
      <p>
        Clinic account holders may update account information in workspace settings. Patients
        should contact their clinic regarding intake data. Depending on your location, you may
        have rights to access, correct, delete, or restrict processing. Submit requests via{" "}
        <Link href="/privacy-request">Privacy Requests</Link> or{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. We aim to respond
        within {LEGAL.dataDeletionSlaDays} days where applicable.
      </p>

      <h2>11. International transfers</h2>
      <p>
        Information may be processed in India, the United States, and other countries where
        our subprocessors operate. Where required, we use appropriate safeguards such as
        Standard Contractual Clauses under our <Link href="/dpa">DPA</Link>.
      </p>

      <h2>12. Children</h2>
      <p>
        The service is not directed to children under 13. We do not knowingly collect personal
        information from children except where submitted by a clinic as part of lawful intake.
      </p>

      <h2>13. Changes and contact</h2>
      <p>
        We may update this policy by posting a revised version. Questions:{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
      </p>
    </LegalPageShell>
  );
}
