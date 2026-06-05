import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { BRAND } from "@/lib/brand/site";
import { breadcrumbSchema } from "@/lib/seo/schema";

type MarketingSection = {
  title: string;
  content: React.ReactNode;
};

type MarketingPageShellProps = {
  label: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  breadcrumbPath: string;
  sections: MarketingSection[];
  relatedLinks?: { href: string; label: string }[];
};

export function MarketingPageShell({
  label,
  title,
  description,
  breadcrumbLabel,
  breadcrumbPath,
  sections,
  relatedLinks = [],
}: MarketingPageShellProps) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: breadcrumbLabel, path: breadcrumbPath },
  ];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-16 pt-28 xl:px-10">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <nav aria-label="Breadcrumb" className="text-sm text-[color:var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="font-medium hover:text-[color:var(--foreground)]">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-[color:var(--foreground)]">{breadcrumbLabel}</li>
        </ol>
      </nav>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <p className="section-label">{label}</p>
        <h1 className="display-font mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[color:var(--muted-strong)]">
          {description}
        </p>

        <div className="mt-8">
          <Link href={BRAND.signupHref} className="btn-primary inline-flex items-center gap-2">
            Sign up
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.title}
          className="rounded-[1.75rem] border border-[color:var(--line)] bg-white/70 p-6 sm:p-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
          <div className="prose-clinic mt-4 space-y-4 text-sm leading-7 text-[color:var(--muted-strong)]">
            {section.content}
          </div>
        </section>
      ))}

      {relatedLinks.length > 0 && (
        <section className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)]/50 px-6 py-5">
          <p className="text-sm font-semibold text-[color:var(--foreground)]">Related pages</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {relatedLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-semibold text-[color:var(--accent)] hover:opacity-80"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-[1.75rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-6 py-8 text-center sm:px-10">
        <h2 className="text-2xl font-semibold tracking-tight">Ready to organize intake before the visit?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--muted-strong)]">
          Create your clinic workspace, send structured intake links, and keep documentation
          review-first from day one.
        </p>
        <div className="mt-6">
          <Link href={BRAND.signupHref} className="btn-primary inline-flex items-center gap-2">
            Sign up
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <p className="text-center text-xs leading-6 text-[color:var(--muted)]">
        CliniqFlow is an intake and documentation workflow platform with AI-assisted
        documentation and clinical decision-support. All clinical decisions remain the
        responsibility of licensed healthcare professionals.{" "}
        <Link href="/medical-disclaimer" className="font-semibold text-[color:var(--accent)]">
          Medical disclaimer
        </Link>
      </p>
    </div>
  );
}
