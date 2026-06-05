"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  isRazorpayPaymentLinkConfigured,
  type RazorpayBillablePlan,
} from "@/lib/billing/razorpay-public";

const RazorpayPaymentLinkButton = dynamic(
  () =>
    import("@/components/billing/razorpay-payment-link-button").then(
      (mod) => mod.RazorpayPaymentLinkButton,
    ),
  { ssr: false },
);

type PricingPlanActionsProps = {
  cta: string;
  href: string;
  highlighted: boolean;
  external?: boolean;
  showRazorpay?: boolean;
  razorpayPlan?: RazorpayBillablePlan;
};

export function PricingPlanActions({
  cta,
  href,
  highlighted,
  external = false,
  showRazorpay = false,
  razorpayPlan = "starter",
}: PricingPlanActionsProps) {
  const razorpayEnabled = showRazorpay && isRazorpayPaymentLinkConfigured(razorpayPlan);

  return (
    <div className="mt-8 space-y-3">
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${
            highlighted ? "btn-primary" : "btn-secondary"
          }`}
        >
          {cta}
        </a>
      ) : (
        <Link
          href={href}
          className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${
            highlighted ? "btn-primary" : "btn-secondary"
          }`}
        >
          {cta}
        </Link>
      )}

      {razorpayEnabled ? (
        <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-3">
          <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Or subscribe with Razorpay (INR)
          </p>
          <RazorpayPaymentLinkButton
            plan={razorpayPlan}
            label={`Subscribe — ${razorpayPlan.charAt(0).toUpperCase()}${razorpayPlan.slice(1)}`}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
              highlighted ? "btn-primary" : "btn-secondary"
            }`}
          />
        </div>
      ) : null}
    </div>
  );
}
