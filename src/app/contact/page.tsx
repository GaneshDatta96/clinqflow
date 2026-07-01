import { Mail, Phone } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { LEGAL } from "@/lib/legal/site";

export const metadata = buildPageMetadata({
  title: "Contact CliniqFlow",
  description: `Reach ${LEGAL.productName} for sales, billing, and support.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 pt-28 xl:px-10">
      <section className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <p className="section-label">Contact</p>
        <h1 className="display-font text-3xl font-semibold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          Questions about signing up, billing, or how {LEGAL.productName} fits your clinic?
          Reach {LEGAL.legalName} using the details below.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={`tel:${LEGAL.supportPhoneTel}`}
            className="flex items-start gap-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5 transition hover:border-[color:var(--accent)]/40"
          >
            <span className="rounded-full bg-[color:var(--accent)]/12 p-2.5 text-[color:var(--accent)]">
              <Phone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Phone</span>
              <span className="mt-1 block text-sm text-[color:var(--muted)]">
                {LEGAL.supportPhoneDisplay}
              </span>
            </span>
          </a>

          <a
            href={`mailto:${LEGAL.supportEmail}`}
            className="flex items-start gap-4 rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5 transition hover:border-[color:var(--accent)]/40"
          >
            <span className="rounded-full bg-[color:var(--accent)]/12 p-2.5 text-[color:var(--accent)]">
              <Mail className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold">Email</span>
              <span className="mt-1 block text-sm text-[color:var(--muted)]">
                {LEGAL.supportEmail}
              </span>
            </span>
          </a>
        </div>

        <div className="mt-8 space-y-2 text-sm leading-6 text-[color:var(--muted)]">
          <p>
            <strong className="text-[color:var(--foreground)]">Billing &amp; accounts:</strong>{" "}
            <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>
          </p>
          <p>
            <strong className="text-[color:var(--foreground)]">Privacy requests:</strong>{" "}
            <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>
          </p>
          <p>
            <strong className="text-[color:var(--foreground)]">Security reports:</strong>{" "}
            <a href={`mailto:${LEGAL.securityEmail}`}>{LEGAL.securityEmail}</a>
          </p>
          <p className="pt-2 text-xs">
            Operated by {LEGAL.legalName}, {LEGAL.entityDescription} ({LEGAL.jurisdiction}).
          </p>
        </div>
      </section>
    </div>
  );
}
