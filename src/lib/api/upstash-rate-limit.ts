import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { tooManyRequests } from "@/lib/api/errors";

export { isUpstashConfigured } from "@/lib/env";

export type RateLimitBucket =
  | "auth"
  | "invite"
  | "ai_generate"
  | "public_intake"
  | "api_default"
  | "cron";

const LIMITS: Record<RateLimitBucket, { requests: number; window: `${number} s` | `${number} m` | `${number} h` | `${number} d` }> = {
  auth: { requests: 20, window: "1 m" },
  invite: { requests: 30, window: "1 h" },
  ai_generate: { requests: 60, window: "1 h" },
  public_intake: { requests: 30, window: "1 h" },
  api_default: { requests: 120, window: "1 m" },
  cron: { requests: 10, window: "1 m" },
};

const limiters = new Map<RateLimitBucket, Ratelimit>();

function getLimiter(bucket: RateLimitBucket) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  if (!limiters.has(bucket)) {
    const config = LIMITS[bucket];
    limiters.set(
      bucket,
      new Ratelimit({
        redis: new Redis({ url, token }),
        limiter: Ratelimit.slidingWindow(config.requests, config.window),
        prefix: `cliniqflow:${bucket}`,
      }),
    );
  }

  return limiters.get(bucket)!;
}

export async function assertRateLimit(bucket: RateLimitBucket, identifier: string) {
  const limiter = getLimiter(bucket);

  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      throw tooManyRequests("Rate limiting is not configured.");
    }
    return;
  }

  const { success, reset } = await limiter.limit(identifier);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    throw tooManyRequests(
      `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
    );
  }
}

export function rateLimitIdentifier(request: Request, suffix?: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return suffix ? `${ip}:${suffix}` : ip;
}
