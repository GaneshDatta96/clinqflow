"use client";

import { EncounterDashboardShell } from "@/components/dashboard/encounter-dashboard-shell";
import { EncounterDetailView } from "@/components/dashboard/encounter-detail-view";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { ClientOnly } from "@/components/home/client-only";
import { ProductPreviewFrame } from "@/components/home/product-preview-frame";
import { ScaledAppPreview } from "@/components/home/scaled-app-preview";
import { proofCases, proofClinic, proofEncounter } from "@/lib/marketing/proof-data";

function PreviewPlaceholder() {
  return (
    <div
      className="absolute inset-0 bg-[color:var(--background)]"
      aria-hidden
    />
  );
}

type PreviewProps = {
  className?: string;
};

export function DashboardProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame label="cliniqflow.app/app/dashboard" aspect="wide" className={className}>
      <ClientOnly fallback={<PreviewPlaceholder />}>
        <ScaledAppPreview designWidth={1280}>
          <EncounterDashboardShell cases={proofCases} />
        </ScaledAppPreview>
      </ClientOnly>
    </ProductPreviewFrame>
  );
}

export function EncounterProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame label="cliniqflow.app/app/encounters" aspect="wide" className={className}>
      <ClientOnly fallback={<PreviewPlaceholder />}>
        <ScaledAppPreview designWidth={1120}>
          <EncounterDetailView encounter={proofEncounter} />
        </ScaledAppPreview>
      </ClientOnly>
    </ProductPreviewFrame>
  );
}

export function IntakeProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame
      label={`cliniqflow.app/c/${proofClinic.slug}`}
      aspect="tall"
      className={className}
    >
      <ClientOnly fallback={<PreviewPlaceholder />}>
        <ScaledAppPreview designWidth={960}>
          <PatientIntakeExperience
            clinic={proofClinic}
            initialPatientId="proof-patient"
            intakeToken="proof-token"
            mode="public"
          />
        </ScaledAppPreview>
      </ClientOnly>
    </ProductPreviewFrame>
  );
}
