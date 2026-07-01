import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronDown, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { BRAND } from "@/lib/brand/site";
import { HOME_FAQS } from "@/lib/seo/home-faqs";
import { faqPageSchema, softwareApplicationSchema } from "@/lib/seo/schema";
import {
  AnimatedTestimonials,
  Compare,
  DashboardProductPreview,
  EncounterProductPreview,
  IntakeProductPreview,
  StickyScrollReveal,
  Timeline,
} from "@/components/home/homepage-dynamic-imports";
import { HeroOperationalPreview } from "@/components/home/homepage-product-previews";
import { GradientRule, PetalAccent } from "@/components/home/petal-accent";
import { PricingPlanActions } from "@/components/home/pricing-plan-actions";
import {
  BentoGrid,
  GlareCard,
  HeroHighlight,
  LampHeader,
  Spotlight,
} from "@/components/ui/aceternity";

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

const patientJourney = [
  {
    title: "Clinic sends a secure intake link",
    description:
      "Staff create the patient record and share one signed URL with the patient ID and access token embedded.",
  },
  {
    title: "Patient completes structured intake at home",
    description:
      "Specialty questionnaires and consent capture happen in a calmer pre-visit step—not in the waiting room rush.",
  },
  {
    title: "Team reviews status in one queue",
    description:
      "Front desk and practitioners see who completed intake, what's ready for review, and what still needs attention.",
  },
  {
    title: "Practitioner approves draft documentation",
    description:
      "SOAP drafts stay editable until a licensed clinician reviews and approves. Nothing auto-publishes to a chart.",
  },
];

