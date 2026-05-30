import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Privacy Requests",
  description: `Submit privacy and data deletion requests for ${LEGAL.productName}.`,
};

export default function PrivacyRequestPage() {
  return (
    <LegalPageShell
      title="Privacy Requests"
      description={`How to submit access, correction, deletion, or restriction requests relating to ${LEGAL.productName}.`}
    >
      <h2>1. Who should submit requests</h2>
      <ul>
        <li>
          <strong>Clinic staff and account holders:</strong> submit requests for account and
          tenant data.
        </li>
        <li>
          <strong>Patients:</strong> contact your clinic first regarding intake health
          information. Clinics control patient records in {LEGAL.productName}.
        </li>
      </ul>

      <h2>2. How to submit</h2>
      <p>
        Email{" "}
        <a href={`mailto:${LEGAL.privacyEmail}?subject=Privacy%20Request`}>
          {LEGAL.privacyEmail}
        </a>{" "}
        with:
      </p>
      <ul>
        <li>Your name and contact email</li>
        <li>Clinic or organization name (if applicable)</li>
        <li>Request type: access, correction, deletion, restriction, or portability</li>
        <li>Sufficient detail to locate the relevant account or data</li>
      </ul>

      <h2>3. Response timeline</h2>
      <p>
        We aim to acknowledge requests within five (5) business days and respond within{" "}
        {LEGAL.dataDeletionSlaDays} days where applicable, subject to verification and legal
        retention requirements.
      </p>

      <h2>4. Deletion</h2>
      <p>
        Deletion requests for tenant clinical data require verification that the requester is
        authorized for the clinic account. Residual copies may persist in encrypted backups for
        a limited period before automatic purge.
      </p>

      <h2>5. Related policies</h2>
      <p>
        <Link href="/privacy">Privacy Policy</Link> · <Link href="/dpa">DPA</Link>
      </p>
    </LegalPageShell>
  );
}
