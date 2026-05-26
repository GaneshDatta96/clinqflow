import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { nicheConfigs } from "@/lib/clinics/niche-configs";
import { BRAND } from "@/lib/brand/site";
import { GradientRule, PetalAccent } from "@/components/home/petal-accent";
import { proofCases, proofEncounter } from "@/lib/marketing/proof-data";

const heroPoints = [
  "Save ~5.2 minutes of physician discovery time",
  "Reduce repetitive intake conversations",
  "Help patients communicate more openly",
  "Practitioner-review-first AI drafting",
];

const workflowMoments = [
  {
    step: "01",
    title: "Structured patient context arrives before the room conversation starts.",
    description:
      "Signed intake links and specialty-specific questionnaires move repetitive discovery out of the appointment and into a calmer pre-visit workflow.",
  },
  {
    step: "02",
    title: "Operational signals become visible instead of buried in messages and memory.",
    description:
      "Teams can see who has completed intake, which encounters are ready for review, and where the practitioner needs to step in next.",
  },
  {
    step: "03",
    title: "Documentation begins with structure, then stays under practitioner control.",
    description:
      "SOAP drafts, evidence, and data gaps are prepared in the workflow, but approval remains firmly with the clinician.",
  },
];

const calmOutcomes = [
  {
    title: "Practitioner energy",
    description:
      "Less repeated history gathering means more attention can stay with the patient instead of the intake choreography.",
  },
  {
    title: "Patient communication",
    description:
      "Patients often share more openly when the first pass happens in a structured, lower-pressure format before the visit.",
  },
  {
    title: "Workflow organization",
    description:
      "Status changes, review steps, and documentation progress live in one operating layer instead of scattered across inboxes, memory, and side notes.",
  },
  {
    title: "Operational calmness",
    description:
      "The system is designed to reduce cognitive overload, not add another glowing dashboard for staff to babysit.",
  },
];

const faqs = [
  {
    question: "Is CliniqFlow an EHR?",
    answer:
      "No. CliniqFlow is an intake, documentation, and practitioner-support workflow layer. It is designed to organize the work before and around the visit, not replace a full EHR.",
  },
  {
    question: "Does it diagnose patients or finalize notes automatically?",
    answer:
      "No. CliniqFlow structures intake, surfaces patterns, and prepares draft documentation. Licensed practitioners remain responsible for diagnosis, interpretation, and final approval.",
  },
  {
    question: "Can intake be tailored by clinic or specialty?",
    answer:
      "Yes. Intake flows are driven by specialty-specific configurations so clinics can collect structured context that fits their workflow instead of forcing a generic questionnaire.",
  },
  {
    question: "What happens after a clinic signs up?",
    answer:
      "Teams create their workspace, complete onboarding, and begin sending signed intake links. From there, the dashboard, encounter review, and documentation workflow become the operating surface for pre-visit preparation.",
  },
];

const encounterStatus: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  link_sent: {
    label: "Link sent",
    className:
      "border-[color:rgba(249,115,22,0.18)] bg-[color:rgba(249,115,22,0.08)] text-[color:#9A3412]",
  },
  intake_submitted: {
    label: "Intake submitted",
    className:
      "border-[color:rgba(124,58,237,0.16)] bg-[color:rgba(124,58,237,0.08)] text-[color:#5B21B6]",
  },
  ready_for_review: {
    label: "Ready for review",
    className:
      "border-[color:rgba(11,16,32,0.12)] bg-[color:rgba(11,16,32,0.05)] text-[color:var(--foreground)]",
  },
};

