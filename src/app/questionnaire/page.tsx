import type { Metadata } from "next";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { getDefaultClinic } from "@/lib/clinics/niche-configs";
import { getClinicForSlug } from "@/lib/clinics/store";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Patient questionnaire",
  description: "Secure patient questionnaire form.",
  path: "/questionnaire",
  robots: NOINDEX_ROBOTS,
});

export default async function QuestionnairePage({
  searchParams,
}: {
  searchParams: Promise<{
    patientId?: string | string[];
    clinic?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const patientId =
    typeof params.patientId === "string" ? params.patientId : null;
  const clinicSlug = typeof params.clinic === "string" ? params.clinic : null;
  const clinic = clinicSlug ? await getClinicForSlug(clinicSlug) : getDefaultClinic();

  return (
    <PatientIntakeExperience
      clinic={clinic ?? getDefaultClinic()}
      initialPatientId={patientId}
      mode="public"
    />
  );
}
