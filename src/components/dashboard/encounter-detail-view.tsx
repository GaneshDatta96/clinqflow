"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { type EncounterDashboardCase } from "@/lib/dashboard/encounter-view";
import { SoapApproveButton } from "@/components/dashboard/soap-approve-button";

export function EncounterDetailView({ encounter }: { encounter: EncounterDashboardCase }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function regenerateSoap() {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch(`/api/encounters/${encounter.id}/generate-soap`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Regeneration failed");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Regeneration failed");
      }
    });
  }

  return (
    <section className="rounded-[2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-6 py-6 sm:px-8">
      <p className="section-label">Encounter detail</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {encounter.patient.first_name} {encounter.patient.last_name}
      </h1>
      <p className="mt-2 text-[color:var(--muted)]">{encounter.chief_complaint}</p>
      <p className="mt-1 text-sm text-[color:var(--muted)]">Status: {encounter.status}</p>

      {encounter.soap ? (
        <div className="mt-8 space-y-4">
          {(["subjective", "objective", "assessment", "plan"] as const).map((key) => (
            <div
              key={key}
              className="rounded-xl border border-[color:var(--line)] bg-white/80 p-4"
            >
              <p className="text-sm font-semibold uppercase tracking-wide">{key}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted-strong)]">
                {encounter.soap![key]}
              </p>
            </div>
          ))}
          <div className="flex flex-wrap gap-3">
            <SoapApproveButton
              encounterId={encounter.id}
              currentStatus={encounter.soap.review_status}
            />
            <button
              type="button"
              disabled={isPending}
              onClick={regenerateSoap}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-4 py-2 text-sm font-semibold"
            >
              {isPending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Regenerate SOAP
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-[color:var(--muted)]">No SOAP draft on this encounter.</p>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </section>
  );
}