const testimonials = [
  {
    quote:
      "Our front desk stopped chasing intake packets. Patients complete forms before they arrive and we actually read them.",
    name: "Outpatient clinic team",
    role: "Functional medicine practice",
  },
  {
    quote:
      "The workflow feels calm—queue, review, approve. It is not another dashboard we have to babysit.",
    name: "Practice manager",
    role: "Multi-provider wellness clinic",
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
    cta: "Call sales",
    href: BRAND.salesUrl,
    highlighted: false,
    external: false,
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
  return (
    <div className="overflow-x-hidden pt-[4.5rem]">
      <JsonLd data={[softwareApplicationSchema(), faqPageSchema(HOME_FAQS)]} />
      <section className="relative mx-auto max-w-[1280px] overflow-hidden px-5 pb-16 pt-10 sm:px-6 lg:px-10 lg:pb-20 lg:pt-16">
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="white" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <PetalAccent className="h-8 w-8 text-[color:var(--primary)]" />
              <span className="section-label">{BRAND.tagline}</span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Link
                href="/security"
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)]/60 px-3 py-1.5 text-xs font-medium text-[color:var(--muted-strong)] transition-colors hover:border-[color:var(--line-strong)] hover:text-[color:var(--foreground)]"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--accent)]" />
                Clinic data safeguards
              </Link>
            </div>

            <HeroHighlight highlight="documentation workflow">
              Patient intake and documentation workflow software for clinics
            </HeroHighlight>

            <p className="mt-5 max-w-lg font-serif text-base leading-relaxed text-[color:var(--muted-strong)] sm:text-[1.05rem]">
              Reduce intake chaos before the appointment begins. CliniqFlow collects structured
              patient intake, prepares draft documentation, and keeps everything in one practitioner
              dashboard.
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
        <LampHeader className="mb-10 items-start">
          <SectionIntro
            label="Workflow"
            title="Healthcare intake workflow for calmer pre-visit preparation"
            description="Patient communication, intake structure, practitioner review, and documentation — organized in one pre-visit workflow."
          />
        </LampHeader>

        <StickyScrollReveal
          items={workflowMoments.map((item) => ({
            step: item.step,
            title: item.title,
            description: item.description,
          }))}
        />

        <p className="mt-8 text-sm leading-relaxed text-[color:var(--muted-strong)]">
          Learn more about{" "}
          <Link href="/how-patient-intake-works" className="font-semibold text-[color:var(--accent)]">
            how patient intake works
          </Link>
          ,{" "}
          <Link href="/clinic-workflows" className="font-semibold text-[color:var(--accent)]">
            clinic documentation workflows
          </Link>
          , and{" "}
          <Link href="/security" className="font-semibold text-[color:var(--accent)]">
            data safeguards
          </Link>
          .
        </p>
      </PageSection>

      <PageSection id="compare" muted>
        <SectionIntro
          label="Compare"
          title="Paper intake vs structured digital intake"
          description="Drag to compare the old front-desk scramble with a calmer pre-visit workflow."
          centered
          className="max-w-3xl"
        />
        <div className="mt-10">
          <Compare
            beforeLabel="Paper & inbox chaos"
            afterLabel="CliniqFlow"
            before={
              <div className="space-y-2 font-serif text-sm text-[color:var(--muted-strong)]">
                <p>Clipboards in the waiting room</p>
                <p>Staff re-typing patient history</p>
                <p>Practitioner starts cold every visit</p>
              </div>
            }
            after={
              <div className="space-y-2 font-serif text-sm text-[color:var(--foreground)]">
                <p>Signed link before the appointment</p>
                <p>Structured specialty questionnaires</p>
                <p>Review-ready draft documentation</p>
              </div>
            }
          />
        </div>
      </PageSection>

      <PageSection id="product" muted>
        <SectionIntro
          label="Product"
          title="Clinic documentation workflow in practice"
          description="The interface you see here is the same workflow your team uses — queue, intake, and SOAP review."
        />

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[color:var(--muted-strong)]">
          Explore{" "}
          <Link href="/ai-documentation" className="font-semibold text-[color:var(--accent)]">
            AI-assisted clinical documentation
          </Link>{" "}
          and read the{" "}
          <Link href="/faq" className="font-semibold text-[color:var(--accent)]">
            frequently asked questions
          </Link>
          .
        </p>

        <div className="mt-10">
          <BentoGrid
            items={[
              {
                label: "Practitioner dashboard",
                title: "One queue for patients and encounters",
                description:
                  "Status, SOAP review, and intake themes in a single operational view.",
                className: "lg:col-span-7",
                children: <DashboardProductPreview />,
              },
              {
                label: "Patient intake",
                title: "Structured intake from a secure link",
                description:
                  "Specialty questionnaires and consent capture before the visit.",
                className: "lg:col-span-5",
                children: <IntakeProductPreview />,
              },
              {
                label: "Clinical control",
                title: "Practitioner review, not autopilot",
                description:
                  "Draft notes stay editable until a licensed clinician approves them.",
                dark: true,
                className: "lg:col-span-4",
                children: (
                  <div className="space-y-2.5">
                    {[
                      "SOAP notes start in draft status",
                      "Evidence and data gaps stay visible",
                      "Approval remains with the practitioner",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-6 text-white/80"
                      >
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/60" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                label: "Encounter review",
                title: "SOAP sections in patient context",
                description:
                  "Subjective, objective, assessment, and plan — where the intake first became useful.",
                className: "lg:col-span-8",
                children: <EncounterProductPreview />,
              },
            ]}
          />
        </div>
      </PageSection>

      <PageSection id="journey">
        <SectionIntro
          label="Patient journey"
          title="From intake link to approved documentation"
          description="A clear path for patients and practitioners—without turning intake into autopilot charting."
          centered
          className="max-w-3xl"
        />
        <div className="mt-10">
          <Timeline items={patientJourney} />
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

      <PageSection id="testimonials" muted>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <SectionIntro
            label="Clinics like yours"
            title="Built for teams who want calmer pre-visit preparation"
            description="Independent outpatient clinics use CliniqFlow to organize intake before the visit—not replace clinical judgment."
          />
          <AnimatedTestimonials items={testimonials} />
        </div>
      </PageSection>

      <PageSection id="pricing" muted>
        <LampHeader className="mb-10">
          <SectionIntro
            label="Pricing"
            title="Simple clinic pricing."
            description="Sign up for your clinic workspace, then subscribe to the plan that fits your team."
            centered
            className="max-w-3xl"
          />
        </LampHeader>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const card = (
              <article className="flex h-full flex-col p-6 sm:p-7">
                {plan.highlighted ? (
                  <span className="section-label text-[color:var(--accent)]">Recommended</span>
                ) : null}
                <h3 className="display-font mt-2 text-lg tracking-tight text-[color:var(--foreground)]">
                  {plan.name}
                </h3>
                <p className="mt-3">
                  <span className="display-font text-[2.35rem] leading-none">{plan.price}</span>
                  <span className="text-sm text-[color:var(--muted)]">{plan.period}</span>
                </p>
                <p className="mt-3 font-serif text-sm leading-relaxed text-[color:var(--muted-strong)]">
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
            );

            return plan.highlighted ? (
              <GlareCard key={plan.name}>{card}</GlareCard>
            ) : (
              <article
                key={plan.name}
                className="flex flex-col rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)]"
              >
                {card}
              </article>
            );
          })}
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
            {HOME_FAQS.map((faq) => (
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
