export const paypalPublicConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? null,
  hostedButtonId: process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID ?? null,
};

export function isPayPalConfigured() {
  return Boolean(paypalPublicConfig.clientId && paypalPublicConfig.hostedButtonId);
}
