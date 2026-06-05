"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { LEGAL } from "@/lib/legal/site";
import {
  isRazorpayBillingConfigured,
  isRazorpayPaymentLinkConfigured,
} from "@/lib/billing/razorpay-public";

const RazorpayPaymentLinkButton = dynamic(
  () =>
    import("@/components/billing/razorpay-payment-link-button").then(
      (mod) => mod.RazorpayPaymentLinkButton,
    ),
  { ssr: false },
);

export function BillingActions({
  currentPlan,
  userEmail,
}: {
  currentPlan: string;
  userEmail?: string | null;
}) {
  const showStarter =
    currentPlan === "trial" && isRazorpayPaymentLinkConfigured("starter");
  const showGrowth = isRazorpayPaymentLinkConfigured("growth");

  return (
    <div className="space-y-4">
      <p className="text-sm text-[color:var(--muted)]">
        Current plan: <span className="font-semibold capitalize">{currentPlan}</span>
      </p>

      {isRazorpayBillingConfigured() && (showStarter || showGrowth) ? (
        <div className="space-y-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Subscribe with Razorpay (INR)
          </p>
          <div className="flex flex-wrap gap-3">
            {showStarter ? (
              <RazorpayPaymentLinkButton
                plan="starter"
                label="Subscribe — Starter (monthly)"
                prefillEmail={userEmail}
                highlighted
              />
            ) : null}
            {showGrowth ? (
              <RazorpayPaymentLinkButton
                plan="growth"
                label="Subscribe — Growth (monthly)"
                prefillEmail={userEmail}
                highlighted={currentPlan !== "growth"}
              />
            ) : null}
          </div>
          <p className="text-xs text-[color:var(--muted)]">
            Subscriptions renew monthly via Razorpay. Use the same email as your CliniqFlow
            account so your workspace activates automatically. To cancel, use the Razorpay
            subscription email receipts or contact{" "}
            <a href={`mailto:${LEGAL.supportEmail}`} className="font-semibold text-[color:var(--accent)]">
              {LEGAL.supportEmail}
            </a>
            .
          </p>
        </div>
      ) : (
        <p className="text-sm text-[color:var(--muted)]">
          Billing is not configured. Contact support to upgrade your plan.
        </p>
      )}

      <p className="text-xs text-[color:var(--muted)]">
        Subscription changes are subject to our{" "}
        <Link href="/cancellation" className="font-semibold text-[color:var(--accent)]">
          Cancellation Policy
        </Link>
        .
      </p>
    </div>
  );
}
