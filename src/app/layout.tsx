import type { Metadata } from "next";
import { headers } from "next/headers";
import { GoogleTag } from "@/components/analytics/google-tag";
import { fontVariables } from "@/lib/fonts";
import { AppProviders } from "@/components/providers/app-providers";
import { GlobalFooter } from "@/components/layout/footer";
import { GlobalHeader } from "@/components/layout/header";
import { CookieNotice } from "@/components/legal/cookie-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { CSP_NONCE_HEADER } from "@/lib/security/csp";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get(CSP_NONCE_HEADER) ?? undefined;

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <head>
        <GoogleTag nonce={nonce} />
      </head>
      <body className="flex min-h-full flex-col text-[15px] text-[color:var(--foreground)]">
        <JsonLd nonce={nonce} data={[organizationSchema(), websiteSchema()]} />
        <AppProviders>
          <GlobalHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <GlobalFooter />
          <CookieNotice />
        </AppProviders>
      </body>
    </html>
  );
}
