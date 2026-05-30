"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { isPayPalConfigured, paypalPublicConfig } from "@/lib/billing/paypal-public";

const PayPalHostedButton = dynamic(
  () =>
    import("@/components/billing/paypal-hosted-button").then(
      (mod) => mod.PayPalHostedButton,
    ),
  { ssr: false },
);

type PricingPlanActionsProps = {
  cta: string;
  href: string;
  highlighted: boolean;
  external?: boolean;
  showPayPal?: boolean;
};

export function PricingPlanActions({
  cta,
  href,
  highlighted,
  external = false,
  showPayPal = false,
}: PricingPlanActionsProps) {
  const payPalEnabled = showPayPal && isPayPalConfigured();

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

      {payPalEnabled ? (
        <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-3">
          <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Or pay with PayPal
          </p>
          <PayPalHostedButton
            clientId={paypalPublicConfig.clientId!}
            hostedButtonId={paypalPublicConfig.hostedButtonId!}
          />
        </div>
      ) : null}
    </div>
  );
}
