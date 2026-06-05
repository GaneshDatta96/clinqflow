import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import {
  ARBITRATION_CLAUSE,
  EXCLUDED_DAMAGES,
  GOVERNING_LAW,
  LIABILITY_CAP_INTRO,
  SERVICE_DESCRIPTION,
} from "@/lib/legal/clauses";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Subscription and service terms for clinic accounts using ${LEGAL.productName}.`,
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description={`These Terms of Service ("Terms") govern clinic and organization subscriptions to ${LEGAL.productName}, provided by ${LEGAL.legalName}, ${LEGAL.entityDescription}.`}
    >
      <h2>1. Agreement</h2>
      <p>
        These Terms form a binding agreement between {LEGAL.legalName} (
        &quot;CliniqFlow,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and the
        clinic, practice, or organization that registers for {LEGAL.productName} (
        &quot;Customer,&quot; &quot;you,&quot; or &quot;your&quot;). If you accept on behalf of
        an organization, you represent that you have authority to bind that organization.
      </p>

      <h2>2. The service</h2>
      <p>{SERVICE_DESCRIPTION}</p>
      <p>
        Features may vary by plan and may change over time. Beta or preview features are
        offered as-is and may be modified or discontinued.
      </p>

      <h2>3. Accounts and authorized users</h2>
      <p>
        You are responsible for all activity under your tenant account, including actions by
        invited team members. You must maintain accurate account information, protect login
        credentials, and promptly notify us of unauthorized access at{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
      </p>
      <p>
        Only authorized personnel may access patient or clinical data within your organization.
        CliniqFlow Support staff do not access patient records. Platform administrators may
        access tenant systems for maintenance, security, compliance, and support operations,
        and such access is logged and auditable.
      </p>

      <h2>4. Subscriptions</h2>
      <p>
        After you sign up, paid subscriptions renew according to the billing interval selected
        at checkout unless canceled as described in our{" "}
        <Link href="/cancellation">Cancellation Policy</Link>. Fees are billed in advance and
        are non-refundable except where required by law.
      </p>

      <h2>5. Customer responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Use the service only for lawful clinical and business operations.</li>
        <li>
          Obtain all required consents, notices, and authorizations for patient data you
          submit.
        </li>
        <li>
          Review all AI-generated or automated draft outputs before relying on them clinically
          or operationally.
        </li>
        <li>
          Maintain your own compliance program, including HIPAA and applicable privacy laws,
          as relevant to your practice.
        </li>
        <li>Not use the service for emergencies, autonomous diagnosis, or triage replacement.</li>
        <li>Comply with our <Link href="/acceptable-use">Acceptable Use Policy</Link>.</li>
      </ul>

      <h2>6. Patient and clinical data</h2>
      <p>
        As between the parties, you retain ownership of data you submit. You grant CliniqFlow
        a limited license to host, process, transmit, and display that data solely to provide
        and improve the service, prevent abuse, and comply with law.
      </p>
      <p>
        Where protected health information is involved, the parties may enter a separate
        business associate agreement or{" "}
        <Link href="/dpa">Data Processing Addendum</Link> if required. You are responsible
        for determining applicability.
      </p>

      <h2>7. AI-assisted documentation and clinical decision-support</h2>
      <p>
        {LEGAL.productName} may generate draft documentation and structured suggestions based
        on intake data. These outputs are assistive tools only. See our{" "}
        <Link href="/ai-disclaimer">AI Disclaimer</Link> and{" "}
        <Link href="/medical-disclaimer">Medical Disclaimer</Link>. You remain solely
        responsible for clinical judgment, documentation accuracy, and patient care.
      </p>

      <h2>8. Incorporated policies</h2>
      <p>
        These Terms incorporate by reference:{" "}
        <Link href="/privacy">Privacy Policy</Link>,{" "}
        <Link href="/terms-of-use">Terms of Use</Link>,{" "}
        <Link href="/acceptable-use">Acceptable Use Policy</Link>,{" "}
        <Link href="/security-policy">Security Policy</Link>,{" "}
        <Link href="/subprocessors">Subprocessor Disclosure</Link>, and{" "}
        <Link href="/legal-liability">Limitation of Liability and Indemnification</Link>.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        CliniqFlow and its licensors own the service, software, branding, and underlying
        technology. These Terms do not grant you ownership of our intellectual property.
        Feedback may be used to improve the service without obligation to you.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        We may suspend or terminate access if you breach these Terms, fail to pay fees, or if
        continued provision poses security, legal, or operational risk. Upon termination, your
        right to access the service ends. You may request export of tenant data within thirty
        (30) days via <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>,
        subject to backup cycles and legal retention requirements.
      </p>

      <h2>11. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM
        EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT
        WARRANT ERROR-FREE OPERATION OR THAT OUTPUTS WILL BE CLINICALLY COMPLETE OR ACCURATE.
      </p>

      <h2>12. Limitation of liability</h2>
      <p>{LIABILITY_CAP_INTRO}</p>
      <p>{EXCLUDED_DAMAGES}</p>
      <p>
        See <Link href="/legal-liability">Limitation of Liability and Indemnification</Link>{" "}
        for additional terms.
      </p>

      <h2>13. Indemnification</h2>
      <p>
        You will defend and indemnify CliniqFlow against third-party claims arising from your
        data, clinical or business use of the service, violation of law, or breach of these
        Terms, except to the extent caused by our gross negligence or willful misconduct.
      </p>

      <h2>14. Force majeure</h2>
      <p>
        Neither party is liable for delay or failure to perform due to events beyond reasonable
        control, including acts of God, war, terrorism, pandemic, government action, labor
        disputes, critical infrastructure failure, or third-party AI or cloud provider outage.
        Affected obligations are suspended for the duration; either party may terminate if the
        event continues beyond ninety (90) days.
      </p>

      <h2>15. Dispute resolution and governing law</h2>
      <p>{GOVERNING_LAW}</p>
      <p>{ARBITRATION_CLAUSE}</p>
      <p>
        To the extent enforceable, you agree to bring claims only in your individual capacity
        and not as a plaintiff or class member in any class or representative proceeding.
      </p>

      <h2>16. Changes</h2>
      <p>
        We may modify these Terms by posting an updated version and changing the &quot;Last
        updated&quot; date. Material changes to paid subscriptions take effect on renewal or
        after reasonable notice where required.
      </p>

      <h2>17. Contact</h2>
      <p>
        Billing and account:{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>. Legal notices:
        same address with subject line &quot;Legal Notice.&quot;
      </p>
    </LegalPageShell>
  );
}
