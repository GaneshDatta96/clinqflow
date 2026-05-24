import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${LEGAL.productName} collects, uses, and protects information for clinic teams and patients.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      description={`This Privacy Policy describes how ${LEGAL.companyName} ("we," "us," or "our") handles personal information when you use ${LEGAL.productName}, our multi-tenant platform for outpatient wellness clinics.`}
    >
      <h2>1. Who this policy applies to</h2>
      <p>
        This policy applies to clinic staff and administrators who create accounts on{" "}
        {LEGAL.productName}, and to individuals who complete intake questionnaires through
        links provided by a clinic. If you interact with {LEGAL.productName} only as a
        patient of a clinic, your clinic is generally responsible for how your health
        information is used; we process that information on the clinic&apos;s behalf as a
        service provider.
      </p>

      <h2>2. Information we collect</h2>
      <p>Depending on how you use the service, we may collect:</p>
      <ul>
        <li>
          <strong>Account information:</strong> name, email address, clinic or organization
          name, role, and authentication credentials managed through our identity provider.
        </li>
        <li>
          <strong>Clinical workflow data:</strong> patient demographics, intake responses,
          assessment outputs, encounter notes, SOAP drafts, appointment requests, and related
          metadata submitted by authorized clinic users or patients via secure intake links.
        </li>
        <li>
          <strong>Billing information:</strong> subscription plan, billing status, and
          payment details processed by our payment processor. We do not store full payment
          card numbers on our servers.
        </li>
        <li>
          <strong>Usage and technical data:</strong> log data, device and browser type, IP
          address, pages viewed, feature usage, and error diagnostics needed to operate and
          secure the platform.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <p>We use information to:</p>
      <ul>
        <li>Provide, maintain, and improve the {LEGAL.productName} platform.</li>
        <li>Authenticate users, enforce access controls, and protect tenant isolation.</li>
        <li>Generate structured clinical drafts and workflow outputs requested by clinics.</li>
        <li>Process subscriptions, trials, invoices, and account communications.</li>
        <li>Monitor performance, prevent abuse, and comply with legal obligations.</li>
      </ul>
      <p>
        We do not sell personal information. We do not use patient intake content for
        unrelated advertising purposes.
      </p>

      <h2>4. AI-assisted features</h2>
      <p>
        {LEGAL.productName} may send selected clinical context to third-party AI providers to
        produce structured draft documentation. Outputs are intended to assist licensed
        clinicians and must be reviewed before clinical use. We configure integrations to
        request structured responses and limit data sent to what is necessary for the
        requested task.
      </p>

      <h2>5. How we share information</h2>
      <p>We may share information with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> that help us host infrastructure, authenticate
          users, process payments, deliver email, and operate AI features (for example,
          database hosting, payment processing, and model inference providers).
        </li>
        <li>
          <strong>Your clinic organization</strong>, according to role-based permissions
          configured within your tenant workspace.
        </li>
        <li>
          <strong>Legal and safety recipients</strong> when required by law, court order, or
          to protect rights, safety, and security.
        </li>
      </ul>
      <p>
        We require service providers to handle information under contractual obligations
        appropriate to their role and the sensitivity of the data processed.
      </p>

      <h2>6. Health information and compliance</h2>
      <p>
        Clinics using {LEGAL.productName} may submit information that is protected health
        information under applicable laws, including HIPAA where relevant. Clinics are
        responsible for determining lawful bases for collection and for obtaining any
        required patient consents. Where required, a separate business associate agreement
        may govern our processing of protected health information on a clinic&apos;s behalf.
      </p>
      <p>
        {LEGAL.productName} is a software platform, not a medical provider. We do not provide
        medical advice, diagnosis, or treatment.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We retain information for as long as needed to provide the service, meet contractual
        obligations, resolve disputes, and comply with law. Clinics may request export or
        deletion of tenant data subject to applicable retention requirements and backup
        cycles.
      </p>

      <h2>8. Security</h2>
      <p>
        We use administrative, technical, and organizational measures designed to protect
        information, including encrypted transport, authenticated access, tenant-scoped data
        controls, and monitoring. No method of transmission or storage is completely secure,
        and we cannot guarantee absolute security.
      </p>

      <h2>9. Your choices and rights</h2>
      <p>
        Clinic account holders may access, update, or delete certain account information
        through workspace settings. Patients should contact their clinic directly regarding
        intake data. Depending on your location, you may have rights to access, correct,
        delete, or restrict processing of personal information. Contact us at{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> to submit a
        request.
      </p>

      <h2>10. International transfers</h2>
      <p>
        If you access the service from outside the country where our infrastructure or
        providers operate, your information may be transferred internationally. We take steps
        designed to ensure appropriate safeguards where required.
      </p>

      <h2>11. Children</h2>
      <p>
        {LEGAL.productName} is intended for use by clinics and authorized staff. It is not
        directed to children under 13, and we do not knowingly collect personal information
        from children except where submitted by a clinic as part of lawful clinical intake.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the revised version
        on this page and update the &quot;Last updated&quot; date. Material changes may also
        be communicated through the product or by email where appropriate.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Questions about this Privacy Policy can be sent to{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> or through{" "}
        <a href={LEGAL.website}>{LEGAL.website}</a>. For subscription or account support,
        contact <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
      </p>
      <p>
        See also our <Link href="/terms">Terms of Service</Link>,{" "}
        <Link href="/terms-of-use">Terms of Use</Link>, and{" "}
        <Link href="/cancellation">Cancellation Policy</Link>.
      </p>
    </LegalPageShell>
  );
}
