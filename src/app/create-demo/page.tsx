import { CreateDemoForm } from "@/components/clinics/create-demo-form";
import { getDemoNicheOptions } from "@/lib/clinics/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Demo Route",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateDemoPage() {
  return <CreateDemoForm nicheOptions={getDemoNicheOptions()} />;
}
