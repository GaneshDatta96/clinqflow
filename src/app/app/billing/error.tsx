"use client";

import Link from "next/link";

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-2xl font-semibold">Billing could not load</h1>
      <p className="text-sm text-[color:var(--muted)]">
        {error.message.includes("Server Components render")
          ? "We could not load your subscription details. Try again, or finish clinic setup if you just signed up."
          : error.message}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            try {
              reset();
            } catch {
              window.location.reload();
            }
          }}
          className="rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Reload billing
        </button>
        <Link
          href="/onboarding"
          className="rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Back to setup
        </Link>
        <Link
          href="/app/dashboard"
          className="rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
