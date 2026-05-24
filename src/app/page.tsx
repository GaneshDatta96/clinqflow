import type { Metadata } from "next";
import { HomepageLanding } from "@/components/home/homepage-landing";
import { BRAND } from "@/lib/brand/site";

export const metadata: Metadata = {
  title: `${BRAND.nameDisplay} — ${BRAND.tagline}`,
  description: BRAND.positioning,
};

export default function Home() {
  return <HomepageLanding />;
}
