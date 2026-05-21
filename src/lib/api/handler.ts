import { revalidatePath } from "next/cache";
import { ZodError, type ZodSchema } from "zod";
import { ApiError } from "@/lib/api/errors";
import { createRequestLog, logError, logInfo } from "@/lib/logging/logger";

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

        return Response.json(
          { error: error.message, code: error.code, details: error.details },
          { status: error.status },
        );
      }

      if (error instanceof ZodError) {
        return Response.json(
          {
            error: "Validation failed.",
            code: "validation_error",
            details: error.flatten(),
          },
          { status: 400 },
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
        { status: 500 },
      );
    }
  };
}

export function jsonOk<T>(payload: T, init?: ResponseInit) {
  return Response.json(payload, { status: 200, ...init });
}

export function jsonCreated<T>(payload: T) {
  return Response.json(payload, { status: 201 });
}

export function revalidateDashboard() {
  revalidatePath("/app/dashboard");
  revalidatePath("/dashboard");
}
