"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = error.message.includes("Server Components render")
    ? "This page could not load your workspace. If you are in God mode, open the support console and select a clinic organization first."
    : error.message;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold">Workspace error</h1>
      <p className="text-sm text-[color:var(--muted)]">{message}</p>
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
          Reload
        </button>
        <a
          href="/app/billing"
          className="rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Open billing
        </a>
        <a
          href="/onboarding"
          className="rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Back to setup
        </a>
      </div>
    </div>
  );
}
