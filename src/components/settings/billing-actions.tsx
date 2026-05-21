"use client";

import { useState, useTransition } from "react";
import { CreditCard, LoaderCircle } from "lucide-react";

export function BillingActions({ currentPlan }: { currentPlan: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function startCheckout(plan: string) {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Checkout failed");
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Checkout failed");
      }
    });
  }

  function openPortal() {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/billing/portal", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Portal failed");
        if (data.url) window.location.href = data.url;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Portal failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[color:var(--muted)]">
        Current plan: <span className="font-semibold capitalize">{currentPlan}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {currentPlan === "trial" && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startCheckout("starter")}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            Upgrade to Starter
          </button>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={() => startCheckout("growth")}
          className="rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Growth plan
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={openPortal}
          className="rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
        >
          Manage subscription
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
