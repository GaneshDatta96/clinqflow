"use client";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold">Workspace error</h1>
      <p className="text-sm text-[color:var(--muted)]">
        {error.message.includes("Server Components render")
          ? "This page could not load your workspace. If you are in God mode, open the support console and select a clinic organization first."
          : error.message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="w-fit rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Reload
      </button>
    </div>
  );
}
