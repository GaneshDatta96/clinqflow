import { env } from "@/lib/env";

function paypalApiBase() {
  return env.paypalMode === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken() {
  if (!env.paypalClientId || !env.paypalClientSecret) {
    throw new Error("PayPal server credentials are not configured.");
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const auth = Buffer.from(`${env.paypalClientId}:${env.paypalClientSecret}`).toString(
    "base64",
  );

  const response = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal OAuth failed (${response.status})`);
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export async function verifyPayPalWebhookSignature(args: {
  headers: Headers;
  body: string;
}) {
  if (!env.paypalWebhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not configured.");
  }

  const token = await getPayPalAccessToken();
  const webhookEvent = JSON.parse(args.body) as Record<string, unknown>;

  const response = await fetch(
    `${paypalApiBase()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: args.headers.get("paypal-auth-algo"),
        cert_url: args.headers.get("paypal-cert-url"),
        transmission_id: args.headers.get("paypal-transmission-id"),
        transmission_sig: args.headers.get("paypal-transmission-sig"),
        transmission_time: args.headers.get("paypal-transmission-time"),
        webhook_id: env.paypalWebhookId,
        webhook_event: webhookEvent,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`PayPal signature verification failed (${response.status})`);
  }

  const result = (await response.json()) as { verification_status?: string };
  return result.verification_status === "SUCCESS";
}

export function extractPayPalPayerEmail(event: PayPalWebhookEvent) {
  const resource = event.resource ?? {};

  const direct =
    readString(resource.payer?.email_address) ??
    readString(resource.subscriber?.email_address) ??
    readString(resource.payer?.payer_info?.email);

  if (direct) {
    return direct.toLowerCase();
  }

  const purchaseUnits = resource.purchase_units;
  if (Array.isArray(purchaseUnits)) {
    for (const unit of purchaseUnits) {
      const email = readString(unit?.payee?.email_address);
      if (email) {
        return email.toLowerCase();
      }
    }
  }

  return null;
}

export function resolvePayPalPlanKey(event: PayPalWebhookEvent) {
  const resource = event.resource ?? {};
  const customId =
    readString(resource.custom_id) ??
    readString(resource.custom) ??
    readString(resource.invoice_id);

  if (customId?.includes("starter")) return "starter";
  if (customId?.includes("enterprise") || customId?.includes("scale")) {
    return "enterprise";
  }

  return env.paypalDefaultPlan;
}

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource?: Record<string, any>;
};

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export type { PayPalWebhookEvent };
