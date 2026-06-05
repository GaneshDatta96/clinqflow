"use client";

import Script from "next/script";
import { useCallback, useState, useTransition } from "react";
import { CreditCard, LoaderCircle } from "lucide-react";
import { isRazorpayCheckoutConfigured } from "@/lib/billing/razorpay-public";

type RazorpayCheckoutButtonProps = {
  plan: "starter" | "growth";
  label?: string;
  className?: string;
  onSuccess?: () => void;
};

type CreateOrderResponse = {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan: string;
  error?: string;
};

export function RazorpayCheckoutButton({
  plan,
  label,
  className,
  onSuccess,
}: RazorpayCheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pay = useCallback(() => {
    if (!isRazorpayCheckoutConfigured()) {
      setError("Razorpay is not configured.");
      return;
    }

    if (!scriptReady || typeof window.Razorpay === "undefined") {
      setError("Payment checkout is still loading. Try again in a moment.");
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const orderRes = await fetch("/api/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, currency: "INR" }),
        });

        const orderData = (await orderRes.json()) as CreateOrderResponse;

        if (!orderRes.ok) {
          throw new Error(orderData.error ?? "Unable to create payment order.");
        }

        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "CliniqFlow",
          description: `${plan.charAt(0).toUpperCase()}${plan.slice(1)} plan subscription`,
          order_id: orderData.order_id,
          handler: async (response: RazorpayPaymentSuccessResponse) => {
            try {
              const verifyRes = await fetch("/api/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = (await verifyRes.json()) as {
                success?: boolean;
                error?: string;
              };

              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error ?? "Payment verification failed.");
              }

              onSuccess?.();
              window.location.href = "/app/billing?checkout=razorpay_success";
            } catch (verifyError) {
              setError(
                verifyError instanceof Error
                  ? verifyError.message
                  : "Payment verification failed.",
              );
            }
          },
          modal: {
            ondismiss: () => {
              setError("Payment cancelled.");
            },
          },
          theme: { color: "#7C3AED" },
        };

        const RazorpayCtor = window.Razorpay;
        if (!RazorpayCtor) {
          throw new Error("Razorpay checkout is not available.");
        }

        const rzp = new RazorpayCtor(options);
        rzp.on("payment.failed", (response: RazorpayPaymentFailedResponse) => {
          setError(
            response.error?.description ??
              response.error?.reason ??
              "Payment failed. Please try again.",
          );
        });
        rzp.open();
      } catch (checkoutError) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : "Unable to start checkout.",
        );
      }
    });
  }, [onSuccess, plan, scriptReady]);

  if (!isRazorpayCheckoutConfigured()) {
    return null;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
        onError={() => setError("Failed to load Razorpay checkout.")}
      />
      <div className="space-y-2">
        <button
          type="button"
          disabled={isPending}
          onClick={pay}
          className={
            className ??
            "inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] px-5 py-2.5 text-sm font-semibold"
          }
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="h-4 w-4" />
          )}
          {label ?? `Pay with Razorpay (${plan})`}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </>
  );
}
