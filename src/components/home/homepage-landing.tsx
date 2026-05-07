"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  FileText,
  HeartPulse,
  Link2,
  Orbit,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const revealContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const trustSignals = [
  { label: "St. Jude Care", icon: Activity },
  { label: "HeartPeak Clinic", icon: HeartPulse },
  { label: "MindState Group", icon: Orbit },
  { label: "Nova Imaging", icon: BadgeCheck },
  { label: "JointFlex Ortho", icon: ShieldCheck },
];

const features = [
  {
    title: "Custom clinic logic",
    description:
      "The intake mirrors how your consultations actually run instead of forcing a generic template onto your process.",
    icon: Orbit,
    tint: "bg-[color:var(--accent)]/10 text-[color:var(--accent)]",
    offsetClass: "",
  },
  {
    title: "Pre-visit completion",
    description:
      "Patients complete intake before the appointment so your first minutes stay clinical, not administrative.",
    icon: CalendarClock,
    tint: "bg-[rgba(159,63,53,0.08)] text-[color:var(--danger)]",
    offsetClass: "md:translate-y-8",
  },
  {
    title: "Review-first output",
    description:
      "Practitioners begin with a readable summary and structured context instead of raw field-by-field answers.",
    icon: FileText,
    tint: "bg-[rgba(80,98,97,0.08)] text-[color:var(--muted-strong)]",
    offsetClass: "",
  },
];

const workflow = [
  {
    title: "Create Patient",
    description: "Quick profile creation from the practitioner dashboard.",
  },
  {
    title: "Send Intake Link",
    description: "A private route shared by email, text, or booking workflow.",
  },
  {
    title: "Collect Answers",
    description: "Structured intake logic guides the patient through the right prompts.",
  },
  {
    title: "Review Output",
    description: "Open a practitioner-ready summary before the consultation begins.",
  },
];

const practitionerBullets = [
  "SOAP-ready summary blocks for easier note transfer",
  "Reason-for-visit framing instead of disconnected question fields",
];

