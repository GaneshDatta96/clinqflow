"use client";

import { EncounterDashboardShell } from "@/components/dashboard/encounter-dashboard-shell";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { AppWorkspacePreviewShell } from "@/components/home/app-workspace-preview-shell";
import { ClientOnly } from "@/components/home/client-only";
import { ProductPreviewFrame } from "@/components/home/product-preview-frame";
import { ScaledAppPreview } from "@/components/home/scaled-app-preview";
import { proofCases, proofClinic, proofEncounter } from "@/lib/marketing/proof-data";

function PreviewPlaceholder() {
  return (
    <div className="absolute inset-0 bg-[color:var(--surface-muted)]" aria-hidden>
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="h-3 w-28 rounded-full bg-[color:var(--line)]" />
        <div className="h-8 w-2/3 rounded-xl bg-[color:var(--line)]" />
        <div className="mt-2 flex flex-1 gap-3">
          <div className="w-1/3 rounded-xl bg-[color:var(--line)]/80" />
          <div className="flex-1 rounded-xl bg-[color:var(--line)]/60" />
        </div>
      </div>
    </div>
  );
}

type PreviewProps = {
  className?: string;
};

export function HeroOperationalPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame
      label="cliniqflow.app/app/dashboard"
      aspect="wide"
      elevated
      className={className}
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

export function DashboardProductPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame
      label="cliniqflow.app/app/dashboard"
      aspect="wide"
      elevated
      className={className}
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
