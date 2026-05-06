import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Patient Experience", href: "/intake" },
  { label: "Practitioner View", href: "/dashboard" },
  { label: "Patients", href: "/patients" },
];

export function GlobalFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-white/46 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-6 px-5 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between xl:px-12">
        <div className="max-w-xl">
          <p className="section-label">Modern Health</p>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted-strong)]">
            Custom patient intake flows for clinics that want calmer pre-visit
            operations, cleaner practitioner review, and a more polished first
            impression.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-wrap gap-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white/72 px-3.5 py-2 text-sm font-semibold text-[color:var(--muted-strong)] transition hover:bg-white hover:text-[color:var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://cal.com/ganesh-datta-bygktk/sales-throughput-session"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--foreground)] px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-92"
            >
              Request custom version
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <a
            href="https://ganeshdatta.me"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold tracking-[0.01em] text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
          >
            created by Ganesh
          </a>
        </div>
      </div>
    </footer>
  );
}
