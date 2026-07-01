import { z } from "zod";

const serverSchema = z.object({
  SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  OPENROUTER_MODEL: z.string().min(1).optional(),
  PAYPAL_CLIENT_ID: z.string().min(1).optional(),
  PAYPAL_CLIENT_SECRET: z.string().min(1).optional(),
  PAYPAL_WEBHOOK_ID: z.string().min(1).optional(),
  PAYPAL_MODE: z.enum(["live", "sandbox"]).optional(),
  PAYPAL_DEFAULT_PLAN: z.enum(["starter", "growth", "enterprise", "trial"]).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  INTAKE_TOKEN_SECRET: z.string().min(32).optional(),
  APP_URL: z.string().url().optional(),
  PLATFORM_ADMIN_EMAILS: z.string().optional(),
  PLATFORM_SUPPORT_EMAILS: z.string().optional(),
  EMAIL_PROVIDER: z.enum(["zoho", "sendgrid", "resend"]).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  SENDGRID_API_KEY: z.string().min(1).optional(),
  ZOHO_ACCOUNTS_JSON: z.string().min(2).optional(),
  EMAIL_FROM: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(16).optional(),
  SENTRY_DSN: z.string().url().optional(),
  AI_PHI_MODE: z.enum(["restricted", "full"]).optional(),
  AI_BAA_VENDOR: z.string().min(1).optional(),
  AUDIT_RETENTION_DAYS: z.string().optional(),
});

function getSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    null
  );
}

export const env = {
  supabaseUrl: getSupabaseUrl(),
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? null,
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? null,
  openRouterModel: process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini",
  paypalClientId:
    process.env.PAYPAL_CLIENT_ID?.trim() ??
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ??
    null,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET?.trim() ?? null,
  paypalWebhookId: process.env.PAYPAL_WEBHOOK_ID?.trim() ?? null,
  paypalMode: (process.env.PAYPAL_MODE ?? "live") as "live" | "sandbox",
  paypalDefaultPlan: (process.env.PAYPAL_DEFAULT_PLAN ?? "growth") as
    | "starter"
    | "growth"
    | "enterprise"
    | "trial",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID?.trim() ?? null,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET?.trim() ?? null,
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET?.trim() ?? null,
  get intakeTokenSecret() {
    return resolveIntakeTokenSecret();
  },
  appUrl: process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  platformAdminEmails: (process.env.PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  platformSupportEmails: (process.env.PLATFORM_SUPPORT_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  emailProvider: (process.env.EMAIL_PROVIDER ?? "zoho") as
    | "zoho"
    | "sendgrid"
    | "resend",
  resendApiKey: process.env.RESEND_API_KEY ?? null,
  sendgridApiKey: process.env.SENDGRID_API_KEY ?? null,
  zohoAccountsJson: process.env.ZOHO_ACCOUNTS_JSON ?? null,
  emailFrom: process.env.EMAIL_FROM ?? "CliniqFlow",
  upstashRedisUrl: process.env.UPSTASH_REDIS_REST_URL ?? null,
  upstashRedisToken: process.env.UPSTASH_REDIS_REST_TOKEN ?? null,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null,
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? null,
  cronSecret: process.env.CRON_SECRET ?? null,
  sentryDsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? null,
  aiPhiMode: (process.env.AI_PHI_MODE ?? "restricted") as "restricted" | "full",
  aiBaaVendor: process.env.AI_BAA_VENDOR ?? null,
  auditRetentionDays: Number.parseInt(process.env.AUDIT_RETENTION_DAYS ?? "2190", 10),
  get emailEnabled() {
    if (this.emailProvider === "sendgrid") {
      return Boolean(this.sendgridApiKey);
    }
    if (this.emailProvider === "resend") {
      return Boolean(this.resendApiKey);
    }
    return Boolean(this.zohoAccountsJson);
  },
};

export function validateServerEnv() {
  serverSchema.parse({
    SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL,
    INTAKE_TOKEN_SECRET: process.env.INTAKE_TOKEN_SECRET,
    APP_URL: process.env.APP_URL,
    AI_PHI_MODE: process.env.AI_PHI_MODE,
    AI_BAA_VENDOR: process.env.AI_BAA_VENDOR,
  });
}

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function isAuthConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export function isUpstashConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export function isAiPhiRestricted() {
  return env.aiPhiMode !== "full";
}

/** Production OpenRouter calls require a documented BAA vendor. */
export function isAiVendorBaaConfigured() {
  return Boolean(env.aiBaaVendor);
}

export function canUseOpenRouterInProduction() {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return isAiPhiRestricted() && isAiVendorBaaConfigured();
}

function resolveIntakeTokenSecret() {
  const secret = process.env.INTAKE_TOKEN_SECRET;

  if (secret && secret.length >= 32) {
    return secret;
  }

  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-placeholder-secret-32chars-min";
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "INTAKE_TOKEN_SECRET must be set to at least 32 characters in production.",
    );
  }

  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 32) ??
    "dev-only-change-me-in-production-32chars"
  );
}

export function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "INTAKE_TOKEN_SECRET",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "CRON_SECRET",
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  if ((process.env.CRON_SECRET?.length ?? 0) < 32) {
    throw new Error("CRON_SECRET must be at least 32 characters in production.");
  }

  if (process.env.AI_PHI_MODE === "full" && !process.env.AI_BAA_VENDOR) {
    throw new Error(
      "AI_PHI_MODE=full requires AI_BAA_VENDOR in production (OpenRouter has no BAA).",
    );
  }
}
