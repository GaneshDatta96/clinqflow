"use client";

import { CheckCircle2, Circle, Clock, FileText, Link2, User } from "lucide-react";

function PanelChrome({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-raised)] shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
            {title}
          </p>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] font-medium text-[color:var(--foreground)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-[color:var(--line-strong)]" />
          <span className="h-2 w-2 rounded-full bg-[color:var(--line-strong)]" />
          <span className="h-2 w-2 rounded-full bg-[color:var(--line-strong)]" />
        </div>
      </div>
      {children}
    </div>
  );
}

export function HeroWorkflowPreview() {
  const intakeSteps = [
    { label: "Demographics", done: true },
    { label: "Symptoms & timeline", done: true },
    { label: "Lifestyle factors", done: true },
    { label: "Goals & history", done: false },
  ];

  return (
    <div className="relative pb-16 sm:pb-20">
      <div className="absolute -left-6 top-8 hidden h-px w-24 bg-gradient-to-r from-[color:var(--gradient-start)] to-transparent lg:block" />

      <PanelChrome title="Practitioner dashboard" subtitle="Vande Wellness · Today">
        <div className="grid lg:grid-cols-[140px_1fr]">
          <aside className="hidden border-r border-[color:var(--line)] bg-[color:var(--surface-muted)]/50 p-3 lg:block">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
              Queue
            </p>
            <ul className="mt-3 space-y-2">
              {[
                { name: "M. Chen", status: "Intake complete", active: true },
                { name: "J. Ortiz", status: "Awaiting review", active: false },
                { name: "A. Patel", status: "Link sent", active: false },
              ].map((p) => (
                <li
                  key={p.name}
                  className={`rounded-md px-2 py-1.5 text-[10px] ${
                    p.active
                      ? "border border-[color:var(--line)] bg-white font-medium text-[color:var(--foreground)]"
                      : "text-[color:var(--muted-strong)]"
                  }`}
                >
                  {p.name}
                  <span className="mt-0.5 block text-[9px] font-normal text-[color:var(--muted)]">
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="p-3 sm:p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[color:var(--line)] pb-3">
              <div>
                <p className="text-sm font-semibold text-[color:var(--foreground)]">Maria Chen</p>
                <p className="text-[11px] text-[color:var(--muted)]">
                  Functional medicine · Visit in 2h 14m
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-md border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-2 py-1 text-[10px] font-medium text-[color:var(--primary)]">
                <CheckCircle2 className="h-3 w-3 text-[color:var(--accent)]" />
                Intake submitted
              </span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-[color:var(--line)] p-3">
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
                  Chief complaint
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[color:var(--muted-strong)]">
                  Persistent fatigue, brain fog, disrupted sleep × 4 months
                </p>
              </div>
              <div className="rounded-md border border-[color:var(--line)] p-3">
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
                  Pattern signals
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {["Sleep", "Thyroid", "Stress load"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[color:var(--line)] px-1.5 py-0.5 text-[9px] text-[color:var(--muted-strong)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-md border border-[color:var(--primary)]/15 bg-[color:var(--primary)]/[0.03] p-3">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[color:var(--primary)]">
                  SOAP draft · pending review
                </p>
                <Clock className="h-3 w-3 text-[color:var(--muted)]" />
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[color:var(--muted-strong)]">
                <span className="font-semibold text-[color:var(--foreground)]">S:</span> Patient
                reports 4-month history of fatigue with afternoon crashes…
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[color:var(--muted-strong)]">
                <span className="font-semibold text-[color:var(--foreground)]">A:</span> Pattern
                scoring suggests sleep–stress axis; thyroid markers flagged for review…
              </p>
              <div className="mt-3 flex gap-2">
                <span className="rounded-md bg-[color:var(--primary)] px-2 py-1 text-[9px] font-medium text-white">
                  Review draft
                </span>
                <span className="rounded-md border border-[color:var(--line)] px-2 py-1 text-[9px] text-[color:var(--muted-strong)]">
                  Edit sections
                </span>
              </div>
            </div>
          </div>
        </div>
      </PanelChrome>

      <div className="absolute -bottom-4 -right-2 w-[min(100%,220px)] sm:-right-6">
        <PanelChrome title="Patient intake" subtitle="Step 4 of 6">
          <div className="space-y-2 p-3">
            {intakeSteps.map((step) => (
              <div key={step.label} className="flex items-center gap-2 text-[10px]">
                {step.done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[color:var(--accent)]" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-[color:var(--muted)]" />
                )}
                <span
                  className={
                    step.done ? "text-[color:var(--muted-strong)]" : "font-medium text-[color:var(--foreground)]"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </PanelChrome>
      </div>
    </div>
  );
}

export function IntakeLinkPreview() {
  return (
    <PanelChrome title="Intake link" subtitle="Generated · expires in 72h">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
            <Link2 className="h-4 w-4 text-[color:var(--primary)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[10px] text-[color:var(--muted-strong)]">
              clinqflow.app/c/vande-wellness/m7k2
            </p>
            <p className="text-[11px] text-[color:var(--muted)]">Functional medicine template</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[color:var(--line)] pt-3">
          {[
            { label: "Sent", value: "1" },
            { label: "Opened", value: "1" },
            { label: "Completed", value: "0" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[color:var(--muted)]">
                {stat.label}
              </p>
              <p className="text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PanelChrome>
  );
}

export function SoapDraftPreview() {
  const sections = [
    {
      key: "Subjective",
      body: "Patient describes progressive fatigue, difficulty concentrating, and non-restorative sleep over 16 weeks.",
    },
    {
      key: "Objective",
      body: "Intake-only. Vitals and exam pending at visit. Self-reported sleep avg 5.2h/night.",
    },
    {
      key: "Assessment",
      body: "Structured pattern summary generated from intake scoring — not a diagnosis.",
    },
    {
      key: "Plan",
      body: "Draft placeholders for practitioner to complete after clinical evaluation.",
    },
  ];

  return (
    <PanelChrome title="SOAP documentation" subtitle="Draft · practitioner review required">
      <div className="divide-y divide-[color:var(--line)]">
        {sections.map((section) => (
          <div key={section.key} className="px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 text-[color:var(--muted)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[color:var(--foreground)]">
                {section.key}
              </p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[color:var(--muted-strong)]">
              {section.body}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]/60 px-4 py-2.5">
        <p className="text-[10px] text-[color:var(--muted)]">
          All sections require licensed practitioner approval before clinical use.
        </p>
      </div>
    </PanelChrome>
  );
}

export function WorkflowMetricsStrip() {
  const metrics = [
    { label: "Avg. intake completion", value: "12 min" },
    { label: "Pre-visit context ready", value: "94%" },
    { label: "Discovery time saved", value: "~5.2 min" },
    { label: "Review-first drafts", value: "100%" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[color:var(--line)] bg-[color:var(--line)] lg:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="bg-[color:var(--surface-raised)] px-4 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
            {m.label}
          </p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
            {m.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function EncounterRowPreview() {
  const rows = [
    { name: "Maria Chen", meta: "FM intake", status: "Review SOAP", step: "Practitioner" },
    { name: "James Ortiz", meta: "Chiro · new", status: "Intake done", step: "Schedule" },
    { name: "Aisha Patel", meta: "Wellness", status: "Link sent", step: "Await patient" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--line)]">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[color:var(--muted)]">
        <span>Patient</span>
        <span className="hidden sm:block">Status</span>
        <span>Next step</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={row.name}
          className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-2.5 text-[11px] ${
            i > 0 ? "border-t border-[color:var(--line)]" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-[color:var(--muted)]" />
            <div>
              <p className="font-medium text-[color:var(--foreground)]">{row.name}</p>
              <p className="text-[10px] text-[color:var(--muted)]">{row.meta}</p>
            </div>
          </div>
          <span className="hidden rounded border border-[color:var(--line)] px-1.5 py-0.5 text-[9px] sm:inline">
            {row.status}
          </span>
          <span className="text-[10px] text-[color:var(--muted-strong)]">{row.step}</span>
        </div>
      ))}
    </div>
  );
}
