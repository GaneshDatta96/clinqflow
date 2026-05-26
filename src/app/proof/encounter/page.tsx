import { EncounterDetailView } from "@/components/dashboard/encounter-detail-view";
import { ProofScreenShell } from "@/components/home/proof-screen-shell";
import { proofEncounter } from "@/lib/marketing/proof-data";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProofEncounterPage() {
  return (
    <ProofScreenShell>
      <div data-proof-screen="encounter" className="mx-auto max-w-[1380px]">
        <div className="flex w-full flex-1 flex-col gap-6">
          <EncounterDetailView encounter={proofEncounter} />
        </div>
      </div>
    </ProofScreenShell>
  );
}
