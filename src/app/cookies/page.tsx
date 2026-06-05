import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description: `How ${LEGAL.productName} uses cookies.`,
  path: "/cookies",
});

export default function CookiePolicyPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      description={`This Cookie Policy explains how ${LEGAL.productName} uses cookies and similar technologies.`}
    >
      <h2>1. What we use today</h2>
      <p>
        {LEGAL.productName} currently uses <strong>strictly necessary cookies</strong> only. We
        do not use advertising cookies or third-party marketing analytics cookies.
      </p>

      <h2>2. Cookies in use</h2>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Supabase session cookies</td>
            <td>Authentication and session management</td>
            <td>Session / provider default</td>
          </tr>
          <tr>
            <td>cliniqflow_active_tenant_id</td>
            <td>Remembers active organization for multi-tenant users</td>
            <td>90 days (httpOnly)</td>
          </tr>
          <tr>
            <td>cliniqflow_acting_tenant_id</td>
            <td>Platform administrator impersonation context</td>
            <td>4 hours (httpOnly)</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Managing cookies</h2>
      <p>
        You can control cookies through your browser settings. Disabling authentication cookies
        will prevent you from signing in.
      </p>

      <h2>4. Changes</h2>
      <p>
        If we introduce non-essential cookies, we will update this policy and provide appropriate
        notice or consent mechanisms where required.
      </p>

      <h2>5. Contact</h2>
      <p>
        Questions: <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>. See also{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPageShell>
  );
}
