"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ChevronRight, FileText, HeartPulse, Stethoscope, User } from "lucide-react";
import { type EncounterDashboardCase } from "@/lib/dashboard/encounter-view";
import { SoapApproveButton } from "@/components/dashboard/soap-approve-button";

export function EncounterDashboardShell({
  cases,
  defaultSelectedId,
  preview = false,
}: {
  cases: EncounterDashboardCase[];
  defaultSelectedId?: string;
  preview?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? cases[0]?.id ?? "");
  const active = cases.find((c) => c.id === selectedId) ?? cases[0];

  if (!active) {
    return (
      <section className="rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-8 text-center">
        <h2 className="text-2xl font-semibold">No encounters yet</h2>
        <p className="mt-2 text-[color:var(--muted)]">
          Create a patient and send an intake link to get started.
        </p>
        <Link
          href="/app/patients"
          className="mt-6 inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          Manage patients
        </Link>
      </section>
    );
  }

  return (
    <div
      className={`grid flex-1 gap-6 ${
        preview
          ? "grid-cols-[minmax(13.5rem,15rem)_minmax(0,1fr)]"
          : "xl:grid-cols-[minmax(24rem,28rem)_minmax(0,1fr)]"
      }`}
    >
      <aside className="glass-panel rounded-[1.75rem] p-4 sm:p-5">
        <p className="section-label">Encounter queue</p>
        <h2 className={`mt-2 font-semibold ${preview ? "text-xl" : "text-2xl"}`}>Patients</h2>
        <div className="mt-5 space-y-3">
          {cases.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              disabled={preview}
              className={`w-full rounded-[1.35rem] border px-4 py-3.5 text-left transition ${
                selectedId === item.id
                  ? "border-transparent bg-[color:var(--foreground)] text-white shadow-[0_8px_24px_rgba(11,16,32,0.12)]"
                  : "border-[color:var(--line)] bg-white/80"
              }`}
            >
              <p className={`font-semibold ${preview ? "text-base" : "text-lg"}`}>
                {item.patient.first_name} {item.patient.last_name}
              </p>
              <p className="mt-1 text-sm opacity-80 line-clamp-2">
                {item.chief_complaint}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider opacity-70">
                {preview ? formatEncounterStatus(item.status) : item.status}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <main className="min-w-0 rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 lg:p-6">
        <header className="mb-5">
          <p className="section-label">Selected encounter</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className={`font-semibold tracking-tight ${preview ? "text-2xl" : "text-3xl"}`}>
              {active.patient.first_name} {active.patient.last_name}
            </h1>
            {!preview && (
              <Link
                href={`/app/encounters/${active.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)]"
              >
                Open full detail
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
          <p className="mt-2 text-[color:var(--muted)]">{active.chief_complaint}</p>
        </header>

        {active.soap ? (
          <div className="space-y-4">
            <p className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-amber-950">
              Draft documentation only — not a clinical record until you edit, approve, and
              sign.{" "}
              <a href="/ai-disclaimer" className="font-semibold underline">
                AI disclaimer
              </a>
            </p>
            <SoapSection
              title="Subjective"
              icon={User}
              content={active.soap.subjective}
              preview={preview}
              defaultOpen
            />
            <SoapSection
              title="Objective"
              icon={HeartPulse}
              content={active.soap.objective}
              preview={preview}
              defaultOpen={!preview}
            />
            <SoapSection
              title="Assessment"
              icon={Stethoscope}
              content={active.soap.assessment}
              preview={preview}
            />
            <SoapSection
              title="Plan (review required)"
              icon={FileText}
              content={active.soap.plan}
              preview={preview}
            />
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-[color:var(--muted)]">
                Review status: {active.soap.review_status}
              </p>
              {!preview && (
                <SoapApproveButton
                  encounterId={active.id}
                  currentStatus={active.soap.review_status}
                />
              )}
              {preview && (
                <span className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3.5 py-1.5 text-xs font-semibold text-[color:var(--muted-strong)]">
                  Approve draft
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-[color:var(--muted)]">No SOAP draft available.</p>
        )}

        {active.appointment_request && null}

        {active.patterns.length > 0 && !preview && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Intake theme highlights</h3>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              Structured intake themes for practitioner review — not a clinical diagnosis.
            </p>
            <ul className="mt-3 space-y-3">
              {active.patterns.map((p) => (
                <li
                  key={p.pattern_key}
                  className="rounded-xl border border-[color:var(--line)] bg-white/80 p-4"
                >
                  <p className="font-semibold">{p.pattern_key.replaceAll("_", " ")}</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    Review priority: {p.risk_level.replaceAll("_", " ")}
                  </p>
                  {p.evidence.slice(0, 2).map((e) => (
                    <p key={e} className="mt-1 text-sm">
                      {e}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

function formatEncounterStatus(status: EncounterDashboardCase["status"]) {
  switch (status) {
    case "ready_for_review":
      return "Ready for review";
    case "intake_submitted":
      return "Intake submitted";
    case "link_sent":
      return "Link sent";
    default:
      return status;
  }
}

function SoapSection({
  title,
  icon: Icon,
  content,
  preview = false,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ElementType;
  content: string;
  preview?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className={`rounded-[1.35rem] border border-[color:var(--line)] bg-white/90 ${
        preview ? "p-4" : "p-5"
      }`}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3">
        <Icon className="h-5 w-5 text-[color:var(--accent)]" />
        <span className="text-lg font-semibold">{title}</span>
        <ChevronRight className="ml-auto h-5 w-5 group-open:rotate-90" />
      </summary>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[color:var(--muted-strong)]">
        {content}
      </p>
    </details>
  );
}
