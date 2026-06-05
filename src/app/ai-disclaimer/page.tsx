import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { AI_DISCLAIMER_SHORT } from "@/lib/legal/clauses";
import { LEGAL } from "@/lib/legal/site";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Disclaimer",
  description: `How ${LEGAL.productName} uses AI for documentation and clinical decision-support.`,
  path: "/ai-disclaimer",
});

export default function AiDisclaimerPage() {
  return (
    <LegalPageShell
      title="AI Disclaimer"
      description={`${LEGAL.productName} uses AI to assist with draft documentation and clinical decision-support. AI outputs require practitioner review.`}
    >
      <h2>Purpose</h2>
      <p>{AI_DISCLAIMER_SHORT}</p>
      <p>
        {LEGAL.productName} provides AI-assisted documentation and clinical decision-support.
        It does not provide AI diagnosis, diagnostic recommendations, predictive diagnosis, or
        autonomous clinical decisions.
      </p>

      <h2>What AI receives</h2>
      <p>In restricted (default) production mode, AI providers receive minimized context:</p>
      <ul>
        <li>Age and sex</li>
        <li>Reported symptoms</li>
        <li>Intake questionnaire responses</li>
        <li>Rule-based intake theme highlights derived from submitted intake</li>
      </ul>
      <p>AI providers do not receive patient name, email, phone number, or physical address in this mode.</p>

      <h2>What AI produces</h2>
      <p>
        Draft SOAP-style documentation sections (Subjective, Objective, Assessment, Plan) and
        structured text intended for practitioner editing. Outputs may be incomplete, outdated,
        biased, or contain errors including hallucinations.
      </p>

      <h2>Practitioner obligations</h2>
      <ul>
        <li>Review every AI-generated draft before clinical or billing use.</li>
        <li>Edit, approve, and sign documentation according to your professional standards.</li>
        <li>Do not rely on AI outputs as definitive clinical conclusions.</li>
        <li>Maintain sole responsibility for patient care and record accuracy.</li>
      </ul>

      <h2>Third-party AI providers and retention</h2>
      <p>
        AI inference is performed through third-party providers (currently OpenRouter). We
        configure requests to send <code>X-OpenRouter-Data-Policy: deny</code> to request that
        providers not retain request data for training or logging purposes.
      </p>
      <p>
        <strong>We do not guarantee third-party provider compliance with retention requests.</strong>{" "}
        Provider terms, subprocessors, and upstream model policies govern actual handling of
        data. See our <Link href="/subprocessors">Subprocessor Disclosure</Link>.
      </p>

      <h2>Fallback mode</h2>
      <p>
        When AI providers are unavailable or not configured, the platform may generate template
        documentation locally. Fallback outputs are also drafts requiring practitioner review.
      </p>

      <h2>Related policies</h2>
      <p>
        <Link href="/medical-disclaimer">Medical Disclaimer</Link> ·{" "}
        <Link href="/privacy">Privacy Policy</Link> ·{" "}
        <Link href="/terms">Terms of Service</Link>
      </p>
    </LegalPageShell>
  );
}
