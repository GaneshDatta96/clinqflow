import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Subscription and service terms for clinic accounts using ${LEGAL.productName}.`,
};

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      description={`These Terms of Service ("Terms") govern clinic and organization subscriptions to ${LEGAL.productName}. By creating an account or paying for a plan, you agree to these Terms.`}
    >
      <h2>1. Agreement</h2>
      <p>
        These Terms form a binding agreement between {LEGAL.companyName} and the clinic,
        practice, or organization that registers for {LEGAL.productName} (&quot;Customer,&quot;
        &quot;you,&quot; or &quot;your&quot;). If you accept on behalf of an organization, you
        represent that you have authority to bind that organization.
      </p>

      <h2>2. The service</h2>
      <p>
        {LEGAL.productName} provides software for pre-visit intake, rule-based assessment,
        encounter workflow management, and AI-assisted drafting of structured clinical
        documentation subject to clinician review. Features may vary by plan and may change
        over time as we improve the product.
      </p>
      <p>
        We may provide beta or preview features that are offered as-is and may be modified
        or discontinued.
      </p>

      <h2>3. Accounts and authorized users</h2>
      <p>
        You are responsible for all activity under your tenant account, including actions by
        invited team members. You must maintain accurate account information, protect login
        credentials, and promptly notify us of unauthorized access.
      </p>
      <p>
        You will ensure that only authorized personnel access patient or clinical data within
        your organization and that such access complies with applicable professional,
        organizational, and legal requirements.
      </p>

      <h2>4. Trials and subscriptions</h2>
      <p>
        New accounts may receive a {LEGAL.trialDays}-day trial unless otherwise stated at
        signup. At the end of a trial, continued access to paid features requires selection
        of a paid plan unless we agree otherwise in writing.
      </p>
      <p>
        Paid subscriptions renew according to the billing interval selected at checkout unless
        canceled as described in our <Link href="/cancellation">Cancellation Policy</Link>.
        Fees are billed in advance and are non-refundable except where required by law or
        expressly stated in the Cancellation Policy.
      </p>

      <h2>5. Customer responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Use the service only for lawful clinical and business operations.</li>
        <li>
          Obtain all required consents, notices, and authorizations for patient data you
          submit to the platform.
        </li>
        <li>
          Review all AI-generated or automated outputs before relying on them clinically or
          operationally.
        </li>
        <li>
          Maintain your own compliance program, including HIPAA, state privacy laws, and
          professional standards, as applicable.
        </li>
        <li>Not misuse the service, interfere with other tenants, or attempt unauthorized access.</li>
      </ul>

      <h2>6. Patient and clinical data</h2>
      <p>
        As between the parties, you retain ownership of data you submit to {LEGAL.productName}.
        You grant us a limited license to host, process, transmit, and display that data
        solely to provide and improve the service, prevent abuse, and comply with law.
      </p>
      <p>
        Where protected health information is involved, the parties may enter a separate
        business associate agreement if required. In the absence of such agreement, you agree
        not to submit information you are prohibited from sharing with us under applicable
        law.
      </p>

      <h2>7. AI and clinical decision support</h2>
      <p>
        {LEGAL.productName} may generate draft documentation or structured suggestions based
        on intake and encounter data. These outputs are assistive tools only. You remain
        solely responsible for clinical judgment, documentation accuracy, billing decisions,
        and patient care.
      </p>

      <h2>8. Acceptable use</h2>
      <p>
        Your use of the service is also subject to our{" "}
        <Link href="/terms-of-use">Terms of Use</Link>. Violations may result in suspension
        or termination.
      </p>

      <h2>9. Confidentiality and security</h2>
      <p>
        We will maintain reasonable safeguards designed to protect Customer data. You are
        responsible for configuring roles, revoking access when staff depart, and using
        secure devices and networks.
      </p>

      <h2>10. Intellectual property</h2>
      <p>
        {LEGAL.companyName} and its licensors own the service, software, branding, and
        underlying technology. These Terms do not grant you ownership of our intellectual
        property. Feedback you provide may be used to improve the service without obligation
        to you.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        We may suspend or terminate access if you breach these Terms, fail to pay applicable
        fees, or if continued provision poses security, legal, or operational risk. You may
        cancel according to the Cancellation Policy. Upon termination, your right to access
        the service ends, subject to any data export window we make available.
      </p>

      <h2>12. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE
        MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
        INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE
        DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, UNINTERRUPTED, OR THAT OUTPUTS
        WILL BE CLINICALLY COMPLETE OR ACCURATE.
      </p>

      <h2>13. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, {LEGAL.companyName} WILL NOT BE LIABLE FOR
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST
        PROFITS, REVENUE, DATA, OR GOODWILL. OUR TOTAL LIABILITY ARISING OUT OF THESE TERMS
        WILL NOT EXCEED THE AMOUNTS PAID BY YOU TO US FOR THE SERVICE IN THE TWELVE (12)
        MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You will defend and indemnify {LEGAL.companyName} against claims arising from your
        data, your clinical or business use of the service, your violation of law, or your
        breach of these Terms, except to the extent caused by our gross negligence or willful
        misconduct.
      </p>

      <h2>15. Changes</h2>
      <p>
        We may modify these Terms by posting an updated version and changing the &quot;Last
        updated&quot; date. Material changes to paid subscriptions will take effect on
        renewal or after reasonable notice where required.
      </p>

      <h2>16. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Delaware, USA, without regard to
        conflict-of-law rules, except where mandatory consumer protection laws provide
        otherwise.
      </p>

      <h2>17. Contact</h2>
      <p>
        Billing and account questions:{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>. Legal notices may
        be sent to the same address with subject line &quot;Legal Notice.&quot;
      </p>
    </LegalPageShell>
  );
}
