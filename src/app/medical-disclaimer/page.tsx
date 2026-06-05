import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Medical Disclaimer",
  description: `${LEGAL.productName} is not a medical provider. Read our medical disclaimer.`,
  path: "/medical-disclaimer",
});

export default function MedicalDisclaimerPage() {
  return (
    <LegalPageShell
      title="Medical Disclaimer"
      description={`${LEGAL.productName} is an intake and documentation workflow platform. It is not a substitute for professional medical care.`}
    >
      <h2>Not a medical provider</h2>
      <p>
        {LEGAL.productName} is provided by {LEGAL.legalName}, {LEGAL.entityDescription}.
        CliniqFlow is a software platform only. We are not a healthcare provider, hospital,
        clinic, physician group, or licensed medical professional. Use of {LEGAL.productName}{" "}
        does not create a doctor-patient relationship between you and CliniqFlow.
      </p>

      <h2>No medical advice</h2>
      <p>
        CliniqFlow does not provide medical advice, diagnosis, treatment, prescriptions, or
        emergency services. Content displayed in the platform — including intake summaries,
        structured intake highlights, and draft documentation — is informational and intended
        to support licensed practitioners. It is not a substitute for professional evaluation,
        diagnosis, or treatment.
      </p>

      <h2>Practitioner responsibility</h2>
      <p>
        Licensed healthcare professionals using {LEGAL.productName} remain solely responsible
        for all clinical decisions, documentation accuracy, patient communication, and care
        provided to patients. Practitioners must independently review, edit, approve, and sign
        all documentation before it becomes part of a clinical record.
      </p>

      <h2>Patient users</h2>
      <p>
        If you complete an intake form through a link from your clinic, your responses are
        transmitted to that clinic. Questions about your health or records should be directed
        to your clinic, not to CliniqFlow.
      </p>

      <h2>Emergencies</h2>
      <p>
        <strong>{LEGAL.productName} is not for medical emergencies.</strong> If you believe
        you are experiencing a medical emergency, call your local emergency number immediately
        (for example, 911 in the United States, 112 in the EU, or 108/102 in India) or go to
        the nearest emergency facility. Do not use this platform for urgent or life-threatening
        conditions.
      </p>

      <h2>Not an EHR or treatment system</h2>
      <p>
        CliniqFlow is not an electronic health record, telehealth platform, insurance platform,
        prescription platform, treatment management system, or appointment scheduling system.
      </p>

      <h2>Related policies</h2>
      <p>
        See also our <Link href="/ai-disclaimer">AI Disclaimer</Link>,{" "}
        <Link href="/terms">Terms of Service</Link>, and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPageShell>
  );
}
