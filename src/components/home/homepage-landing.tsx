"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ClipboardList,
  FileText,
  Layers,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { nicheConfigs } from "@/lib/clinics/niche-configs";
import { BRAND } from "@/lib/brand/site";
import { GradientRule, PetalAccent } from "@/components/home/petal-accent";
import {
  EncounterRowPreview,
  HeroWorkflowPreview,
  IntakeLinkPreview,
  SoapDraftPreview,
  WorkflowMetricsStrip,
} from "@/components/home/workflow-previews";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const problems = [
  {
    title: "Unstructured patient intake",
    description:
      "Fragmented forms, emails, and phone notes make it hard to prepare before appointments.",
  },
  {
    title: "Administrative overload",
    description:
      "Staff chase details instead of focusing on patient experience and clinic operations.",
  },
  {
    title: "Repetitive documentation",
    description:
      "Turning intake answers into structured SOAP notes consumes practitioner time every visit.",
  },
  {
    title: "Inconsistent workflows",
    description:
      "Every specialty needs different intake logic — but most tools force one generic template.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Configure intake for your clinic",
    description:
      "Generate secure intake links with specialty-specific questionnaires and workflow rules.",
    preview: "intake" as const,
  },
  {
    step: "02",
    title: "Patients complete structured intake",
    description:
      "Guided pre-visit questionnaires organize complaints, history, lifestyle, and goals before the visit.",
    preview: "encounters" as const,
  },
  {
    step: "03",
    title: "Review organized context & SOAP drafts",
    description:
      "Practitioners receive structured summaries and review-first documentation drafts — never auto-finalized.",
    preview: "soap" as const,
  },
];

const features = [
  {
    title: "Configurable intake workflows",
    description: "Dynamic questionnaires and multi-step flows tailored to your specialty.",
    icon: ClipboardList,
  },
  {
    title: "Practitioner dashboard",
    description: "Encounter queue, intake review, and workflow tracking in one operational view.",
    icon: Stethoscope,
  },
  {
    title: "SOAP drafting with review gates",
    description: "Structured drafts from intake data — edit, approve, and finalize before clinical use.",
    icon: FileText,
  },
  {
    title: "Pattern scoring & evidence summaries",
    description: "Deterministic scoring organizes patient-reported symptoms into reviewable patterns.",
    icon: Layers,
  },
  {
    title: "Multi-clinic configuration",
    description: "Different templates and workflows across locations, specialties, and tenant workspaces.",
    icon: Building2,
  },
];

const idealFor = [
  "Functional medicine clinics",
  "Chiropractic practices",
  "Integrative wellness clinics",
  "Aesthetic clinics",
  "Preventive care providers",
  "Concierge health practices",
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$399",
    period: "/month",
    description: "For smaller practices digitizing intake workflows.",
    features: ["Intake workflows", "Patient links", "Basic SOAP drafting", "1 clinic workspace"],
    cta: "Start trial",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$449",
    period: "/month",
    description: "For growing clinics needing operational efficiency.",
    features: [
      "Multi-user access",
      "Advanced workflows",
      "SOAP drafting",
      "Pattern scoring",
    ],
    cta: "Start trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    period: " pricing",
    description: "For multi-location practices and advanced customization.",
    features: [
      "Multi-location support",
      "Advanced customization",
      "Dedicated onboarding",
      "Priority support",
    ],
    cta: "Talk to sales",
    href: BRAND.demoUrl,
    highlighted: false,
    external: true,
  },
];

const faqs = [
  {
    question: "Is CliniqFlow an EHR?",
    answer:
      "No. CliniqFlow is an intake and documentation workflow platform — not a full electronic health record.",
  },
  {
    question: "Does the system diagnose patients?",
    answer:
      "No. It organizes intake and assists with documentation. Licensed practitioners remain fully responsible for clinical decisions.",
  },
  {
    question: "Can workflows be customized?",
    answer: "Yes. Intake forms and SOAP structures can be configured per clinic type and specialty.",
  },
  {
    question: "Is practitioner review required?",
    answer: "Yes. All generated documentation requires practitioner review and approval before clinical use.",
  },
  {
    question: "Does CliniqFlow support multiple clinics?",
    answer: "Yes. The platform supports multi-clinic and multi-tenant workflows.",
  },
];

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
      <h2 className="display-font mt-4 text-[clamp(2rem,3.2vw,3rem)] leading-[1.08] text-[color:var(--foreground)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-[color:var(--muted-strong)]">{description}</p>
      ) : null}
    </div>
  );
}

