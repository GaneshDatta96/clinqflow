export type RazorpayBillablePlan = "starter" | "growth";

export const razorpayPublicConfig = {
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? null,
  starterPaymentLink: process.env.NEXT_PUBLIC_RAZORPAY_STARTER_PAYMENT_LINK ?? null,
  growthPaymentLink: process.env.NEXT_PUBLIC_RAZORPAY_GROWTH_PAYMENT_LINK ?? null,
} as const;

const PAYMENT_LINKS: Record<RazorpayBillablePlan, string | null> = {
  starter: razorpayPublicConfig.starterPaymentLink,
  growth: razorpayPublicConfig.growthPaymentLink,
};

export function isRazorpayCheckoutConfigured() {
  return Boolean(razorpayPublicConfig.keyId);
}

export function isRazorpayPaymentLinkConfigured(plan: RazorpayBillablePlan) {
  return Boolean(PAYMENT_LINKS[plan]);
}

export function isRazorpayBillingConfigured() {
  return (
    isRazorpayCheckoutConfigured() ||
    isRazorpayPaymentLinkConfigured("starter") ||
    isRazorpayPaymentLinkConfigured("growth")
  );
}

export function getRazorpayPaymentLink(
  plan: RazorpayBillablePlan,
  prefill?: { email?: string | null },
) {
  const base = PAYMENT_LINKS[plan];
  if (!base) {
    return null;
  }

  if (!prefill?.email) {
    return base;
  }

  const url = new URL(base);
  url.searchParams.set("email", prefill.email);
  return url.toString();
}
