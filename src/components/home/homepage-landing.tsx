import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronDown, ShieldCheck } from "lucide-react";
import { nicheConfigs } from "@/lib/clinics/niche-configs";
import { BRAND } from "@/lib/brand/site";
import {
  DashboardProductPreview,
  EncounterProductPreview,
  HeroOperationalPreview,
  IntakeProductPreview,
} from "@/components/home/homepage-product-previews";
import { GradientRule, PetalAccent } from "@/components/home/petal-accent";
import { PricingPlanActions } from "@/components/home/pricing-plan-actions";

const heroPoints = [
  "Patients complete structured intake before they arrive",
  "Draft SOAP notes wait for practitioner review",
  "One dashboard for queue, status, and documentation",
];

const workflowMoments = [
  {
    step: "01",
    title: "Structured intake before the visit",
    description:
      "Signed intake links and specialty questionnaires move repetitive discovery into a calmer pre-visit step.",
  },
  {
    step: "02",
    title: "Clear status for the whole team",
    description:
      "See who completed intake, what's ready for review, and where the practitioner needs to step in.",
  },
  {
    step: "03",
    title: "Draft notes, practitioner approval",
    description:
      "SOAP drafts and evidence are prepared in the workflow. Final approval stays with the clinician.",
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

const pricingPlans = [
  {
    name: "Starter",
    price: "$399",
    period: "/month",
    description: "For smaller practices digitizing intake workflows.",
    features: ["Intake workflows", "Patient links", "Basic SOAP drafting", "1 clinic workspace"],
    cta: "Sign up",
    href: BRAND.signupHref,
    highlighted: false,
    showRazorpay: true,
  },
  {
    name: "Growth",
    price: "$449",
    period: "/month",
    description: "For growing clinics needing operational efficiency.",
    features: [
      "Multi-user access",
      "Advanced workflows",
      "AI-assisted documentation and clinical decision-support",
      "Structured intake highlights",
    ],
    cta: "Sign up",
    href: BRAND.signupHref,
    highlighted: true,
    showRazorpay: true,
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
    href: BRAND.salesUrl,
    highlighted: false,
    external: true,
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
      "No. CliniqFlow structures intake, organizes responses into documentation themes, and prepares draft documentation. Licensed practitioners remain responsible for diagnosis, interpretation, and final approval.",
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

const SECTION_PAD = "py-16 lg:py-20";

function PageSection({
  id,
  children,
  muted = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  muted?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${muted ? "border-y border-[color:var(--line)] bg-[color:var(--surface-muted)]" : ""} ${className}`}
    >
      <div className={`mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10 ${SECTION_PAD}`}>
        {children}
      </div>
    </section>
  );
}

function SectionIntro({
  label,
  title,
  description,
  className = "",
  centered = false,
}: {
  label: string;
  title: string;
  description?: string;
  className?: string;
  centered?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}>
      <span className="section-label">{label}</span>
      <h2 className="mt-3 text-balance text-[clamp(1.85rem,4vw,2.85rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[color:var(--foreground)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[color:var(--muted-strong)] sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ShowcaseCard({
  label,
  title,
  description,
  children,
  className = "",
  dark = false,
}: {
  label: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-5 sm:p-6 ${
        dark
          ? "border-[color:rgba(11,16,32,0.12)] bg-[color:var(--charcoal)] text-white"
          : "surface-panel border-[color:var(--line)]"
      } ${className}`}
    >
      <div className={children ? "mb-4" : ""}>
        <p className={`section-label ${dark ? "text-white/55" : ""}`}>{label}</p>
        <h3
          className={`mt-2 text-[1.2rem] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[1.35rem] ${
            dark ? "text-white" : "text-[color:var(--foreground)]"
          }`}
        >
          {title}
        </h3>
        {description ? (
          <p
            className={`mt-2 text-sm leading-relaxed ${
              dark ? "text-white/72" : "text-[color:var(--muted-strong)]"
            }`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </article>
  );
}

export function HomepageLanding() {
  const niches = Object.values(nicheConfigs)
    .map((config) => config.label)
    .slice(0, 6);

  return (
    <div className="overflow-x-hidden pt-[4.5rem]">
      <section className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-6 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <PetalAccent className="h-8 w-8 text-[color:var(--primary)]" />
              <span className="section-label">{BRAND.tagline}</span>
            </div>

            <h1 className="max-w-[16ch] text-balance text-[clamp(2.25rem,4.8vw,3.65rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[color:var(--foreground)] sm:max-w-none">
              Reduce intake chaos before the appointment begins.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[color:var(--muted-strong)] sm:text-[1.05rem]">
              CliniqFlow collects structured patient intake, prepares draft documentation, and
              keeps everything in one practitioner dashboard.
            </p>

            <ul className="mt-6 space-y-2.5">
              {heroPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-sm leading-6 text-[color:var(--muted-strong)]"
                >
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={BRAND.signupHref} className="btn-primary">
                Sign up
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#product" className="btn-secondary">
                View product demo
              </a>
            </div>
          </div>

          <div className="lg:pt-2">
            <HeroOperationalPreview />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-10">
        <GradientRule />
      </div>

      <PageSection id="workflow">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              label="Workflow"
              title="A calmer hour before the visit."
              description="Patient communication, intake structure, practitioner review, and documentation — organized in one pre-visit workflow."
            />

            <div className="mt-6 rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5">
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                Built for specialty clinics
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {niches.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-1 text-xs font-medium text-[color:var(--charcoal)]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {workflowMoments.map((item) => (
              <article
                key={item.step}
                className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 sm:p-6"
              >
                <p className="section-label">{item.step}</p>
                <h3 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[color:var(--foreground)] sm:text-[1.25rem]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection id="product" muted>
        <SectionIntro
          label="Product"
          title="Real screens, not mockups."
          description="The interface you see here is the same workflow your team uses — queue, intake, and SOAP review."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <ShowcaseCard
            label="Practitioner dashboard"
            title="One queue for patients and encounters"
            description="Status, SOAP review, and intake themes in a single operational view."
            className="lg:col-span-7"
          >
            <DashboardProductPreview />
          </ShowcaseCard>

          <ShowcaseCard
            label="Patient intake"
            title="Structured intake from a secure link"
            description="Specialty questionnaires and consent capture before the visit."
            className="lg:col-span-5"
          >
            <IntakeProductPreview />
          </ShowcaseCard>

          <ShowcaseCard
            label="Clinical control"
            title="Practitioner review, not autopilot"
            description="Draft notes stay editable until a licensed clinician approves them."
            dark
            className="lg:col-span-4"
          >
            <div className="space-y-2.5">
              {[
                "SOAP notes start in draft status",
                "Evidence and data gaps stay visible",
                "Approval remains with the practitioner",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm leading-6 text-white/80">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </ShowcaseCard>

          <ShowcaseCard
            label="Encounter review"
            title="SOAP sections in patient context"
            description="Subjective, objective, assessment, and plan — where the intake first became useful."
            className="lg:col-span-8"
          >
            <EncounterProductPreview />
          </ShowcaseCard>
        </div>
      </PageSection>

      <PageSection id="why-cliniqflow">
        <SectionIntro
          label="Why it helps"
          title="What the clinic gets back is focus."
          description="Less friction in the parts of the day that usually feel fragmented, repetitive, or mentally expensive."
          centered
          className="max-w-3xl"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {calmOutcomes.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 sm:p-6"
            >
              <h3 className="text-base font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection id="pricing" muted>
        <SectionIntro
          label="Pricing"
          title="Simple clinic pricing."
          description="Sign up for your clinic workspace, then subscribe to the plan that fits your team."
          centered
          className="max-w-3xl"
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-[1.75rem] border p-6 sm:p-7 ${
                plan.highlighted
                  ? "border-[color:var(--primary)] bg-[color:var(--surface-raised)] shadow-[var(--shadow)]"
                  : "border-[color:var(--line)] bg-[color:var(--surface-raised)]"
              }`}
            >
              {plan.highlighted ? (
                <span className="section-label text-[color:var(--accent)]">Recommended</span>
              ) : null}
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                {plan.name}
              </h3>
              <p className="mt-3">
                <span className="display-font text-[2.35rem] leading-none">{plan.price}</span>
                <span className="text-sm text-[color:var(--muted)]">{plan.period}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                {plan.description}
              </p>
              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm leading-6 text-[color:var(--muted-strong)]"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              {"external" in plan && plan.external ? (
                <PricingPlanActions
                  cta={plan.cta}
                  href={plan.href}
                  highlighted={plan.highlighted}
                  external
                />
              ) : (
                <PricingPlanActions
                  cta={plan.cta}
                  href={plan.href}
                  highlighted={plan.highlighted}
                  showRazorpay={"showRazorpay" in plan && plan.showRazorpay}
                  razorpayPlan={plan.name === "Growth" ? "growth" : "starter"}
                />
              )}
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection id="faq">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <SectionIntro
            label="FAQ"
            title="Common questions"
            description="Straight answers about what CliniqFlow is and how clinics use it."
          />

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.35rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] px-5 py-4 transition hover:border-[color:var(--line-strong)]"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[0.95rem] font-semibold tracking-[-0.02em] text-[color:var(--foreground)]">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[color:var(--muted)] transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-strong)]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </PageSection>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 sm:py-16 lg:px-10">
          <div className="overflow-hidden rounded-[1.75rem] border border-[color:rgba(11,16,32,0.12)] bg-[color:var(--charcoal)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
              <div>
                <p className="section-label text-white/55">Sign up</p>
                <h2 className="mt-3 max-w-xl text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                  Send your first intake link this week.
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/72 sm:text-[0.95rem]">
                  Create your clinic workspace, subscribe to a plan, and start sending intake links
                  to patients.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={BRAND.signupHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[color:var(--primary)] transition hover:bg-white/94"
                >
                  Sign up
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Subscribe
                </a>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <GradientRule />
          </div>
        </div>
      </section>
    </div>
  );
}
