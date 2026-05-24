"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Brain,
  Building2,
  ClipboardList,
  FileText,
  Layers,
  Link2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { nicheConfigs } from "@/lib/clinics/niche-configs";
import { BRAND } from "@/lib/brand/site";

const revealContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const trustSignals = [
  { label: "Structured workflows", icon: Layers },
  { label: "Quietly intelligent documentation", icon: Sparkles },
  { label: "Practitioner review first", icon: ShieldCheck },
];

const problems = [
  {
    title: "Unstructured patient intake",
    description:
      "Patients submit fragmented information across forms, emails, and phone calls — making it difficult to prepare effectively before appointments.",
  },
  {
    title: "Administrative overload",
    description:
      "Staff spend valuable time collecting intake details, organizing responses, and preparing documentation instead of focusing on patient experience.",
  },
  {
    title: "Inconsistent clinical documentation",
    description:
      "Turning intake answers into structured SOAP notes is repetitive and time-consuming for practitioners.",
  },
  {
    title: "Lack of workflow standardization",
    description:
      "Different practitioners and clinic types require different intake logic, workflows, and documentation styles.",
  },
];

const howItWorks = [
  {
    title: "Create a patient intake flow",
    description:
      "Clinic staff generate a secure intake link customized for their clinic type and workflow.",
    detail:
      "Supported clinic types include functional medicine, chiropractic, aesthetics, integrative wellness, and general outpatient practices.",
  },
  {
    title: "Patients complete structured intake",
    description:
      "Patients complete a guided questionnaire before their visit — especially helpful for sensitive symptoms they may prefer to share in writing first.",
    detail:
      "Responses are organized into chief complaints, symptoms, lifestyle factors, goals, relevant history, and risk indicators.",
  },
  {
    title: "AI-assisted SOAP draft generation",
    description:
      "The platform analyzes intake responses using configurable scoring logic and generates a practitioner-review-first SOAP draft.",
    detail:
      "Practitioners review, edit, and finalize documentation before use.",
  },
];

const features = [
  {
    title: "Configurable intake workflows",
    description:
      "Create intake experiences tailored to your clinic specialty and operational process.",
    bullets: [
      "Dynamic questionnaires",
      "Multi-step workflows",
      "Specialty-specific logic",
      "Flexible intake structures",
    ],
    icon: ClipboardList,
    tint: "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
  },
  {
    title: "AI-assisted SOAP drafting",
    description:
      "Generate structured SOAP drafts from intake responses with conservative clinical language and practitioner oversight.",
    bullets: [
      "Subjective summaries",
      "Structured assessments",
      "Review-first workflows",
      "Manual practitioner approval",
    ],
    icon: FileText,
    tint: "bg-[color:var(--accent-soft)]/20 text-[color:var(--primary)]",
  },
  {
    title: "Rule-based clinical pattern scoring",
    description:
      "Deterministic scoring systems help organize patient-reported symptoms into clinically relevant patterns.",
    bullets: [
      "Pattern scoring",
      "Evidence summaries",
      "Confidence indicators",
      "Risk-level tagging",
    ],
    icon: Brain,
    tint: "bg-[rgba(80,98,97,0.08)] text-[color:var(--muted-strong)]",
  },
  {
    title: "Multi-clinic configuration support",
    description:
      "Support different workflows and intake structures across clinics and specialties.",
    bullets: [
      "Clinic-specific configurations",
      "Custom templates",
      "Specialty customization",
      "Workflow flexibility",
    ],
    icon: Building2,
    tint: "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
  },
  {
    title: "Practitioner dashboard",
    description:
      "Review patient intakes, assessments, and SOAP drafts from a centralized dashboard.",
    bullets: [
      "Encounter management",
      "Intake review",
      "SOAP editing",
      "Workflow tracking",
    ],
    icon: Stethoscope,
    tint: "bg-[color:var(--primary)]/8 text-[color:var(--primary)]",
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
    description: "For smaller practices beginning to digitize intake workflows.",
    features: [
      "Intake workflows",
      "Patient links",
      "Basic SOAP drafting",
      "1 clinic workspace",
    ],
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
      "AI-assisted SOAP drafting",
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
    description: "For larger clinics and multi-location practices.",
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
      "No. CliniqFlow is designed as an intake and documentation workflow platform, not a full electronic health record system.",
  },
  {
    question: "Does the AI diagnose patients?",
    answer:
      "No. The platform assists with intake organization and SOAP drafting only. Practitioners remain fully responsible for clinical decisions.",
  },
  {
    question: "Can workflows be customized?",
    answer:
      "Yes. Intake forms and SOAP structures can be configured for different clinic types and specialties.",
  },
  {
    question: "Is practitioner review required?",
    answer:
      "Yes. All AI-generated documentation should be reviewed and approved by a licensed practitioner.",
  },
  {
    question: "Does CliniqFlow support multiple clinics?",
    answer:
      "Yes. The platform architecture supports multi-clinic and multi-tenant workflows.",
  },
];

