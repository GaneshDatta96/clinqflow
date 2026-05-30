import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import {
  AI_DISCLAIMER_SHORT,
  EXCLUDED_DAMAGES,
  LIABILITY_CAP_INTRO,
  SERVICE_DESCRIPTION,
} from "@/lib/legal/clauses";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Rules for accessing and using the ${LEGAL.productName} platform.`,
};

export default function TermsOfUsePage() {
  return (
    <LegalPageShell
      title="Terms of Use"
      description={`These Terms of Use apply to anyone who accesses ${LEGAL.productName}, including clinic staff, administrators, invited users, and patients completing intake forms.`}
    >
      <h2>1. Acceptance</h2>
      <p>
        By accessing {LEGAL.productName}, you agree to these Terms of Use and our{" "}
        <Link href="/privacy">Privacy Policy</Link>. Clinic subscriptions are also governed
        by our <Link href="/terms">Terms of Service</Link>, which control for subscription
        matters including liability limits.
      </p>

      <h2>2. The platform</h2>
      <p>{SERVICE_DESCRIPTION}</p>

      <h2>3. Permitted use</h2>
      <ul>
        <li>Clinic users may manage intake workflows, patients, and documentation drafts.</li>
        <li>Patients may complete intake questionnaires through links issued by their clinic.</li>
        <li>Demo environments are for testing unless explicitly authorized for production care.</li>
      </ul>

      <h2>4. Prohibited conduct</h2>
      <p>See our <Link href="/acceptable-use">Acceptable Use Policy</Link>. You may not:</p>
      <ul>
        <li>Access data without authorization or circumvent security controls.</li>
        <li>Use the platform for emergencies or unauthorized medical advice.</li>
        <li>Impersonate a clinician or misrepresent your relationship to a clinic.</li>
        <li>Scrape, probe, or reverse engineer except where legally permitted.</li>
      </ul>

      <h2>5. Account security</h2>
      <p>
        Keep credentials confidential. Notify{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> of suspected
        unauthorized access.
      </p>

      <h2>6. Patient and intake users</h2>
      <p>
        Provide accurate information to the best of your knowledge. Your clinic is responsible
        for how responses are used. Health record questions should be directed to the clinic,
        not CliniqFlow. Not for emergencies — contact local emergency services.
      </p>

      <h2>7. Content and outputs</h2>
      <p>{AI_DISCLAIMER_SHORT}</p>
      <p>
        See <Link href="/ai-disclaimer">AI Disclaimer</Link> and{" "}
        <Link href="/medical-disclaimer">Medical Disclaimer</Link>.
      </p>

      <h2>8. Third-party services</h2>
      <p>
        The platform uses third-party providers for hosting, authentication, payments, email,
        and AI processing listed in our <Link href="/subprocessors">Subprocessor Disclosure</Link>.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        The platform, design, software, and branding are owned by {LEGAL.legalName} or licensors.
      </p>

      <h2>10. Monitoring and enforcement</h2>
      <p>
        We may monitor use to maintain security and enforce these Terms. Violations may result
        in suspension or termination.
      </p>

      <h2>11. Disclaimers and liability</h2>
      <p>
        THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; TO THE MAXIMUM
        EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES.
      </p>
      <p>
        For paying clinic accounts, liability is governed by the{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/legal-liability">Limitation of Liability and Indemnification</Link>.
        {LIABILITY_CAP_INTRO} {EXCLUDED_DAMAGES}
      </p>

      <h2>12. Changes and contact</h2>
      <p>
        Report abuse or security concerns to{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
      </p>
    </LegalPageShell>
  );
}
