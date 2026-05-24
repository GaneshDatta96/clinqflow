import Link from "next/link";
import { LEGAL, LEGAL_PAGES } from "@/lib/legal/site";

type LegalPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function LegalPageShell({ title, description, children }: LegalPageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 pt-28 xl:px-10">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <p className="section-label">Legal</p>
        <h1 className="display-font text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{description}</p>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Last updated: {LEGAL.lastUpdated}
        </p>
        <article className="legal-prose mt-10">{children}</article>
      </section>

      <section className="rounded-[1.5rem] border border-[color:var(--line)] bg-white/60 px-6 py-5">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">Related policies</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {LEGAL_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="text-sm font-semibold text-[color:var(--accent)] transition hover:opacity-80"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
