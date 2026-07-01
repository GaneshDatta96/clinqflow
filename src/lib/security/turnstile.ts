import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";
import { badRequest, serviceUnavailable } from "@/lib/api/errors";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

let redis: Redis | null = null;

function getRedis() {
  if (!env.upstashRedisUrl || !env.upstashRedisToken) {
    return null;
  }

  if (!redis) {
    redis = new Redis({
      url: env.upstashRedisUrl,
      token: env.upstashRedisToken,
    });
  }

  return redis;
}

export function isTurnstileConfigured() {
  return Boolean(env.turnstileSiteKey && env.turnstileSecretKey);
}

export async function verifyTurnstileToken(token: string, remoteIp?: string | null) {
  const secret = env.turnstileSecretKey;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw serviceUnavailable("CAPTCHA verification is not configured.");
    }
    return true;
  }

  if (!token.trim()) {
    return false;
  }

  const response = await fetch(VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      response: token,
      remoteip: remoteIp ?? undefined,
    }),
  });

  if (!response.ok) {
    return false;
  }

  const payload = (await response.json()) as { success?: boolean };
  return payload.success === true;
}

export async function assertTurnstileToken(token: string | null | undefined, remoteIp?: string | null) {
  const valid = await verifyTurnstileToken(token ?? "", remoteIp);
  if (!valid) {
    throw badRequest("CAPTCHA verification failed. Please try again.", {
      code: "captcha_invalid",
    });
  }
}

export async function getPublicIntakeAttemptCount(ip: string) {
  const client = getRedis();
  if (!client) {
    return 0;
  }

  const count = await client.get<number>(`cliniqflow:public_intake_attempts:${ip}`);
  return count ?? 0;
}

export async function incrementPublicIntakeAttemptCount(ip: string) {
  const client = getRedis();
  if (!client) {
    return 0;
  }

  const key = `cliniqflow:public_intake_attempts:${ip}`;
  const count = await client.incr(key);

  if (count === 1) {
    await client.expire(key, 60 * 60);
  }

  return count;
}
