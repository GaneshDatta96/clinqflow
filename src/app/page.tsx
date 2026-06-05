import type { Metadata } from "next";
import { HomepageLanding } from "@/components/home/homepage-landing";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Patient Intake & AI-Assisted Clinical Documentation Software",
  description:
    "CliniqFlow helps clinics run structured patient intake and draft documentation workflows. AI-assisted documentation and clinical decision-support for licensed practitioner review—not an EHR.",
  path: "/",
});

export default function Home() {
  return <HomepageLanding />;
}