export function HomepageLanding() {
  const marqueeItems = [...trustSignals, ...trustSignals];

  return (
    <div className="overflow-x-hidden pt-24">
      <motion.section
        initial="hidden"
        animate="show"
        variants={revealContainer}
        className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:items-center xl:px-10"
      >
        <motion.div variants={revealItem} className="relative z-10 space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            Intake Redefined
          </div>

          <h1 className="display-font max-w-5xl text-[clamp(3.8rem,7vw,6.5rem)] leading-[0.98] font-[700] tracking-[-0.045em] text-[color:var(--foreground)]">
            Patient intake that <span className="text-[color:var(--accent)] italic">arrives structured</span> before you start.
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-[color:var(--muted-strong)]">
            Create the patient once. Send a private intake link. Review a calm,
            clinician-friendly summary instead of chasing forms and rebuilding
            context in the room.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/intake"
              className="ambient-shadow inline-flex items-center justify-center rounded-2xl bg-[color:var(--accent)] px-8 py-4 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-[color:var(--accent)]/90"
            >
              View Patient Experience
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-8 py-4 text-sm font-semibold text-[color:var(--foreground)] transition hover:bg-white"
            >
              Open Practitioner View
            </Link>
          </div>
        </motion.div>

        <motion.div variants={revealItem} className="relative lg:col-span-5">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[color:var(--accent)]/10 blur-[100px]" />
          <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-[rgba(139,75,41,0.1)] blur-[80px]" />

          <div className="floating-soft relative z-10 rounded-[1.75rem] border border-white/40 bg-white/72 p-5 shadow-[0_30px_90px_rgba(27,44,52,0.16)] backdrop-blur-xl">
            <div className="grid gap-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4">
              <div className="flex items-center justify-between border-b border-[color:var(--line)] pb-3">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[rgba(159,63,53,0.18)]" />
                  <span className="h-3 w-3 rounded-full bg-[color:var(--accent)]/20" />
                  <span className="h-3 w-3 rounded-full bg-[rgba(139,75,41,0.18)]" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Intake Preview
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Patient Route
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--accent)]/10 text-[color:var(--accent)]">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">
                        Private intake link
                      </p>
                      <p className="text-xs text-[color:var(--muted-strong)]">
                        Generated for each patient record
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Structured Summary
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(139,75,41,0.1)] text-[rgba(139,75,41,1)]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">
                        Review-ready output
                      </p>
                      <p className="text-xs text-[color:var(--muted-strong)]">
                        Clearer handoff before the consult
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  Smart Summary
                </span>
                <p className="display-font mt-3 text-xl italic leading-relaxed text-[color:var(--foreground)]">
                  Patient presents with <span className="rounded bg-[color:var(--accent)]/10 px-1.5">persistent lower back pain</span> after a lifting incident three days ago, with no neurological red flags reported.
                </p>
              </div>

              <div className="flex justify-end">
                <div className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-xs font-semibold text-white">
                  Export to EHR
                </div>
              </div>
            </div>
          </div>

          <div className="ambient-shadow absolute -bottom-8 -right-3 z-20 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/72 p-3 backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--accent)] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="pr-3">
              <p className="text-xs font-semibold text-[color:var(--foreground)]">
                Live Sync
              </p>
              <p className="text-[11px] text-[color:var(--muted-strong)]">
                Structured data ready
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="overflow-hidden bg-white/72 py-10 backdrop-blur-sm">
        <div className="mx-auto mb-5 max-w-7xl px-6 text-center xl:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--muted)]/75">
            Trusted by forward-thinking clinical groups
          </p>
        </div>
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="logo-scroll flex min-w-max items-center gap-10 py-2">
            {marqueeItems.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex items-center gap-3 px-2 opacity-55 transition hover:opacity-100">
                <item.icon className="h-5 w-5 text-[color:var(--accent)]" />
                <span className="display-font text-xl font-bold text-[color:var(--foreground)]">
                  {item.label}
                </span>
                <span className="h-6 w-px bg-[color:var(--line)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.24 }}
        variants={revealContainer}
        className="relative py-24"
      >
        <div className="mx-auto max-w-7xl px-6 xl:px-10">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[color:var(--foreground)] px-6 py-10 shadow-[0_40px_110px_rgba(20,33,37,0.2)] sm:px-8 lg:px-12">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[color:var(--accent)]/14 to-transparent" />
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <motion.div variants={revealItem} className="relative z-10 space-y-6">
                <h2 className="display-font text-[clamp(2.7rem,4vw,4rem)] leading-[1.04] font-[650] text-white">
                  Experience the <span className="text-[color:var(--accent)] italic">practitioner review</span>.
                </h2>
                <p className="max-w-xl text-lg leading-8 text-white/72">
                  Stop hunting for details. The interface puts the most important
                  part of the workflow front and center: clinical reasoning with
                  cleaner context and faster review.
                </p>
                <div className="space-y-3 pt-2">
                  {practitionerBullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                    >
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                      <p className="text-sm leading-6 text-white/78">{bullet}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={revealItem} className="relative lg:-mr-24">
                <div className="relative z-10 rounded-[1.75rem] bg-white p-4 shadow-2xl transition duration-500 lg:rotate-[-2deg] hover:rotate-0">
                  <div className="border-b border-[color:var(--line)] px-2 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="h-3 w-3 rounded-full bg-[rgba(159,63,53,0.18)]" />
                        <span className="h-3 w-3 rounded-full bg-[color:var(--accent)]/18" />
                        <span className="h-3 w-3 rounded-full bg-[rgba(139,75,41,0.18)]" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        Practitioner Dashboard
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="h-9 w-1/3 rounded-xl bg-[color:var(--surface)]" />
                    <div className="grid grid-cols-2 gap-3">
                      {[0, 1].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-3"
                        >
                          <div className="h-2 w-1/2 rounded bg-[color:var(--line-strong)]" />
                          <div className="mt-3 h-2 w-full rounded bg-[color:var(--line)]" />
                          <div className="mt-2 h-2 w-4/5 rounded bg-[color:var(--line)]" />
                        </div>
                      ))}
                    </div>

                    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 p-5">
                      <div className="absolute right-4 top-4">
                        <BadgeCheck className="h-4 w-4 text-[color:var(--accent)]" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--accent)]">
                        Smart Summary
                      </span>
                      <p className="display-font mt-3 text-xl italic leading-relaxed text-[color:var(--foreground)]">
                        Patient presents with <span className="rounded bg-[color:var(--accent)]/12 px-1.5">persistent lower back pain</span> after a lifting incident three days ago. No neurological deficits noted.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <div className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-[11px] font-semibold text-white">
                        Export to EHR
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[rgba(139,75,41,0.2)] blur-3xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        id="features"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={revealContainer}
        className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24 xl:px-10"
      >
        <div className="mb-16 flex flex-col items-center text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
            Efficiency First
          </span>
          <h2 className="display-font mt-4 text-[clamp(2.5rem,4vw,4rem)] leading-[1.06] font-[650] text-[color:var(--foreground)]">
            Built for modern clinical rigor
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={revealItem}
              className={`ambient-shadow-hover rounded-[2rem] border border-[color:var(--line)] bg-white/76 p-8 ${feature.offsetClass}`}
            >
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.tint}`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="display-font mt-6 text-3xl font-[620] leading-tight text-[color:var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-4 leading-8 text-[color:var(--muted-strong)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section id="outcomes" className="relative scroll-mt-28 py-24">
        <div className="absolute left-0 top-0 w-full rotate-180 overflow-hidden leading-[0]">
          <svg
            className="relative block h-[80px] w-[calc(100%+1.3px)] fill-white/70"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>

        <div className="bg-white/70 pb-20 pt-24">
          <div className="mx-auto max-w-7xl px-6 xl:px-10">
            <div className="mb-16 text-center">
              <h2 className="display-font text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.08] font-[650] text-[color:var(--foreground)]">
                Measured outcomes for clinical teams
              </h2>
              <p className="mt-3 text-[color:var(--muted-strong)]">
                Better data leads to better medicine.
              </p>
            </div>

            <div className="grid items-end gap-6 md:grid-cols-3">
              <div className="glass-card ambient-shadow rounded-[2rem] border border-white/60 p-8 transition hover:-translate-y-2">
                <div className="display-font text-[56px] font-bold tracking-[-0.06em] text-[color:var(--accent)]">
                  45%
                </div>
                <h4 className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--foreground)]">
                  Less admin overhead
                </h4>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted-strong)]">
                  Reduce time spent on data entry and context-switching by
                  nearly half per patient.
                </p>
              </div>

              <div className="ambient-shadow rounded-[2rem] bg-[color:var(--accent)] p-8 text-white transition hover:-translate-y-2 md:mb-12">
                <div className="display-font text-[56px] font-bold tracking-[-0.06em] text-white">
                  High
                </div>
                <h4 className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-white">
                  Higher-quality intake
                </h4>
                <p className="mt-4 text-sm leading-7 text-white/82">
                  Structured logic captures nuanced clinical details that
                  standard forms miss.
                </p>
              </div>

              <div className="glass-card ambient-shadow rounded-[2rem] border border-white/60 p-8 transition hover:-translate-y-2">
                <div className="display-font text-[56px] font-bold tracking-[-0.06em] text-[rgba(139,75,41,1)]">
                  Clear
                </div>
                <h4 className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--foreground)]">
                  Better consult starts
                </h4>
                <p className="mt-4 text-sm leading-7 text-[color:var(--muted-strong)]">
                  Walk into every room fully informed, allowing you to focus on
                  the patient immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        id="workflow"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.24 }}
        variants={revealContainer}
        className="mx-auto max-w-7xl scroll-mt-28 px-6 py-24 xl:px-10"
      >
        <h2 className="display-font mb-20 text-center text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.08] font-[650] text-[color:var(--foreground)]">
          The Operational Workflow
        </h2>

        <div className="relative">
          <div className="absolute left-[10%] right-[10%] top-10 hidden h-0.5 bg-gradient-to-r from-[color:var(--accent)]/20 via-[color:var(--accent)]/40 to-[color:var(--accent)]/20 md:block" />
          <div className="grid gap-8 md:grid-cols-4">
            {workflow.map((step, index) => (
              <motion.div
                key={step.title}
                variants={revealItem}
                className={`group flex flex-col items-center text-center ${index % 2 === 1 ? "md:mt-12" : ""}`}
              >
                <div className="ambient-shadow flex h-20 w-20 items-center justify-center rounded-full border-2 border-[color:var(--accent)]/20 bg-white text-2xl font-bold text-[color:var(--accent)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[color:var(--accent)] group-hover:text-white">
                  0{index + 1}
                </div>
                <h5 className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--foreground)]">
                  {step.title}
                </h5>
                <p className="mt-2 max-w-[220px] text-sm leading-7 text-[color:var(--muted-strong)]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="contact"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.24 }}
        variants={revealContainer}
        className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-24 xl:px-10"
      >
        <motion.div
          variants={revealItem}
          className="relative overflow-hidden rounded-[3rem] bg-[color:var(--accent)] px-8 py-14 shadow-[0_40px_110px_rgba(14,124,123,0.22)] sm:px-10 lg:px-14"
        >
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-[rgba(139,75,41,0.24)] blur-[100px]" />
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/14 blur-[80px]" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="display-font text-[clamp(2.6rem,4.5vw,4.4rem)] leading-[1.04] font-[680] text-white">
              If this matches how your clinic wants intake to feel, let&apos;s talk.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/84">
              Modern Health is modular. We tailor the intake logic, patient
              route, and review framing to your specialty and workflow.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://cal.com/ganesh-datta-bygktk/sales-throughput-session"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-[color:var(--accent)] transition hover:scale-[1.03]"
              >
                Request custom version
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                href="/create-demo"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/16"
              >
                Create Demo Route
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
