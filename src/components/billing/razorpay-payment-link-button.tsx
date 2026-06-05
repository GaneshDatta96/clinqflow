"use client";

import { ExternalLink } from "lucide-react";
import {
  getRazorpayPaymentLink,
  isRazorpayPaymentLinkConfigured,
  type RazorpayBillablePlan,
} from "@/lib/billing/razorpay-public";

type RazorpayPaymentLinkButtonProps = {
  plan: RazorpayBillablePlan;
  label?: string;
  className?: string;
  prefillEmail?: string | null;
  highlighted?: boolean;
};

export function RazorpayPaymentLinkButton({
  plan,
  label,
  className,
  prefillEmail,
  highlighted = false,
}: RazorpayPaymentLinkButtonProps) {
  if (!isRazorpayPaymentLinkConfigured(plan)) {
    return null;
  }

  const href = getRazorpayPaymentLink(plan, { email: prefillEmail });
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={
        className ??
        `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${
          highlighted
            ? "bg-[color:var(--accent)] text-white"
            : "border border-[color:var(--line)]"
        }`
      }
    >
      <ExternalLink className="h-4 w-4" />
      {label ?? `Subscribe with Razorpay (${plan})`}
    </a>
  );
}
