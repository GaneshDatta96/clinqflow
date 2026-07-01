"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getNicheOptions } from "@/lib/clinics/store";
import { getErrorMessage, readApiError } from "@/lib/api/client";

export default function OnboardingPage() {
  const router = useRouter();
  const niches = getNicheOptions();
  const [organizationName, setOrganizationName] = useState("");
  const [niche, setNiche] = useState(niches[0]?.niche ?? "general_practice");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: organizationName,
          niche,
        }),
      });

      if (!response.ok) {
        throw await readApiError(response);
      }

      router.push("/app/billing");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, "Onboarding failed."));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Set up your clinic</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Create your organization workspace and default intake configuration.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-semibold">Organization name</span>
          <input
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Primary specialty</span>
          <select
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
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
          className="w-full rounded-full bg-[color:var(--accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Creating workspace…" : "Continue to billing"}
        </button>
      </form>
    </div>
  );
}
