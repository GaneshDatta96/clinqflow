"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { LEGAL } from "@/lib/legal/site";
import { SkeletonRazorpayButton } from "@/components/ui/skeleton";
import {
  isRazorpayBillingConfigured,
  isRazorpayCheckoutConfigured,
  isRazorpayPaymentLinkConfigured,
} from "@/lib/billing/razorpay-public";

const RazorpayPaymentLinkButton = dynamic(
  () =>
    import("@/components/billing/razorpay-payment-link-button").then(
      (mod) => mod.RazorpayPaymentLinkButton,
    ),
  { ssr: false, loading: () => <SkeletonRazorpayButton /> },
);

const RazorpayCheckoutButton = dynamic(
  () =>
    import("@/components/billing/razorpay-checkout-button").then(
      (mod) => mod.RazorpayCheckoutButton,
    ),
  { ssr: false, loading: () => <SkeletonRazorpayButton /> },
);

export function BillingActions({
  currentPlan,
  userEmail,
}: {
  currentPlan: string;
  userEmail?: string | null;
}) {
  const canSubscribeStarter = currentPlan === "incomplete" || currentPlan === "trial";
  const starterPaymentLink =
    canSubscribeStarter && isRazorpayPaymentLinkConfigured("starter");
  const starterCheckout =
    canSubscribeStarter &&
    !starterPaymentLink &&
    isRazorpayCheckoutConfigured();
  const growthPaymentLink = isRazorpayPaymentLinkConfigured("growth");
  const growthCheckout = !growthPaymentLink && isRazorpayCheckoutConfigured();
  const hasPaymentOptions =
    starterPaymentLink ||
    starterCheckout ||
    growthPaymentLink ||
    growthCheckout;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[color:var(--muted)]">
        Current plan: <span className="font-semibold capitalize">{currentPlan}</span>
      </p>

      {isRazorpayBillingConfigured() && hasPaymentOptions ? (
        <div className="space-y-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Subscribe with Razorpay (INR)
          </p>
          <div className="flex flex-wrap gap-3">
            {starterPaymentLink ? (
              <RazorpayPaymentLinkButton
                plan="starter"
                label="Subscribe — Starter (monthly)"
                prefillEmail={userEmail}
                highlighted
              />
            ) : null}
            {starterCheckout ? (
              <RazorpayCheckoutButton
                plan="starter"
                label="Subscribe — Starter (monthly)"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
              />
            ) : null}
            {growthPaymentLink ? (
              <RazorpayPaymentLinkButton
                plan="growth"
                label="Subscribe — Growth (monthly)"
                prefillEmail={userEmail}
                highlighted={currentPlan !== "growth"}
              />
            ) : null}
            {growthCheckout ? (
              <RazorpayCheckoutButton
                plan="growth"
                label="Subscribe — Growth (monthly)"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${
                  currentPlan !== "growth"
                    ? "bg-[color:var(--accent)] text-white"
                    : "border border-[color:var(--line)]"
                }`}
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
          Online billing is not configured yet. Contact{" "}
          <a href={`mailto:${LEGAL.supportEmail}`} className="font-semibold text-[color:var(--accent)]">
            {LEGAL.supportEmail}
          </a>{" "}
          or call{" "}
          <a href={LEGAL.supportPhoneTel} className="font-semibold text-[color:var(--accent)]">
            {LEGAL.supportPhoneDisplay}
          </a>{" "}
          to activate your plan.
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
