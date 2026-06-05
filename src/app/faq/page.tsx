import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { BRAND } from "@/lib/brand/site";
import { HOME_FAQS } from "@/lib/seo/home-faqs";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqPageSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildPageMetadata({
  title: "Intake and Documentation Software FAQ",
  description:
    "Frequently asked questions about CliniqFlow patient intake software, AI-assisted documentation, clinic workflows, and data security.",
  path: "/faq",
});

export default function FaqPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16 pt-28 xl:px-10">
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqPageSchema(HOME_FAQS)]} />

      <nav aria-label="Breadcrumb" className="text-sm text-[color:var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="font-medium hover:text-[color:var(--foreground)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[color:var(--foreground)]">FAQ</li>
        </ol>
      </nav>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <p className="section-label">FAQ</p>
        <h1 className="display-font mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted-strong)]">
          Straight answers about CliniqFlow as intake and documentation workflow software for
          outpatient clinics.
        </p>
        <div className="mt-8">
          <Link href={BRAND.signupHref} className="btn-primary inline-flex items-center gap-2">
            Sign up
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="space-y-3">
        {HOME_FAQS.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[1.35rem] border border-[color:var(--line)] bg-white/70 px-5 py-4"
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

      <section className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]/50 px-6 py-5">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">Explore further</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <li>
            <Link href="/how-patient-intake-works" className="font-semibold text-[color:var(--accent)]">
              How patient intake works
            </Link>
          </li>
          <li>
            <Link href="/ai-documentation" className="font-semibold text-[color:var(--accent)]">
              AI documentation
            </Link>
          </li>
          <li>
            <Link href="/clinic-workflows" className="font-semibold text-[color:var(--accent)]">
              Clinic workflows
            </Link>
          </li>
          <li>
            <Link href="/security" className="font-semibold text-[color:var(--accent)]">
              Security
            </Link>
          </li>
          <li>
            <Link href="/medical-disclaimer" className="font-semibold text-[color:var(--accent)]">
              Medical disclaimer
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
