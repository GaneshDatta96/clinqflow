"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Mail, Sparkles } from "lucide-react";

const steps = [
  "Open the email from CliniqFlow",
  "Click the confirmation link",
  "Sign in and finish clinic setup",
] as const;

export function SignupSuccessPanel(props: {
  email: string;
  fullName: string;
  resendPending: boolean;
  resendMessage: string | null;
  onResend: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-[1.75rem] border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-200/40 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-violet-200/40 blur-2xl"
        />

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Account created
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                {props.fullName.trim()
                  ? `Almost there, ${props.fullName.trim().split(/\s+/)[0]}`
                  : "Almost there"}
              </h2>
              <p className="max-w-md leading-7 text-[color:var(--muted)]">
                We sent a verification link to finish setting up your clinic workspace.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-white/90 px-4 py-3">
            <Mail className="h-5 w-5 shrink-0 text-[color:var(--accent)]" />
            <p className="truncate text-sm font-medium text-[color:var(--foreground)]">
              {props.email}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-[color:var(--line)] bg-white/80 p-6">
        <p className="text-sm font-semibold text-[color:var(--foreground)]">
          What happens next
        </p>
        <ol className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm leading-6 text-[color:var(--muted)]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent)]/10 text-xs font-semibold text-[color:var(--accent)]">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-6 text-[color:var(--muted)]">
          Check your spam or promotions folder if you do not see it within a minute.
        </p>
      </div>

      {props.resendMessage ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {props.resendMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={props.resendPending}
          onClick={props.onResend}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {props.resendPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Resend verification email"
          )}
        </button>
        <Link
          href="/login"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          Go to sign in
        </Link>
      </div>
    </motion.div>
  );
}
