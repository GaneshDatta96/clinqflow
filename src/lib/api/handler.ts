import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError, type ZodSchema } from "zod";
import { ApiError } from "@/lib/api/errors";
import {
  tenantCacheTag,
  type TenantCacheResource,
} from "@/lib/cache/tenant-cache";
import { apiErrorResponse } from "@/lib/api/error-response";
import { PRIVATE_NO_STORE } from "@/lib/http/cache-control";
import { createRequestLog, logError, logInfo } from "@/lib/logging/logger";
import {
  assertRouteRateLimit,
  type RateLimitBucket,
} from "@/lib/api/upstash-rate-limit";
import { requireUser } from "@/lib/tenancy/context";

type HandlerContext<TBody> = {
  request: Request;
  body: TBody;
  requestLog: ReturnType<typeof createRequestLog>;
  startedAt: number;
};

type RouteHandlerOptions<TBody> = {
  route: string;
  step: string;
  schema?: ZodSchema<TBody>;
  requireAuth?: boolean;
  rateLimit?: RateLimitBucket | false;
  handler: (ctx: HandlerContext<TBody>) => Promise<Response>;
};

export function createApiHandler<TBody = unknown>(
  options: RouteHandlerOptions<TBody>,
) {
  return async function routeHandler(request: Request) {
    const startedAt = Date.now();
    const requestLog = createRequestLog(request, options.route);

    logInfo({
      ...requestLog,
      message: "route.start",
      step: options.step,
      status: "started",
    });

    try {
      if (options.rateLimit !== false) {
        const bucket = options.rateLimit ?? "api_default";
        await assertRouteRateLimit(request, bucket, options.route);
      }

      if (options.requireAuth) {
        await requireUser();
      }

      let body = undefined as TBody;

      if (options.schema && request.method !== "GET") {
        const raw = await request.json();
        body = options.schema.parse(raw);
      }

      return await options.handler({
        request,
        body,
        requestLog,
        startedAt,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        logError({
          ...requestLog,
          message: "route.failed",
          step: options.step,
          status: "error",
          latency_ms: Date.now() - startedAt,
          error,
          metadata: { code: error.code },
        });

        return apiErrorResponse(error);
      }

      if (error instanceof ZodError) {
        return Response.json(
          {
            error: "Validation failed.",
            code: "validation_error",
            details: error.flatten(),
          },
          {
            status: 400,
            headers: { "Cache-Control": PRIVATE_NO_STORE },
          },
        );
      }

      logError({
        ...requestLog,
        message: "route.failed",
        step: options.step,
        status: "error",
        latency_ms: Date.now() - startedAt,
        error,
      });

      return Response.json(
        { error: "Internal server error.", code: "internal_error" },
        {
          status: 500,
          headers: { "Cache-Control": PRIVATE_NO_STORE },
        },
      );
    }
  };
}

function withPrivateNoStore(init?: ResponseInit): ResponseInit {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", PRIVATE_NO_STORE);
  return { ...init, headers };
}

export function jsonOk<T>(payload: T, init?: ResponseInit) {
  return Response.json(payload, withPrivateNoStore({ status: 200, ...init }));
}

export function jsonCreated<T>(payload: T) {
  return Response.json(payload, withPrivateNoStore({ status: 201 }));
}

export function invalidateTenantCache(
  tenantId: string,
  resources: TenantCacheResource[] = ["encounters", "entitlements"],
) {
  for (const resource of resources) {
    revalidateTag(tenantCacheTag(tenantId, resource), { expire: 0 });
  }
}

export function revalidateDashboard(tenantId?: string) {
  revalidatePath("/app/dashboard");
  revalidatePath("/dashboard");
  if (tenantId) {
    invalidateTenantCache(tenantId);
  }
}
