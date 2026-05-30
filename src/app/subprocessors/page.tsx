import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

export const metadata: Metadata = {
  title: "Subprocessor Disclosure",
  description: `Third-party subprocessors used by ${LEGAL.productName}.`,
};

export default function SubprocessorsPage() {
  return (
    <LegalPageShell
      title="Subprocessor Disclosure Policy"
      description={`This page lists third-party subprocessors that ${LEGAL.legalName} uses to provide ${LEGAL.productName}.`}
    >
      <h2>1. Overview</h2>
      <p>
        CliniqFlow engages subprocessors to host infrastructure, authenticate users, process
        payments, deliver email, perform AI inference, and monitor service health. We require
        subprocessors to handle data under contractual obligations appropriate to their role.
      </p>

      <h2>2. Current subprocessors</h2>
      <table>
        <thead>
          <tr>
            <th>Subprocessor</th>
            <th>Purpose</th>
            <th>Data categories</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase</td>
            <td>Database, authentication</td>
            <td>Account and clinical records</td>
            <td>Project region (typically US)</td>
          </tr>
          <tr>
            <td>OpenRouter</td>
            <td>AI documentation draft generation</td>
            <td>Minimized clinical context (no direct identifiers in restricted mode)</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>Stripe</td>
            <td>Subscription billing</td>
            <td>Account and payment metadata</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>PayPal</td>
            <td>Alternative billing</td>
            <td>Account and payment metadata</td>
            <td>United States</td>
          </tr>
          <tr>
            <td>Zoho / SendGrid</td>
            <td>Transactional email</td>
            <td>Email addresses, message content</td>
            <td>India / United States</td>
          </tr>
          <tr>
            <td>Vercel</td>
            <td>Application hosting</td>
            <td>Request metadata, logs</td>
            <td>United States / EU</td>
          </tr>
          <tr>
            <td>Upstash</td>
            <td>Rate limiting</td>
            <td>IP address, request metadata</td>
            <td>United States / EU</td>
          </tr>
          <tr>
            <td>Sentry</td>
            <td>Error monitoring</td>
            <td>Error context (no patient content by design)</td>
            <td>United States</td>
          </tr>
        </tbody>
      </table>

      <h2>3. AI provider retention</h2>
      <p>
        We send <code>X-OpenRouter-Data-Policy: deny</code> with AI requests to request
        zero-retention processing. Provider and upstream model policies govern actual retention.
        We do not guarantee compliance. See <Link href="/ai-disclaimer">AI Disclaimer</Link>.
      </p>

      <h2>4. Changes</h2>
      <p>
        We will update this page when we add or replace subprocessors. Material changes will be
        communicated to clinic customers with at least thirty (30) days notice where feasible,
        consistent with our <Link href="/dpa">DPA</Link>.
      </p>

      <h2>5. Contact</h2>
      <p>
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
      </p>
    </LegalPageShell>
  );
}