export function HomepageLanding() {
  const niches = Object.entries(nicheConfigs).map(([niche, config]) => ({
    niche,
    label: config.label,
  }));

  return (
    <div className="overflow-x-hidden pt-[4.5rem]">
      {/* Hero — asymmetric, product-first */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:px-10 lg:pt-16">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="lg:col-span-5 lg:pt-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <PetalAccent className="h-8 w-8 text-[color:var(--primary)]" />
              <span className="section-label">{BRAND.tagline}</span>
            </div>

            <h1 className="display-font text-[clamp(2.35rem,4.5vw,3.65rem)] leading-[1.04] text-[color:var(--foreground)]">
              {BRAND.hero.headline}
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-[color:var(--muted-strong)]">
              {BRAND.hero.subheadline}
            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
              {BRAND.hero.emotional}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={BRAND.demoUrl} target="_blank" rel="noreferrer" className="btn-primary">
                Book demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#how-it-works" className="btn-secondary">
                See the workflow
              </a>
            </div>

            <div className="mt-12 hidden max-w-sm border-l-2 border-[color:var(--line-strong)] pl-5 lg:block">
              <p className="text-sm leading-relaxed text-[color:var(--muted-strong)]">
                {BRAND.hero.functional}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ delay: 0.08 }}
            className="lg:col-span-7"
          >
            <HeroWorkflowPreview />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <GradientRule />
      </div>

      {/* Operational metrics + specialties */}
      <section className="mx-auto max-w-[1200px] px-6 py-14 lg:px-10">
        <WorkflowMetricsStrip />

        <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-lg">
            <p className="section-label">Specialties</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-strong)]">
              Built for western and alternative medicine practices that need structured intake — not
              generic form builders.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
            {niches.map((niche) => (
              <span
                key={niche.niche}
                className="rounded-md border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[color:var(--charcoal)]"
              >
                {niche.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Problem — left-aligned tension */}
      <section id="solutions" className="scroll-mt-28 border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]/40">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 lg:grid-cols-12 lg:px-10">
          <SectionIntro
            className="lg:col-span-5"
            label="The challenge"
            title="Intake and documentation shouldn't consume the entire appointment"
            description="Most clinics lose operational clarity before the patient walks in. CliniqFlow brings structure to the pre-visit layer."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {problems.map((problem, i) => (
              <div
                key={problem.title}
                className={`surface-panel rounded-lg p-6 ${i === 1 ? "sm:mt-6" : ""} ${i === 2 ? "sm:-mt-2" : ""}`}
              >
                <h3 className="text-base font-semibold text-[color:var(--foreground)]">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] px-6 pb-20 lg:px-10">
          <div className="grid gap-8 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="text-base leading-relaxed text-[color:var(--muted-strong)]">
              On average, clinics save approximately{" "}
              <strong className="font-semibold text-[color:var(--foreground)]">5.2 minutes</strong>{" "}
              of physician discovery time per encounter when structured intake is collected before
              the consultation.
            </p>
            <PetalAccent className="mx-auto h-10 w-10 text-[color:var(--primary)] opacity-40 lg:mx-0" />
          </div>
        </div>
      </section>

      {/* How it works — alternating workflow visuals */}
      <section id="how-it-works" className="scroll-mt-28 mx-auto max-w-[1200px] px-6 py-24 lg:px-10">
        <SectionIntro
          label="How it works"
          title="Three operational layers — from link to review"
          description="The product is the aesthetic. Every step maps to a real screen in the practitioner workflow."
        />

        <div className="mt-16 space-y-20">
          {howItWorks.map((step, index) => (
            <div
              key={step.step}
              className={`grid items-center gap-10 lg:grid-cols-12 ${
                index % 2 === 1 ? "lg:[direction:rtl]" : ""
              }`}
            >
              <div className={`lg:col-span-5 ${index % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                <span className="font-mono text-xs tracking-[0.16em] text-[color:var(--muted)]">
                  {step.step}
                </span>
                <h3 className="display-font mt-3 text-2xl text-[color:var(--foreground)]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  {step.description}
                </p>
              </div>
              <div className={`lg:col-span-7 ${index % 2 === 1 ? "lg:[direction:ltr]" : ""}`}>
                {step.preview === "intake" && <IntakeLinkPreview />}
                {step.preview === "encounters" && <EncounterRowPreview />}
                {step.preview === "soap" && <SoapDraftPreview />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product depth — bento */}
      <section id="features" className="scroll-mt-28 border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]/30">
        <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10">
          <SectionIntro
            label="Platform"
            title="Operational depth, not marketing fluff"
            description="Every feature maps to a workflow your front desk and practitioners actually run."
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-12">
            <div className="surface-panel overflow-hidden rounded-lg lg:col-span-7 lg:row-span-2">
              <div className="border-b border-[color:var(--line)] px-5 py-4">
                <p className="section-label">Encounter queue</p>
                <p className="mt-1 text-sm text-[color:var(--muted-strong)]">
                  Today&apos;s patients, statuses, and next actions — at a glance.
                </p>
              </div>
              <div className="p-4">
                <EncounterRowPreview />
              </div>
            </div>

            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`surface-panel rounded-lg p-5 lg:col-span-5 ${i === 0 ? "" : ""}`}
              >
                <feature.icon className="h-5 w-5 text-[color:var(--primary)]" strokeWidth={1.5} />
                <h3 className="mt-4 text-base font-semibold text-[color:var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for + compliance */}
      <section className="mx-auto grid max-w-[1200px] gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <SectionIntro
            label="Who it's for"
            title="Built for modern outpatient practices"
          />
          <ul className="mt-8 space-y-3">
            {idealFor.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[color:var(--muted-strong)]">
                <Users className="h-4 w-4 shrink-0 text-[color:var(--primary)]" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="surface-panel rounded-lg p-8 lg:col-span-7">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[color:var(--primary)]" strokeWidth={1.5} />
            <span className="section-label">Practitioner review required</span>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-[color:var(--foreground)]">
            Documentation-assist — not autonomous clinical software
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted-strong)]">
            CliniqFlow does not diagnose patients, prescribe treatment, or replace practitioner
            judgment. All outputs require licensed practitioner review and approval before clinical
            use.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-28 border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10">
          <SectionIntro label="Pricing" title="Simple clinic pricing" />

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-8 ${
                  plan.highlighted
                    ? "border-[color:var(--primary)] bg-[color:var(--surface-raised)] shadow-[var(--shadow)]"
                    : "border-[color:var(--line)] bg-[color:var(--surface-muted)]/50"
                }`}
              >
                {plan.highlighted ? (
                  <span className="section-label text-[color:var(--primary)]">Recommended</span>
                ) : null}
                <h3 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{plan.name}</h3>
                <p className="mt-3">
                  <span className="display-font text-4xl">{plan.price}</span>
                  <span className="text-sm text-[color:var(--muted)]">{plan.period}</span>
                </p>
                <p className="mt-3 text-sm text-[color:var(--muted-strong)]">{plan.description}</p>
                <ul className="mt-6 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-[color:var(--muted-strong)]">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.external ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-semibold ${
                      plan.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-semibold ${
                      plan.highlighted ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-28 mx-auto max-w-[1200px] px-6 pb-24 lg:px-10">
        <SectionIntro label="FAQ" title="Common questions" />
        <div className="mt-10 max-w-2xl space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 py-4"
            >
              <summary className="cursor-pointer font-medium text-[color:var(--foreground)]">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA — calm, not loud */}
      <section id="contact" className="scroll-mt-28 border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-[1200px] px-6 py-20 lg:px-10">
          <div className="grid gap-8 rounded-lg border border-[color:var(--line)] bg-[color:var(--primary)] px-8 py-12 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:px-12">
            <div>
              <h2 className="display-font text-[clamp(1.75rem,3vw,2.5rem)] leading-tight">
                {BRAND.bigIdea}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">{BRAND.narrative}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={BRAND.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[color:var(--primary)] transition hover:bg-white/95"
              >
                Book a demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={BRAND.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Talk to sales
              </a>
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
