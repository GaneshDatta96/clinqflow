import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Patient Experience", href: "/intake" },
  { label: "Practitioner View", href: "/dashboard" },
  { label: "Patients", href: "/app/patients" },
];

export function GlobalFooter() {
  return (
    <footer className="w-full border-t border-[color:var(--line)]/60 bg-white/50 px-6 py-16 backdrop-blur-sm xl:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="display-font text-[1.7rem] font-bold tracking-[-0.04em] text-[color:var(--accent)]">
            ModernHealth
          </div>
          <p className="text-sm text-[color:var(--muted)] opacity-70">
            Built for clinical excellence.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 md:items-end">
          <div className="flex flex-wrap justify-center gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--accent)]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://cal.com/ganesh-datta-bygktk/sales-throughput-session"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-92"
            >
              Request Demo
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
