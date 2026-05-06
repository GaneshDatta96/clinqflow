import type { Metadata } from "next";
import { HomepageLanding } from "@/components/home/homepage-landing";

export const metadata: Metadata = {
  title: "Custom Patient Intake Workflow Demo",
  description:
    "Create a patient, generate a unique patient link, collect intake responses, and review structured SOAP-ready data in a custom clinic workflow demo.",
};

export default function Home() {
  return <HomepageLanding />;
}
