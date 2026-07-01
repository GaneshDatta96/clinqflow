const GA_ORIGIN = "https://www.googletagmanager.com";
const RAZORPAY_CHECKOUT = "https://checkout.razorpay.com";
const RAZORPAY_FRAMES = "https://api.razorpay.com";

export function generateCspNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function buildContentSecurityPolicy(nonce: string, production: boolean) {
  if (!production) {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://openrouter.ai https://*.sentry.io https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://api.razorpay.com https://lumberjack.razorpay.com",
      "frame-ancestors 'none'",
      `frame-src 'self' ${RAZORPAY_FRAMES}`,
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");
  }

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${GA_ORIGIN} ${RAZORPAY_CHECKOUT}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://openrouter.ai https://*.sentry.io https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://api.razorpay.com https://lumberjack.razorpay.com",
    "frame-ancestors 'none'",
    `frame-src 'self' ${RAZORPAY_FRAMES}`,
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export const CSP_NONCE_HEADER = "x-nonce";
