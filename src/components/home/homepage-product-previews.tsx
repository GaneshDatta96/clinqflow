"use client";

import { EncounterDashboardShell } from "@/components/dashboard/encounter-dashboard-shell";
import { EncounterDetailView } from "@/components/dashboard/encounter-detail-view";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { ProductPreviewFrame } from "@/components/home/product-preview-frame";
import { ScaledAppPreview } from "@/components/home/scaled-app-preview";
import { proofCases, proofClinic, proofEncounter } from "@/lib/marketing/proof-data";

type PreviewProps = {
  className?: string;
};

export function DashboardProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame label="cliniqflow.app/app/dashboard" aspect="wide" className={className}>
      <ScaledAppPreview designWidth={1280}>
        <EncounterDashboardShell cases={proofCases} />
      </ScaledAppPreview>
    </ProductPreviewFrame>
  );
}

export function EncounterProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame label="cliniqflow.app/app/encounters" aspect="wide" className={className}>
      <ScaledAppPreview designWidth={1120}>
        <EncounterDetailView encounter={proofEncounter} />
      </ScaledAppPreview>
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
      <ScaledAppPreview designWidth={960}>
        <PatientIntakeExperience
          clinic={proofClinic}
          initialPatientId="proof-patient"
          intakeToken="proof-token"
          mode="public"
        />
      </ScaledAppPreview>
    </ProductPreviewFrame>
  );
}
