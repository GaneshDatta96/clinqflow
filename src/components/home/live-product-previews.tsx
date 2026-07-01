"use client";

import { EncounterDashboardShell } from "@/components/dashboard/encounter-dashboard-shell";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { AppWorkspacePreviewShell } from "@/components/home/app-workspace-preview-shell";
import { ClientOnly } from "@/components/home/client-only";
import { PreviewPlaceholder } from "@/components/home/preview-placeholder";
import { ProductPreviewFrame } from "@/components/home/product-preview-frame";
import { ScaledAppPreview } from "@/components/home/scaled-app-preview";
import { proofCases, proofClinic, proofEncounter } from "@/lib/marketing/proof-data";

type PreviewProps = {
  className?: string;
};

export function DashboardProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame
      label="cliniqflow.app/app/dashboard"
      aspect="wide"
      elevated
      className={className}
      ariaLabel="Clinic documentation workflow dashboard with encounter status and SOAP review"
    >
      <ClientOnly fallback={<PreviewPlaceholder />}>
        <ScaledAppPreview designWidth={1120} fadeBottom padding={false}>
          <AppWorkspacePreviewShell>
            <EncounterDashboardShell
              cases={proofCases}
              defaultSelectedId={proofEncounter.id}
              preview
            />
          </AppWorkspacePreviewShell>
        </ScaledAppPreview>
      </ClientOnly>
    </ProductPreviewFrame>
  );
}

export function EncounterProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame
      label="cliniqflow.app/app/encounters"
      aspect="wide"
      elevated
      className={className}
      ariaLabel="Encounter review screen with draft SOAP documentation sections for practitioner approval"
    >
      <ClientOnly fallback={<PreviewPlaceholder />}>
        <ScaledAppPreview designWidth={1000} fadeBottom padding={false}>
          <EncounterDashboardShell
            cases={[proofEncounter]}
            defaultSelectedId={proofEncounter.id}
            preview
          />
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
      elevated
      className={className}
      ariaLabel="Digital patient intake form with structured specialty questionnaire before the clinic visit"
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
