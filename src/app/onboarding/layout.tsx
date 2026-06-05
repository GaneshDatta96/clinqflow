import type { Metadata } from "next";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Clinic onboarding",
  description: "Set up your CliniqFlow clinic workspace.",
  path: "/onboarding",
  robots: NOINDEX_ROBOTS,
});

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
