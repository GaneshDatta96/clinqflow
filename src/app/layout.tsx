import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { GlobalFooter } from "@/components/layout/footer";
import { GlobalHeader } from "@/components/layout/header";
import { BRAND } from "@/lib/brand/site";
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

export const metadata: Metadata = {
  title: BRAND.nameDisplay,
  description: BRAND.positioning,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-[15px] text-[color:var(--foreground)]">
        <AppProviders>
          <GlobalHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <GlobalFooter />
        </AppProviders>
      </body>
    </html>
  );
}
