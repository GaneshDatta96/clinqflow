import type { Metadata } from "next";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Confirm account",
  description: "Confirm your CliniqFlow account.",
  path: "/auth/confirm",
  robots: NOINDEX_ROBOTS,
});

export default function AuthConfirmLayout({ children }: { children: React.ReactNode }) {
  return children;
}
