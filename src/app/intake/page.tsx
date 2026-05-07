import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { getDefaultClinic } from "@/lib/clinics/niche-configs";

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
