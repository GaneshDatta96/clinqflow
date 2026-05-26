import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { ProofScreenShell } from "@/components/home/proof-screen-shell";
import { proofClinic } from "@/lib/marketing/proof-data";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProofIntakePage() {
  return (
    <ProofScreenShell>
      <div data-proof-screen="intake" className="mx-auto max-w-[1380px]">
        <PatientIntakeExperience
          clinic={proofClinic}
          initialPatientId="proof-patient"
          intakeToken="proof-token"
          mode="public"
        />
      </div>
    </ProofScreenShell>
  );
}
