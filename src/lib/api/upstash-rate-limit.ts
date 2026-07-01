import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ApiError, tooManyRequests } from "@/lib/api/errors";
import { logWarn } from "@/lib/logging/logger";

export { isUpstashConfigured } from "@/lib/env";

export type RateLimitBucket =
  | "auth"
  | "auth_sensitive"
  | "invite"
  | "ai_generate"
  | "public_intake"
  | "tenant_intake"
  | "api_default"
  | "api_read"
  | "write"
  | "read_heavy"
  | "billing"
  | "admin"
  | "webhook"
  | "health"
  | "cron";

const LIMITS: Record<
  RateLimitBucket,
  {
    requests: number;
    window: `${number} s` | `${number} m` | `${number} h` | `${number} d`;
  }
> = {
  auth: { requests: 20, window: "1 m" },
  auth_sensitive: { requests: 5, window: "1 m" },
  invite: { requests: 30, window: "1 h" },
  ai_generate: { requests: 60, window: "1 h" },
  public_intake: { requests: 30, window: "1 h" },
  tenant_intake: { requests: 120, window: "1 h" },
  api_default: { requests: 120, window: "1 m" },
  api_read: { requests: 180, window: "1 m" },
  write: { requests: 60, window: "1 m" },
  read_heavy: { requests: 10, window: "1 h" },
  billing: { requests: 20, window: "1 m" },
  admin: { requests: 60, window: "1 m" },
  webhook: { requests: 300, window: "1 m" },
  health: { requests: 60, window: "1 m" },
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

export function rateLimitIdentifier(request: Request, suffix?: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return suffix ? `${ip}:${suffix}` : ip;
}

/** Prefer authenticated user id when available so limits aren't shared across clinic staff on one IP. */
export async function resolveRateLimitIdentifier(request: Request, route: string) {
  const ip = rateLimitIdentifier(request);

  try {
    const { createSupabaseServerClient } = await import("@/lib/db/supabase-server");
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        return `${ip}:user:${user.id}:${route}`;
      }
    }
  } catch {
    // Fall back to IP + route when session cannot be resolved.
  }

  return rateLimitIdentifier(request, route);
}

export async function assertRateLimit(bucket: RateLimitBucket, identifier: string) {
  const limiter = getLimiter(bucket);

  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      const { serviceUnavailable } = await import("@/lib/api/errors");
      throw serviceUnavailable(
        "Rate limiting is temporarily unavailable. Try again shortly.",
      );
    }
    return;
  }

  try {
    const { success, reset } = await limiter.limit(identifier);
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));

    if (!success) {
      throw tooManyRequests(
        `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        retryAfter,
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (process.env.NODE_ENV === "production") {
      const { serviceUnavailable } = await import("@/lib/api/errors");
      throw serviceUnavailable(
        "Rate limiting is temporarily unavailable. Try again shortly.",
      );
    }

    logWarn({
      message: "rate_limit.unavailable",
      metadata: {
        bucket,
        error: error instanceof Error ? error.message : "unknown",
      },
    });
  }
}

export async function assertRouteRateLimit(
  request: Request,
  bucket: RateLimitBucket,
  route: string,
) {
  const identifier = await resolveRateLimitIdentifier(request, route);
  await assertRateLimit(bucket, identifier);
}

export async function assertTenantIntakeRateLimit(tenantId: string) {
  await assertRateLimit("tenant_intake", `tenant:${tenantId}`);
}

/** IP-only limits for webhooks, health checks, and other non-session endpoints. */
export async function assertIpRateLimit(
  request: Request,
  bucket: RateLimitBucket,
  route: string,
) {
  await assertRateLimit(bucket, rateLimitIdentifier(request, route));
}
