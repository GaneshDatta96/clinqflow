"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, HeartPulse, Stethoscope, User } from "lucide-react";
import { type EncounterDashboardCase } from "@/lib/dashboard/encounter-view";
import { SoapApproveButton } from "@/components/dashboard/soap-approve-button";

export function EncounterDashboardShell({
  cases,
}: {
  cases: EncounterDashboardCase[];
}) {
  const [selectedId, setSelectedId] = useState(cases[0]?.id ?? "");
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
    <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(24rem,28rem)_minmax(0,1fr)]">
      <aside className="glass-panel rounded-[2rem] p-4 sm:p-5">
        <p className="section-label">Encounter queue</p>
        <h2 className="mt-2 text-2xl font-semibold">Patients</h2>
        <div className="mt-5 space-y-3">
          {cases.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition ${
                selectedId === item.id
                  ? "border-transparent bg-[color:var(--foreground)] text-white"
                  : "border-[color:var(--line)] bg-white/70"
              }`}
            >
              <p className="text-lg font-semibold">
                {item.patient.first_name} {item.patient.last_name}
              </p>
              <p className="mt-1 text-sm opacity-80 line-clamp-2">
                {item.chief_complaint}
              </p>
              <p className="mt-2 text-xs uppercase tracking-wider opacity-70">
                {item.status}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <main className="min-w-0 rounded-[2rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-6 lg:p-8">
        <header className="mb-6">
          <p className="section-label">Selected encounter</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {active.patient.first_name} {active.patient.last_name}
          </h1>
          <p className="mt-2 text-[color:var(--muted)]">{active.chief_complaint}</p>
        </header>

        {active.soap ? (
          <div className="space-y-4">
            <SoapSection title="Subjective" icon={User} content={active.soap.subjective} />
            <SoapSection title="Objective" icon={HeartPulse} content={active.soap.objective} />
            <SoapSection title="Assessment" icon={Stethoscope} content={active.soap.assessment} />
            <SoapSection title="Plan (review required)" icon={FileText} content={active.soap.plan} />
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-[color:var(--muted)]">
                Review status: {active.soap.review_status}
              </p>
              <SoapApproveButton
                encounterId={active.id}
                currentStatus={active.soap.review_status}
              />
            </div>
          </div>
        ) : (
          <p className="text-[color:var(--muted)]">No SOAP draft available.</p>
        )}

        {active.appointment_request && (
          <div className="mt-6 rounded-xl border border-[color:var(--line)] bg-white/80 p-4">
            <h3 className="font-semibold">Appointment request</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {active.appointment_request.preferred_day} ·{" "}
              {active.appointment_request.preferred_time} ·{" "}
              {active.appointment_request.status}
            </p>
            {active.appointment_request.notes && (
              <p className="mt-1 text-sm">{active.appointment_request.notes}</p>
            )}
          </div>
        )}

        {active.patterns.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold">Pattern assessment</h3>
            <ul className="mt-3 space-y-3">
              {active.patterns.map((p) => (
                <li
                  key={p.pattern_key}
                  className="rounded-xl border border-[color:var(--line)] bg-white/80 p-4"
                >
                  <p className="font-semibold">{p.pattern_key.replaceAll("_", " ")}</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    Confidence {p.confidence.toFixed(2)} · {p.risk_level}
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

function SoapSection({
  title,
  icon: Icon,
  content,
}: {
  title: string;
  icon: React.ElementType;
  content: string;
}) {
  return (
    <details open className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/80 p-5">
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
