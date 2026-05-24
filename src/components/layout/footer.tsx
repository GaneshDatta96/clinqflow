import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/brand/site";
import { BrandLogo } from "@/components/brand/logo";
import { LEGAL, LEGAL_PAGES } from "@/lib/legal/site";

const footerLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: BRAND.demoUrl, external: true },
];

export function GlobalFooter() {
  return (
    <footer className="w-full border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]/40 px-6 py-14 lg:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-start gap-3">
            <BrandLogo />
            <p className="max-w-sm text-sm font-medium leading-6 text-[color:var(--foreground)]">
              {BRAND.tagline}
            </p>
            <p className="max-w-sm text-sm leading-6 text-[color:var(--muted)]">
              {BRAND.positioning}
            </p>
          </div>

          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex flex-wrap gap-3">
              {footerLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--primary)]"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--primary)]"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <a
                href={BRAND.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary !px-4 !py-2.5 !text-sm"
              >
                Book demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-xs leading-6 text-[color:var(--muted)] md:text-left">
          Cliniqflow is a workflow and documentation-assist platform. All clinical
          decisions remain the responsibility of licensed healthcare professionals.
        </p>

        <div className="flex flex-col items-center gap-3 border-t border-[color:var(--line)]/50 pt-8 md:flex-row md:justify-between">
          <p className="text-xs text-[color:var(--muted)]">
            © {new Date().getFullYear()} {LEGAL.productName}. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="text-xs font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--accent)]"
              >
                {page.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
