"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { getNicheOptions } from "@/lib/clinics/store";
import { getErrorMessage, readApiError } from "@/lib/api/client";

type OnboardingPhase = "form" | "redirecting";

export default function OnboardingPage() {
  const niches = getNicheOptions();
  const [organizationName, setOrganizationName] = useState("");
  const [niche, setNiche] = useState(niches[0]?.niche ?? "general_practice");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<OnboardingPhase>("form");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (phase !== "form") {
      return;
    }

    setPhase("redirecting");
    setError(null);

    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: organizationName,
          niche,
        }),
      });

      if (!response.ok) {
        throw await readApiError(response);
      }

      window.location.assign("/app/billing?onboarded=1");
    } catch (err) {
      setPhase("form");
      setError(getErrorMessage(err, "Onboarding failed."));
    }
  }

  const pending = phase === "redirecting";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Set up your clinic</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Create your organization workspace and default intake configuration.
      </p>

      {pending ? (
        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-4 text-sm text-[color:var(--muted)]">
          <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-[color:var(--accent)]" />
          <div>
            <p className="font-semibold text-[color:var(--foreground)]">
              Workspace ready — opening billing
            </p>
            <p className="mt-1">
              Choose a plan to activate your clinic. This only takes a moment.
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Organization name</span>
          <input
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
            disabled={pending}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Primary specialty</span>
          <select
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={pending}
          >
            {niches.map((item) => (
              <option key={item.niche} value={item.niche}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Opening billing…
            </>
          ) : (
            "Create workspace & continue"
          )}
        </button>
      </form>
    </div>
  );
}
