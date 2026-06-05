"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { BRAND } from "@/lib/brand/site";
import { BrandLogo } from "@/components/brand/logo";
import { LEGAL, LEGAL_PAGES } from "@/lib/legal/site";
import { SEO_LANDING_PAGES } from "@/lib/seo/routes";

const homeFooterLinks = [
  { label: "Product", href: "/#product" },
  { label: "Workflow", href: "/#workflow" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Why it helps", href: "/#why-cliniqflow" },
  { label: "FAQ", href: "/#faq" },
];

export function GlobalFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/proof")) {
    return null;
  }

  return (
    <footer className="w-full border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]/40 px-6 py-14 lg:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex flex-col items-start gap-3">
            <BrandLogo />
            <p className="max-w-sm text-sm font-medium leading-6 text-[color:var(--foreground)]">
              {BRAND.tagline}
            </p>
            <p className="max-w-sm text-sm leading-6 text-[color:var(--muted)]">
              {BRAND.positioning}
            </p>
            <Link href={BRAND.signupHref} className="btn-primary !px-4 !py-2.5 !text-sm">
              Sign up
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Product</p>
            <nav className="mt-3 flex flex-col gap-2">
              {SEO_LANDING_PAGES.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Homepage</p>
            <nav className="mt-3 flex flex-col gap-2">
              {homeFooterLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <p className="text-center text-xs leading-6 text-[color:var(--muted)] md:text-left">
          CliniqFlow is an intake and documentation workflow platform with AI-assisted
          documentation and clinical decision-support. All clinical decisions remain the
          responsibility of licensed healthcare professionals.{" "}
          <Link href="/medical-disclaimer" className="font-medium text-[color:var(--accent)]">
            Medical disclaimer
          </Link>
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
