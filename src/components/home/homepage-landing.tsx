"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardPlus,
  Clock3,
  FileText,
  LayoutDashboard,
  Link2,
  ShieldCheck,
  Stethoscope,
  UserRoundPlus,
  Users,
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
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const workflowSteps = [
  {
    icon: UserRoundPlus,
    title: "Create patient",
    detail: "Set up the patient once and generate the private intake route.",
  },
  {
    icon: Link2,
    title: "Send intake link",
    detail: "Share a unique link before the consultation, without manual back-and-forth.",
  },
  {
    icon: FileText,
    title: "Collect structured answers",
    detail: "Responses arrive organized instead of scattered across forms and notes.",
  },
  {
    icon: LayoutDashboard,
    title: "Review practitioner-ready output",
    detail: "Open a clean view with timeline, context, and SOAP-ready framing.",
  },
];

const principles = [
  {
    title: "Custom clinic logic",
    description:
      "The flow mirrors how your consultations actually run, not a generic intake template.",
  },
  {
    title: "Pre-visit completion",
    description:
      "Patients complete intake before the appointment so the first minutes stay clinical.",
  },
  {
    title: "Review-first output",
    description:
      "Practitioners start with a readable summary, not a stack of raw answers.",
  },
];

const outcomes = [
  {
    title: "Less admin overhead",
    description:
      "Fewer reminder calls, less re-entry, and less time cleaning up patient responses.",
  },
  {
    title: "Higher-quality intake",
    description:
      "Consistent structure helps teams compare patients, spot gaps, and review faster.",
  },
  {
    title: "Better consult starts",
    description:
      "Clinicians enter the room with a working picture instead of rebuilding context live.",
  },
];

const practitionerPreview = [
  "Reason for visit, symptom framing, and pre-consult context",
  "Structured timeline with relevant changes and patient language intact",
  "SOAP-ready summary blocks for faster practitioner review",
];

const beforeConsult = [
  "Paper or PDF forms that arrive incomplete",
  "Multiple back-and-forth touchpoints before the visit",
  "Practitioners reconstructing context during the consult",
];

const afterConsult = [
  "Private intake links created per patient",
  "Readable summaries prepared before the appointment starts",
  "A calmer first ten minutes for both patient and clinician",
];