export function HomepageLanding() {
  const niches = Object.entries(nicheConfigs).map(([niche, config]) => ({
    niche,
    label: config.label,
  }));

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={revealContainer}
      className="overflow-x-hidden pt-24"
    >
      {/* Hero */}
      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:items-center xl:px-10">
        <motion.div variants={revealItem} className="relative z-10 space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--muted-strong)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            {BRAND.tagline}
          </div>

          <p className="text-sm font-semibold text-[color:var(--primary)]">
            {BRAND.bigIdea}
          </p>

          <h1 className="display-font max-w-5xl text-[clamp(2.4rem,4.8vw,3.75rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-[color:var(--foreground)]">
            {BRAND.hero.headline}
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-strong)]">
            {BRAND.hero.subheadline}
          </p>

          <p className="max-w-2xl text-base leading-8 text-[color:var(--foreground)]">
            {BRAND.hero.emotional}
          </p>

          <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            {BRAND.hero.functional}
          </p>

          <motion.div variants={revealItem} className="flex flex-wrap gap-3 pt-2">
            <a
              href={BRAND.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="ambient-shadow inline-flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-[color:var(--accent)]/90"
            >
              Book demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-8 py-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        <motion.div variants={revealItem} className="relative lg:col-span-5">
          <motion.div className="relative z-10 rounded-2xl border border-[color:var(--line)] bg-white p-5 shadow-[0_24px_64px_rgba(30,58,95,0.1)]">
            <div className="grid gap-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4">
              <div className="flex items-center justify-between border-b border-[color:var(--line)] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Workflow preview
                </span>
                <BadgeCheck className="h-4 w-4 text-[color:var(--accent)]" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Secure intake link
                  </p>
                  <motion.div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      Pre-visit questionnaire
                    </p>
                  </motion.div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Structured summary
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)]/25 text-[color:var(--primary)]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      SOAP draft for review
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  Practitioner review first
                </span>
                <p className="mt-3 text-base leading-relaxed text-[color:var(--muted-strong)]">
                  AI-assisted draft — edit, approve, and finalize before clinical use.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trust / niches */}
      <section className="border-y border-[color:var(--line)]/60 bg-white/72 py-12 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 xl:px-10">
          <div className="mb-8 flex flex-wrap justify-center gap-6">
            {trustSignals.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-sm font-semibold text-[color:var(--muted-strong)]"
              >
                <item.icon className="h-4 w-4 text-[color:var(--accent)]" />
                {item.label}
              </div>
            ))}
          </div>
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
            Built for western & alternative medicine specialties
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {niches.map((niche) => (
              <span
                key={niche.niche}
                className="rounded-full border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--foreground)]"
              >
                {niche.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning pillars */}
      <section className="mx-auto max-w-7xl px-6 py-16 xl:px-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {BRAND.pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-[color:var(--line)] bg-white p-6"
            >
              <h3 className="text-sm font-semibold text-[color:var(--primary)]">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section id="solutions" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24 xl:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
            The challenge
          </span>
          <h2 className="display-font mt-4 text-[clamp(2.2rem,4vw,3.5rem)] leading-[1.08] font-[650] text-[color:var(--foreground)]">
            Intake and documentation shouldn&apos;t consume the entire appointment
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {problems.map((problem) => (
            <motion.div
              key={problem.title}
              variants={revealItem}
              className="ambient-shadow rounded-[1.75rem] border border-[color:var(--line)] bg-white/76 p-8"
            >
              <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                {problem.title}
              </h3>
              <p className="mt-3 leading-7 text-[color:var(--muted-strong)]">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-[1.75rem] border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 p-8 text-center">
          <p className="leading-8 text-[color:var(--muted-strong)]">
            CliniqFlow was designed to streamline intake, improve documentation workflows,
            and help clinics operate more efficiently.
          </p>
          <p className="mt-4 leading-8 text-[color:var(--muted-strong)]">
            On average, clinics can save approximately{" "}
            <strong className="text-[color:var(--foreground)]">5.2 minutes</strong> of
            physician discovery time per patient encounter by collecting structured intake
            information before the consultation begins.
          </p>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            The platform also helps reduce administrative fatigue by allowing practitioners
            to begin appointments with organized patient context instead of fragmented
            intake conversations.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-28 bg-[color:var(--primary)] py-24 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 xl:px-10">
          <div className="mb-16 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
              How it works
            </span>
            <h2 className="display-font mt-4 text-[clamp(2.2rem,4vw,3.5rem)] font-[650]">
              How CliniqFlow works
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                variants={revealItem}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
                  Step 0{index + 1}
                </span>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-white/78">{step.description}</p>
                <p className="mt-4 text-sm leading-7 text-white/60">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24 xl:px-10"
      >
        <motion.div variants={revealItem} className="mb-16 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
            Core features
          </span>
          <h2 className="display-font mt-4 text-[clamp(2.2rem,4vw,3.5rem)] font-[650] text-[color:var(--foreground)]">
            Built for modern clinical workflows
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={revealItem}
              className="ambient-shadow rounded-[1.75rem] border border-[color:var(--line)] bg-white/76 p-8 lg:last:col-span-1"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.tint}`}
              >
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-[color:var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-3 leading-7 text-[color:var(--muted-strong)]">
                {feature.description}
              </p>
              <ul className="mt-4 space-y-2">
                {feature.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-[color:var(--muted-strong)]"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Who it's for + compliance */}
      <section className="bg-white/70 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 xl:px-10">
          <motion.div variants={revealItem}>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
              Who it&apos;s for
            </span>
            <h2 className="display-font mt-4 text-[clamp(2rem,3.5vw,2.8rem)] font-[650] text-[color:var(--foreground)]">
              Built for modern outpatient practices
            </h2>
            <ul className="mt-8 space-y-3">
              {idealFor.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[color:var(--muted-strong)]"
                >
                  <Users className="h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={revealItem}
            className="rounded-[1.75rem] border border-[color:var(--line)] bg-white p-8"
          >
            <div className="flex items-center gap-2 text-[color:var(--accent)]">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
                Practitioner review required
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[color:var(--foreground)]">
              Documentation-assist, not autonomous clinical AI
            </h3>
            <p className="mt-4 leading-7 text-[color:var(--muted-strong)]">
              CliniqFlow is designed as a documentation-assist and workflow platform.
              The system does not diagnose patients, prescribe treatment, replace
              practitioner judgment, or operate as an autonomous clinical system.
            </p>
            <p className="mt-4 text-sm font-semibold text-[color:var(--foreground)]">
              All outputs require practitioner review and approval.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24 xl:px-10">
        <div className="mb-14 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
            Pricing
          </span>
          <h2 className="display-font mt-4 text-[clamp(2.2rem,4vw,3.5rem)] font-[650] text-[color:var(--foreground)]">
            Simple clinic pricing
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={revealItem}
              className={`rounded-[1.75rem] border p-8 ${
                plan.highlighted
                  ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white shadow-[0_30px_80px_rgba(14,124,123,0.2)]"
                  : "border-[color:var(--line)] bg-white/76"
              }`}
            >
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-4">
                <span className="display-font text-4xl font-bold">{plan.price}</span>
                <span className={plan.highlighted ? "text-white/80" : "text-[color:var(--muted)]"}>
                  {plan.period}
                </span>
              </p>
              <p
                className={`mt-3 text-sm leading-6 ${plan.highlighted ? "text-white/82" : "text-[color:var(--muted-strong)]"}`}
              >
                {plan.description}
              </p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-center gap-2 text-sm ${plan.highlighted ? "text-white/90" : "text-[color:var(--muted-strong)]"}`}
                  >
                    <BadgeCheck className="h-4 w-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.external ? (
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-white text-[color:var(--accent)]"
                      : "bg-[color:var(--foreground)] text-white"
                  }`}
                >
                  {plan.cta}
                </a>
              ) : (
                <Link
                  href={plan.href}
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-white text-[color:var(--accent)]"
                      : "bg-[color:var(--accent)] text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-6 pb-24 xl:px-10">
        <div className="mb-12 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
            FAQ
          </span>
          <h2 className="display-font mt-4 text-[clamp(2rem,3.5vw,2.8rem)] font-[650] text-[color:var(--foreground)]">
            Frequently asked questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-[color:var(--line)] bg-white/76 p-6"
            >
              <summary className="cursor-pointer list-none font-semibold text-[color:var(--foreground)] marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-4 leading-7 text-[color:var(--muted-strong)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-24 xl:px-10">
        <motion.div
          variants={revealItem}
          className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--accent)] px-8 py-14 sm:px-10 lg:px-14"
        >
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="display-font text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.06] text-white">
              {BRAND.bigIdea}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/85">
              {BRAND.narrative}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={BRAND.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-[color:var(--accent)] transition hover:scale-[1.03]"
              >
                Book a demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={BRAND.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Talk to sales
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
