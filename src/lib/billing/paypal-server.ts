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
    const hint =
      env.paypalMode === "live"
        ? " Check PAYPAL_CLIENT_ID/SECRET are Live credentials (not Sandbox)."
        : " Check PAYPAL_CLIENT_ID/SECRET are Sandbox credentials and PAYPAL_MODE=sandbox.";
    throw new Error(`PayPal OAuth failed (${response.status}).${hint}`);
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

function readPayPalTransmissionHeaders(headers: Headers) {
  const values: Record<string, string> = {};
  headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("paypal-")) {
      values[key.toLowerCase()] = value;
    }
  });

  return {
    auth_algo: values["paypal-auth-algo"] ?? null,
    cert_url: values["paypal-cert-url"] ?? null,
    transmission_id: values["paypal-transmission-id"] ?? null,
    transmission_sig: values["paypal-transmission-sig"] ?? null,
    transmission_time: values["paypal-transmission-time"] ?? null,
  };
}

export async function verifyPayPalWebhookSignature(args: {
  headers: Headers;
  body: string;
}) {
  const webhookId = env.paypalWebhookId?.trim();
  if (!webhookId) {
    throw new Error("PAYPAL_WEBHOOK_ID is not configured.");
  }

  const transmission = readPayPalTransmissionHeaders(args.headers);
  const missingHeaders = Object.entries(transmission)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingHeaders.length > 0) {
    return {
      verified: false,
      verificationStatus: "MISSING_HEADERS",
      missingHeaders,
      transmissionId: null,
    };
  }

  let webhookEvent: Record<string, unknown>;
  try {
    webhookEvent = JSON.parse(args.body) as Record<string, unknown>;
  } catch {
    return {
      verified: false,
      verificationStatus: "INVALID_JSON",
      missingHeaders: [],
      transmissionId: transmission.transmission_id,
    };
  }

  const token = await getPayPalAccessToken();

  const response = await fetch(
    `${paypalApiBase()}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: transmission.auth_algo,
        cert_url: transmission.cert_url,
        transmission_id: transmission.transmission_id,
        transmission_sig: transmission.transmission_sig,
        transmission_time: transmission.transmission_time,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`PayPal signature verification failed (${response.status})`);
  }

  const result = (await response.json()) as { verification_status?: string };
  return {
    verified: result.verification_status === "SUCCESS",
    verificationStatus: result.verification_status ?? "UNKNOWN",
    missingHeaders: [],
    transmissionId: transmission.transmission_id,
  };
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