export function HomepageLanding() {
  return (
    <div className="mx-auto flex w-full max-w-[1380px] flex-1 flex-col gap-6 px-5 pb-20 pt-6 sm:px-8 lg:px-12 xl:gap-8 xl:pt-10">
      <motion.section
        initial="hidden"
        animate="show"
        variants={revealContainer}
        className="relative overflow-hidden rounded-[2.75rem] border border-[color:var(--line-strong)] bg-[linear-gradient(135deg,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.68)_46%,rgba(241,247,245,0.92)_100%)] px-6 py-8 shadow-[0_30px_120px_rgba(27,44,52,0.14)] backdrop-blur-2xl sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      >
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, -14, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-8 top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(14,124,123,0.22)_0%,rgba(14,124,123,0)_72%)] blur-2xl"
        />
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 16, 0], x: [0, 10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(232,184,109,0.24)_0%,rgba(232,184,109,0)_72%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_35%,transparent_65%,rgba(255,255,255,0.18))]" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-10">
          <motion.div variants={revealItem} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-sm font-semibold text-[color:var(--muted-strong)] shadow-sm">
              <Stethoscope className="h-4 w-4 text-[color:var(--accent)]" />
              Custom clinic intake workspace
            </div>

            <h1 className="mt-6 max-w-5xl text-[clamp(3.1rem,6vw,6rem)] font-semibold tracking-[-0.07em] text-[color:var(--foreground)]">
              Patient intake that arrives structured before the consultation
              starts.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted-strong)] sm:text-[1.15rem]">
              Create the patient once. Send a private intake link. Review a
              calm, clinician-friendly summary instead of chasing forms and
              rebuilding context in the room.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/intake"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(14,124,123,0.24)]"
              >
                View Patient Experience
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-white/80 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition duration-200 hover:-translate-y-0.5 hover:bg-white"
              >
                Open Practitioner View
                <LayoutDashboard className="h-4 w-4" />
              </Link>
              <Link
                href="/create-demo"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(20,33,37,0.18)]"
              >
                Create Demo Route
                <ClipboardPlus className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-3 lg:grid-cols-3">
              {principles.map((principle) => (
                <motion.div
                  key={principle.title}
                  variants={revealItem}
                  className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/72 p-4 shadow-[0_12px_40px_rgba(27,44,52,0.06)]"
                >
                  <p className="text-sm font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                    {principle.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">
                    {principle.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={revealItem} className="space-y-4 lg:pt-3">
            <div className="glass-panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">Live Flow</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    From patient creation to review-ready handoff.
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Ready
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    variants={revealItem}
                    className="flex items-start gap-4 rounded-[1.4rem] border border-[color:var(--line)] bg-white/78 px-4 py-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-raised)]">
                      <step.icon className="h-[18px] w-[18px] text-[color:var(--accent)]" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                          0{index + 1}
                        </span>
                        <p className="text-base font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                          {step.title}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">
                        {step.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <motion.div
                variants={revealItem}
                className="rounded-[1.85rem] border border-[rgba(255,255,255,0.08)] bg-[color:var(--foreground)] p-5 text-white shadow-[0_20px_70px_rgba(20,33,37,0.18)]"
              >
                <p className="section-label !text-white/55">Practitioner Output</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                  Clean review framing before the consult begins.
                </p>
                <div className="mt-5 space-y-3">
                  {practitionerPreview.map((item) => (
                    <div
                      key={item}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={revealItem}
                className="glass-panel rounded-[1.85rem] p-5"
              >
                <p className="section-label">Operational Fit</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white/82 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Clock3 className="h-4 w-4 text-[color:var(--accent)]" />
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">
                        Better first 10 minutes
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">
                      Intake is already structured before the patient sits down
                      with the practitioner.
                    </p>
                  </div>

                  <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white/82 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 text-[color:var(--accent)]" />
                      <p className="text-sm font-semibold text-[color:var(--foreground)]">
                        Shared per patient
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted-strong)]">
                      The route is generated per patient instead of sending a
                      one-size-fits-all intake form.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={revealContainer}
        className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]"
      >
        <motion.div
          variants={revealItem}
          className="glass-panel rounded-[2.2rem] px-6 py-8 sm:px-8 sm:py-9"
        >
          <p className="section-label">Designed For Trust</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            Calm hierarchy, sharper typography, and a workflow story that feels
            credible on first read.
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-[color:var(--muted-strong)]">
            Clinic owners and practitioners do not need visual noise. They need
            confidence that the system is thoughtfully designed, operationally
            clear, and ready to support real consultations.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-sm font-semibold text-[color:var(--muted-strong)]">
              Editorial typography
            </span>
            <span className="rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-sm font-semibold text-[color:var(--muted-strong)]">
              Softer glass surfaces
            </span>
            <span className="rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-sm font-semibold text-[color:var(--muted-strong)]">
              Motion with restraint
            </span>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <motion.div
              key={outcome.title}
              variants={revealItem}
              className="glass-panel rounded-[1.9rem] px-6 py-7"
            >
              <p className="section-label">Outcome</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
                {outcome.title}
              </h3>
              <p className="mt-3 leading-7 text-[color:var(--muted-strong)]">
                {outcome.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealContainer}
        className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]"
      >
        <motion.div
          variants={revealItem}
          className="glass-panel rounded-[2.25rem] px-6 py-8 sm:px-8 sm:py-10"
        >
          <p className="section-label">Workflow Architecture</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            A cleaner handoff from patient completion to practitioner review.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={revealItem}
                className="rounded-[1.6rem] border border-[color:var(--line)] bg-white/78 px-5 py-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm uppercase tracking-[0.18em] text-[color:var(--muted)]">
                    Step 0{index + 1}
                  </span>
                  <step.icon className="h-4 w-4 text-[color:var(--accent)]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">
                  {step.title}
                </h3>
                <p className="mt-3 leading-7 text-[color:var(--muted-strong)]">
                  {step.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={revealItem}
          className="rounded-[2.25rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(20,33,37,0.96),rgba(20,33,37,0.9))] px-6 py-8 text-white shadow-[0_30px_90px_rgba(20,33,37,0.18)] sm:px-8 sm:py-10"
        >
          <p className="section-label !text-white/55">Practitioner Review Pack</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-[2rem]">
            The output should feel ready to read, not ready to fix.
          </h2>
          <p className="mt-5 leading-8 text-white/72">
            This is where the product earns trust. Good intake software should
            not just collect answers. It should hand over useful clinical
            context in a way that respects the practitioner’s time.
          </p>

          <div className="mt-8 space-y-3">
            {practitionerPreview.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.06] px-4 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <p className="text-sm leading-6 text-white/78">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Demo routes</p>
                <p className="mt-1 text-sm text-white/62">
                  Create and share a version tailored to the clinic.
                </p>
              </div>
              <ClipboardPlus className="h-4 w-4 text-white/72" />
            </div>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={revealContainer}
        className="grid gap-4 lg:grid-cols-2"
      >
        <motion.div
          variants={revealItem}
          className="glass-panel rounded-[2.15rem] px-6 py-8 sm:px-8 sm:py-9"
        >
          <p className="section-label">Before The Consult</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            Too much friction before the appointment even starts.
          </h2>
          <div className="mt-6 space-y-3">
            {beforeConsult.map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-[color:var(--line)] bg-white/76 px-4 py-4 text-base leading-7 text-[color:var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={revealItem}
          className="rounded-[2.15rem] border border-[color:var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(246,250,249,0.92))] px-6 py-8 shadow-[0_24px_80px_rgba(27,44,52,0.12)] sm:px-8 sm:py-9"
        >
          <p className="section-label">With This Workflow</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
            The team starts the visit with a real working picture.
          </h2>
          <div className="mt-6 space-y-3">
            {afterConsult.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-[1.4rem] border border-[color:var(--line)] bg-white/86 px-4 py-4"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                <p className="text-base leading-7 text-[color:var(--foreground)]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={revealContainer}
        className="glass-panel rounded-[2.5rem] px-6 py-8 text-center sm:px-8 sm:py-10"
      >
        <motion.div variants={revealItem}>
          <p className="section-label">Next Step</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-[3.1rem] lg:leading-[1.04]">
            If this matches how your clinic wants intake to feel, we can build
            your version.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl leading-8 text-[color:var(--muted-strong)]">
            The intake logic, review framing, specialty language, and
            practitioner workspace can all be adapted to your exact process.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="https://cal.com/ganesh-datta-bygktk/sales-throughput-session"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(14,124,123,0.24)]"
            >
              Request custom version
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/patients"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--line-strong)] bg-white/82 px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition duration-200 hover:-translate-y-0.5 hover:bg-white"
            >
              View patient list
              <Users className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
