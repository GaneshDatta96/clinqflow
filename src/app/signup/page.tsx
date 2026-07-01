import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign up",
  description: "Create your CliniqFlow clinic account.",
  path: "/signup",
  robots: NOINDEX_ROBOTS,
});

const highlights = [
  {
    title: "Structured intake before the visit",
    body: "Send secure links so patients complete specialty questionnaires at home.",
  },
  {
    title: "Review-first documentation",
    body: "Turn intake into draft SOAP notes your team approves — not auto-published charts.",
  },
  {
    title: "Built for independent clinics",
    body: "Set up your workspace, invite staff, and subscribe when you are ready to go live.",
  },
] as const;

export default function SignupPage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.12),_transparent_60%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-12 lg:grid-cols-[1fr_28rem] lg:gap-16 lg:py-20">
        <section className="hidden lg:block">
          <p className="section-label">CliniqFlow for clinics</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)]">
            A calmer way to prepare for every appointment.
          </h1>
          <p className="mt-4 max-w-lg leading-7 text-[color:var(--muted)]">
            Create your account in under a minute, verify your email, and finish
            onboarding to start sending intake links to patients.
          </p>

          <ul className="mt-10 space-y-5">
            {highlights.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-[color:var(--line)] bg-white/70 p-5"
              >
                <p className="font-semibold text-[color:var(--foreground)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="w-full">
          <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="mb-8 space-y-2 lg:hidden">
              <p className="section-label">Get started</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h1>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                Create your clinic workspace, then subscribe to a plan.
              </p>
            </div>

            <div className="mb-8 hidden space-y-2 lg:block">
              <p className="section-label">Get started</p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create your account
              </h1>
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                We will email you a quick verification link to unlock onboarding.
              </p>
            </div>

            <Suspense
              fallback={
                <p className="text-sm text-[color:var(--muted)]">Loading…</p>
              }
            >
              <AuthForm mode="signup" />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-[color:var(--muted)]">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="font-semibold text-[color:var(--accent)]">
              Terms of Service
            </Link>
            ,{" "}
            <Link
              href="/terms-of-use"
              className="font-semibold text-[color:var(--accent)]"
            >
              Terms of Use
            </Link>
            ,{" "}
            <Link
              href="/acceptable-use"
              className="font-semibold text-[color:var(--accent)]"
            >
              Acceptable Use Policy
            </Link>
            ,{" "}
            <Link
              href="/ai-disclaimer"
              className="font-semibold text-[color:var(--accent)]"
            >
              AI Disclaimer
            </Link>
            , and{" "}
            <Link href="/privacy" className="font-semibold text-[color:var(--accent)]">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-4 text-center text-sm text-[color:var(--muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[color:var(--accent)]">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
