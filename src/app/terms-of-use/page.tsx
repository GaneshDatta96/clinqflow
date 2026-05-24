import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Rules for accessing and using the ${LEGAL.productName} platform.`,
};

export default function TermsOfUsePage() {
  return (
    <LegalPageShell
      title="Terms of Use"
      description={`These Terms of Use apply to anyone who accesses or uses ${LEGAL.productName}, including clinic staff, administrators, invited users, and individuals completing intake forms through a clinic-provided link.`}
    >
      <h2>1. Acceptance</h2>
      <p>
        By accessing {LEGAL.productName}, you agree to these Terms of Use and our{" "}
        <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the
        platform.
      </p>
      <p>
        Clinic subscriptions are also governed by our{" "}
        <Link href="/terms">Terms of Service</Link>. If there is a conflict regarding a
        paying clinic account, the Terms of Service control for subscription matters.
      </p>

      <h2>2. Permitted use</h2>
      <p>You may use {LEGAL.productName} only for lawful purposes and as intended:</p>
      <ul>
        <li>Clinic users may manage intake workflows, patients, and clinical documentation.</li>
        <li>
          Patients may complete intake questionnaires only through links issued by their
          clinic.
        </li>
        <li>
          Demo or evaluation environments may be used for testing and training, not for
          production patient care unless explicitly authorized.
        </li>
      </ul>

      <h2>3. Prohibited conduct</h2>
      <p>You may not:</p>
      <ul>
        <li>Access accounts, tenants, or data without authorization.</li>
        <li>Probe, scan, or test the vulnerability of the platform except with our written consent.</li>
        <li>Reverse engineer, decompile, or attempt to extract source code except where legally permitted.</li>
        <li>Upload malware, spam, or content that is unlawful, harassing, or infringing.</li>
        <li>
          Use the service to provide unauthorized medical advice, impersonate a clinician, or
          misrepresent your relationship to a clinic.
        </li>
        <li>Circumvent usage limits, billing controls, or security measures.</li>
        <li>Scrape or harvest data from the platform through automated means without permission.</li>
      </ul>

      <h2>4. Account security</h2>
      <p>
        Keep your credentials confidential. Notify your clinic administrator or{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> if you suspect
        unauthorized access. You are responsible for activity conducted through your login
        unless caused by our failure to maintain reasonable security.
      </p>

      <h2>5. Patient and intake users</h2>
      <p>
        If you complete an intake form through a clinic link, you agree to provide accurate
        information to the best of your knowledge. The clinic that issued the link is
        responsible for how your responses are used, stored, and shared. Questions about your
        health record should be directed to that clinic, not to {LEGAL.companyName}.
      </p>

      <h2>6. Content and outputs</h2>
      <p>
        The platform may display drafts, scores, summaries, or suggested documentation
        generated from submitted information. These materials are informational and
        assistive. They are not a substitute for professional evaluation, diagnosis, or
        treatment. Licensed clinicians must review outputs before clinical use.
      </p>

      <h2>7. Third-party services</h2>
      <p>
        {LEGAL.productName} may integrate with third-party providers for authentication,
        hosting, payments, analytics, and AI processing. Your use of those features may be
        subject to additional provider terms. We are not responsible for third-party sites or
        services outside our control.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        The platform, visual design, software, and branding are owned by {LEGAL.companyName}
        or its licensors. You may not copy, modify, distribute, or create derivative works
        except as allowed by law or explicit written permission.
      </p>

      <h2>9. Monitoring and enforcement</h2>
      <p>
        We may monitor use of the platform to maintain security, investigate abuse, and
        enforce these Terms. We may suspend or terminate access, remove content, or restrict
        features if we reasonably believe a violation has occurred.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        {LEGAL.productName} IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
        AVAILABLE&quot; BASIS. WE DISCLAIM ALL WARRANTIES TO THE FULLEST EXTENT PERMITTED BY
        LAW. WE DO NOT GUARANTEE CONTINUOUS AVAILABILITY OR ERROR-FREE OPERATION.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, {LEGAL.companyName} WILL NOT BE LIABLE FOR
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR
        USE OF THE PLATFORM. OUR TOTAL LIABILITY FOR CLAIMS RELATING TO THESE TERMS OF USE
        WILL NOT EXCEED ONE HUNDRED U.S. DOLLARS (US $100) OR THE MINIMUM AMOUNT REQUIRED BY
        APPLICABLE LAW, WHICHEVER IS GREATER, EXCEPT WHERE LIABILITY CANNOT BE LIMITED BY
        LAW.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms of Use by posting a revised version on this page. Continued
        use after changes become effective constitutes acceptance of the updated Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        Report abuse, security concerns, or questions about these Terms to{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
      </p>
    </LegalPageShell>
  );
}
