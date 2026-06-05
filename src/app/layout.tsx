import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { sourceSerif } from "@/lib/fonts/display";
import { AppProviders } from "@/components/providers/app-providers";
import { GlobalFooter } from "@/components/layout/footer";
import { GlobalHeader } from "@/components/layout/header";
import { CookieNotice } from "@/components/legal/cookie-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { buildRootMetadata } from "@/lib/seo/metadata";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = buildRootMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[15px] text-[color:var(--foreground)]">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
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
