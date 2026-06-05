import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { SERVICE_DESCRIPTION } from "@/lib/legal/clauses";
import { LEGAL } from "@/lib/legal/site";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Data Processing Addendum",
  description: `DPA for ${LEGAL.productName} clinic customers.`,
  path: "/dpa",
});

export default function DpaPage() {
  return (
    <LegalPageShell
      title="Data Processing Addendum"
      description={`This Data Processing Addendum (&quot;DPA&quot;) forms part of the agreement between Customer and ${LEGAL.legalName}, ${LEGAL.entityDescription}.`}
    >
      <h2>1. Roles</h2>
      <p>
        Customer is the controller (and business associate where applicable) of personal data
        and protected health information submitted to the service. CliniqFlow is the processor
        processing such data on Customer&apos;s documented instructions.
      </p>

      <h2>2. Subject matter and duration</h2>
      <p>{SERVICE_DESCRIPTION}</p>
      <p>
        Processing continues for the term of the Customer&apos;s subscription and as needed for
        post-termination export, deletion, and legal retention.
      </p>

      <h2>3. Categories of data and subjects</h2>
      <ul>
        <li>
          <strong>Data subjects:</strong> clinic staff, patients completing intake, and account
          administrators.
        </li>
        <li>
          <strong>Personal data:</strong> account information, patient demographics and contact
          details, intake responses, symptoms, documentation drafts, consent records, and usage
          logs.
        </li>
      </ul>

      <h2>4. Processor obligations</h2>
      <ul>
        <li>Process personal data only on Customer instructions, including via the service.</li>
        <li>Ensure personnel confidentiality.</li>
        <li>Implement measures in the <Link href="/security-policy">Security Policy</Link>.</li>
        <li>
          Engage subprocessors per the{" "}
          <Link href="/subprocessors">Subprocessor Disclosure</Link> with thirty (30) days
          notice of material changes where feasible.
        </li>
        <li>Assist with data subject requests where technically feasible.</li>
        <li>Notify Customer without undue delay of confirmed personal data breaches.</li>
        <li>Delete or return data upon termination subject to legal retention.</li>
      </ul>

      <h2>5. International transfers</h2>
      <p>
        Where personal data is transferred outside the Customer&apos;s jurisdiction, CliniqFlow
        will use appropriate safeguards including EU Standard Contractual Clauses (Module 2:
        Controller to Processor) and the UK International Data Transfer Addendum where
        applicable.
      </p>

      <h2>6. Audit</h2>
      <p>
        Customer may export tenant audit logs through the compliance settings in the product or
        request additional information reasonably necessary to demonstrate compliance, subject
        to confidentiality and security constraints.
      </p>

      <h2>7. HIPAA / BAA</h2>
      <p>
        Where Customer is a covered entity or business associate under HIPAA and submits PHI,
        the parties may execute a separate Business Associate Agreement. Customer is responsible
        for determining whether a BAA is required.
      </p>

      <h2>8. Liability</h2>
      <p>
        Liability under this DPA is subject to the{" "}
        <Link href="/legal-liability">Limitation of Liability and Indemnification</Link> and{" "}
        <Link href="/terms">Terms of Service</Link>, except where mandatory law provides
        otherwise.
      </p>

      <h2>9. Contact</h2>
      <p>
        Data protection inquiries:{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
      </p>
    </LegalPageShell>
  );
}