function SectionIntro({
  label,
  title,
  description,
  className = "",
}: {
  label: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <span className="section-label">{label}</span>
      <h2 className="mt-4 max-w-3xl text-[clamp(2rem,8vw,3.6rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-[color:var(--foreground)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-[color:var(--muted-strong)] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const badge = encounterStatus[status] ?? {
    label: status,
    className:
      "border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--muted-strong)]",
  };

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[-0.01em] ${badge.className}`}>
      {badge.label}
    </span>
  );
}

export function HomepageLanding() {
  const niches = Object.values(nicheConfigs)
    .map((config) => config.label)
    .slice(0, 6);

  const readyForReviewCount = proofCases.filter((item) => item.status === "ready_for_review").length;
  const completedIntakeCount = proofCases.filter((item) => item.status !== "link_sent").length;

  return (
    <div className="overflow-x-hidden pt-[4.5rem]">
      <section className="mx-auto max-w-[1280px] px-5 pb-20 pt-10 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-8">
            <div className="mb-6 flex items-center gap-3">
              <PetalAccent className="h-9 w-9 text-[color:var(--primary)]" />
              <span className="section-label">{BRAND.tagline}</span>
            </div>

            <h1 className="max-w-[11ch] text-[clamp(2.65rem,11vw,5.75rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-[color:var(--foreground)]">
              Reduce intake chaos before the appointment even begins.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted-strong)] sm:mt-7 sm:text-lg">
              CliniqFlow helps clinics collect structured patient intake, reduce repetitive
              discovery conversations, and streamline practitioner documentation workflows.
            </p>

            <div className="mt-7 grid gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3">
              {heroPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-4 py-3.5 text-sm leading-6 text-[color:var(--muted-strong)] sm:py-4"
                >
                  <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <a href="#product" className="btn-primary">
                View product demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#workflow" className="btn-secondary">
                See workflow
              </a>
            </div>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-[color:var(--muted)]">
              Built for clinics that want a calmer pre-visit operating layer, not another
              template-like AI landing page translated into software.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="surface-panel overflow-hidden rounded-[2rem] border-[color:var(--line-strong)]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--line)] px-5 py-4 lg:px-6">
                <div>
                  <p className="section-label">Operational overview</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[color:var(--foreground)]">
                    Before the first appointment, the workflow is already organized.
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--muted-strong)]">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                  Live operational view
                </div>
              </div>

              <div className="grid gap-px bg-[color:var(--line)] md:grid-cols-3">
                {[
                  { value: "~5.2 min", label: "Physician discovery time saved" },
                  { value: `${completedIntakeCount}/${proofCases.length}`, label: "Patients with intake completed" },
                  { value: `${readyForReviewCount}`, label: "Encounters ready for practitioner review" },
                ].map((item) => (
                  <div key={item.label} className="bg-[color:var(--surface-raised)] px-5 py-4 lg:px-6">
                    <p className="text-xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1.2fr)_320px]">
                <div className="border-b border-[color:var(--line)] lg:border-b-0 lg:border-r">
                  <div className="relative h-[280px] bg-[color:var(--surface-muted)] sm:h-[320px] md:h-[430px]">
                    <Image
                      src="/screenshots/dashboard-proof.png"
                      alt="CliniqFlow dashboard showing queue, SOAP review, and structured patient context."
                      fill
                      priority
                      className="object-contain object-left-top p-3 sm:p-4 lg:object-cover lg:p-0"
                    />
                  </div>
                </div>

                <div className="grid">
                  <div className="border-b border-[color:var(--line)] px-5 py-5 lg:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                        Intake progression
                      </p>
                      <p className="text-xs text-[color:var(--muted)]">Sanitized sample data</p>
                    </div>

                    <div className="mt-4 space-y-3">
                      {proofCases.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                                {item.patient.first_name} {item.patient.last_name}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[color:var(--muted-strong)]">
                                {item.chief_complaint}
                              </p>
                            </div>
                            <StatusBadge status={item.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-px bg-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <div className="bg-[color:var(--surface-raised)] px-5 py-5 lg:px-6">
                      <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                        SOAP draft workflow
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-[0.14em] text-[color:var(--muted)]">
                        {proofEncounter.soap?.review_status ?? "draft"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">
                        Draft note remains editable and review-first until a practitioner approves it.
                      </p>
                    </div>

                    <div className="bg-[color:var(--surface-raised)] px-5 py-5 lg:px-6">
                      <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                        Structured insights
                      </p>
                      <div className="mt-3 space-y-2">
                        {proofEncounter.patterns.slice(0, 2).map((pattern) => (
                          <div key={pattern.pattern_key} className="text-sm leading-6 text-[color:var(--muted-strong)]">
                            <p className="font-medium text-[color:var(--foreground)]">
                              {pattern.pattern_key.replaceAll("_", " ")}
                            </p>
                            <p>{pattern.evidence[0]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
        <GradientRule />
      </div>

      <section id="workflow" className="scroll-mt-28 mx-auto max-w-[1280px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              label="Workflow"
              title="A calmer start to every appointment."
              description="CliniqFlow is designed around the hour before the visit: the patient communication, intake structure, practitioner review, and documentation setup that usually create the most friction."
            />

            <div className="mt-7 rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5 sm:mt-8 sm:p-6">
              <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                Specialty-specific workflows
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {niches.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[color:var(--charcoal)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-7 sm:space-y-8">
            {workflowMoments.map((item) => (
              <article
                key={item.step}
                className="grid gap-3 border-t border-[color:var(--line)] pt-7 md:grid-cols-[88px_minmax(0,1fr)] md:gap-8 md:pt-8"
              >
                <p className="section-label pt-1">{item.step}</p>
                <div>
                  <h3 className="max-w-3xl text-[1.45rem] font-semibold leading-[1.06] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-[1.65rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-[color:var(--muted-strong)] sm:mt-4 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

            <article className="surface-panel rounded-[2rem] border-[color:var(--line-strong)] p-6 sm:p-7 lg:p-8">
              <p className="section-label">Operational calmness</p>
              <h3 className="mt-4 max-w-2xl text-[1.55rem] font-semibold leading-[1.04] tracking-[-0.045em] text-[color:var(--foreground)] sm:text-[1.8rem]">
                The product is meant to make a practitioner feel less crowded before the day begins.
              </h3>
              <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-[color:var(--muted-strong)] sm:text-base">
                Every surface is organized around workflow state, review readiness, and cleaner
                documentation handoff. The goal is quiet operational relief, not performative AI.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="product" className="scroll-mt-28 border-y border-[color:var(--line)] bg-[color:var(--surface-muted)]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
          <SectionIntro
            label="Product demo"
            title="The product becomes the aesthetic."
            description="Real interface density, real workflow states, and real operational screens carry the design instead of decorative gradients or abstract AI motifs."
          />

          <div className="mt-12 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-12">
            <article className="surface-panel overflow-hidden rounded-[2rem] lg:col-span-8">
              <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
                <p className="section-label">Practitioner dashboard</p>
                <h3 className="text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-[1.55rem]">
                  Queue, review, and appointment preparation live in one operational surface.
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  Encounter status, SOAP review, appointment requests, and supporting evidence are
                  visible in one place so staff and practitioners can orient quickly.
                </p>
              </div>
              <div className="relative h-[260px] border-t border-[color:var(--line)] bg-[color:var(--surface)] sm:h-[320px] md:h-[540px]">
                <Image
                  src="/screenshots/dashboard-proof.png"
                  alt="CliniqFlow dashboard with operational intake and documentation workflow."
                  fill
                  className="object-contain object-left-top p-3 sm:p-4 lg:object-cover lg:p-0"
                />
              </div>
            </article>

            <article className="surface-panel overflow-hidden rounded-[2rem] lg:col-span-4">
              <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
                <p className="section-label">Patient communication</p>
                <h3 className="text-[1.25rem] font-semibold leading-[1.1] tracking-[-0.035em] text-[color:var(--foreground)] sm:text-[1.35rem]">
                  Intake becomes a structured conversation patients can complete before arriving.
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  Specialty-specific questionnaires, consent capture, and progress states create a
                  more organized handoff into the clinical visit.
                </p>
              </div>
              <div className="border-t border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-4 sm:px-5 sm:py-5">
                <div className="overflow-hidden rounded-[1.4rem] border border-[color:var(--line)]">
                  <Image
                    src="/screenshots/intake-proof.png"
                    alt="CliniqFlow patient intake flow with specialty-specific questions."
                    width={1024}
                    height={980}
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-[color:rgba(11,16,32,0.12)] bg-[color:var(--charcoal)] text-white lg:col-span-4">
              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-white/80" />
                  <p className="section-label text-white/55">Clinical control</p>
                </div>
                <h3 className="mt-4 text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[1.55rem]">
                  Documentation stays in practitioner review, not autopilot.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/72">
                  CliniqFlow helps structure history, surface assessment patterns, and prepare draft
                  notes, but it does not replace clinical judgment or silently finalize the record.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "SOAP notes start in draft status",
                    "Evidence and data gaps stay visible",
                    "Approval remains with the practitioner",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-6 text-white/80">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/75" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="surface-panel overflow-hidden rounded-[2rem] lg:col-span-8">
              <div className="space-y-3 px-5 py-5 sm:px-6 sm:py-6">
                <p className="section-label">Encounter review</p>
                <h3 className="text-[1.35rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[color:var(--foreground)] sm:text-[1.55rem]">
                  Review-first SOAP drafting keeps the workflow clear and trustworthy.
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  Practitioners can review structured subjective, objective, assessment, and plan
                  sections in the same screen where the patient context first became useful.
                </p>
              </div>
              <div className="relative h-[260px] border-t border-[color:var(--line)] bg-[color:var(--surface)] sm:h-[320px] md:h-[520px]">
                <Image
                  src="/screenshots/encounter-proof.png"
                  alt="CliniqFlow encounter review screen with practitioner-first SOAP editing."
                  fill
                  className="object-contain object-left-top p-3 sm:p-4 lg:object-cover lg:p-0"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="why-cliniqflow" className="scroll-mt-28 mx-auto max-w-[1280px] px-5 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionIntro
            label="Why it helps"
            title="What the clinic gets back is focus."
            description="The primary value is not novelty. It is reducing friction in the parts of the day that usually feel fragmented, repetitive, or mentally expensive."
          />

          <div className="space-y-6 sm:space-y-7">
            {calmOutcomes.map((item) => (
              <article
                key={item.title}
                className="grid gap-3 border-t border-[color:var(--line)] pt-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 md:pt-7"
              >
                <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                  {item.title}
                </p>
                <p className="max-w-2xl text-[0.98rem] leading-relaxed text-[color:var(--muted-strong)] sm:text-base">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 mx-auto max-w-[1280px] px-5 pb-20 sm:px-6 lg:px-10 lg:pb-24">
        <SectionIntro label="FAQ" title="Common questions" />

        <div className="mt-10 max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 py-5"
            >
              <summary className="cursor-pointer text-base font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-strong)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="overflow-hidden rounded-[2.25rem] border border-[color:rgba(11,16,32,0.12)] bg-[color:var(--charcoal)] px-6 py-8 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="section-label text-white/55">Calm clinical operating system</p>
                <h2 className="mt-4 max-w-3xl text-[clamp(2rem,8vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
                  Reduce chaos before the appointment begins.
                </h2>
                <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-white/72 sm:text-base">
                  See the workflow, review the product, and decide whether it fits how your clinic
                  wants intake and documentation to feel.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={BRAND.signupHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--primary)] transition hover:bg-white/94"
                >
                  Start onboarding
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#product"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View product demo
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <GradientRule />
          </div>
        </div>
      </section>
    </div>
  );
}
