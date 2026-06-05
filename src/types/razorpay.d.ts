interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayPaymentFailedResponse {
  error: {
    code: string;
    description: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentSuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare class Razorpay {
  constructor(options: RazorpayCheckoutOptions);
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayPaymentFailedResponse) => void): void;
}

interface Window {
  Razorpay?: typeof Razorpay;
}
