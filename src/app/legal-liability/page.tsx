import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import {
  ARBITRATION_CLAUSE,
  EXCLUDED_DAMAGES,
  GOVERNING_LAW,
  LIABILITY_CAP_INTRO,
} from "@/lib/legal/clauses";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Limitation of Liability and Indemnification",
  description: `Liability and indemnification terms for ${LEGAL.productName}.`,
};

export default function LegalLiabilityPage() {
  return (
    <LegalPageShell
      title="Limitation of Liability and Indemnification"
      description={`This exhibit describes limitation of liability and indemnification terms incorporated into the ${LEGAL.productName} Terms of Service.`}
    >
      <h2>1. Relationship to other terms</h2>
      <p>
        This exhibit is incorporated into the <Link href="/terms">Terms of Service</Link>. If
        there is a conflict, the Terms of Service control unless this exhibit expressly states
        otherwise for liability and indemnification matters.
      </p>

      <h2>2. Limitation of liability</h2>
      <p>{LIABILITY_CAP_INTRO}</p>
      <p>{EXCLUDED_DAMAGES}</p>

      <h2>3. Excluded claim types</h2>
      <p>To the maximum extent permitted by law, CliniqFlow is not liable for claims arising from:</p>
      <ul>
        <li>Clinical outcomes, patient harm, or malpractice allegations.</li>
        <li>Reliance on AI-generated or rule-based draft outputs without practitioner review.</li>
        <li>Alleged diagnostic accuracy, completeness, or clinical appropriateness of outputs.</li>
        <li>Customer&apos;s failure to obtain consents or comply with applicable healthcare laws.</li>
        <li>Unauthorized access caused by Customer&apos;s failure to protect credentials.</li>
        <li>Third-party subprocessors except where mandatory law imposes direct liability on CliniqFlow.</li>
      </ul>

      <h2>4. Non-waivable exceptions</h2>
      <p>
        Nothing in these terms excludes liability that cannot be excluded under applicable law,
        including liability for gross negligence or willful misconduct where such exclusion is
        prohibited.
      </p>

      <h2>5. Indemnification by Customer</h2>
      <p>
        Customer will defend, indemnify, and hold harmless {LEGAL.legalName} and its personnel
        from third-party claims arising from:
      </p>
      <ul>
        <li>Customer data, including patient information submitted to the service.</li>
        <li>Clinical, billing, or operational use of the service by Customer or its users.</li>
        <li>Violation of applicable law, professional standards, or these terms.</li>
        <li>Claims by patients or staff relating to care decisions made by Customer.</li>
      </ul>
      <p>
        CliniqFlow will promptly notify Customer of indemnified claims and cooperate reasonably.
        Customer may not settle claims imposing non-monetary obligations on CliniqFlow without
        consent.
      </p>

      <h2>6. Survival</h2>
      <p>
        Limitation of liability and indemnification obligations survive termination of the
        agreement.
      </p>

      <h2>7. Governing law and disputes</h2>
      <p>{GOVERNING_LAW}</p>
      <p>{ARBITRATION_CLAUSE}</p>
    </LegalPageShell>
  );
}
