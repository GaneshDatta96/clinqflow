import type { Metadata } from "next";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { getDefaultClinic } from "@/lib/clinics/niche-configs";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Patient intake",
  description: "Secure patient intake form.",
  path: "/intake",
  robots: NOINDEX_ROBOTS,
});

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Promise<{
    patientId?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const patientId =
    typeof params.patientId === "string" ? params.patientId : null;

  return (
    <PatientIntakeExperience
      clinic={getDefaultClinic()}
      initialPatientId={patientId}
      mode="public"
    />
  );
}
