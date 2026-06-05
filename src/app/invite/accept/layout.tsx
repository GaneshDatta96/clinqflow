import type { Metadata } from "next";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Accept invite",
  description: "Accept your CliniqFlow clinic invitation.",
  path: "/invite/accept",
  robots: NOINDEX_ROBOTS,
});

export const dynamic = "force-dynamic";

export default function AcceptInviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
