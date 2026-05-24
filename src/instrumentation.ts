import * as Sentry from "@sentry/nextjs";
import { assertProductionEnv } from "@/lib/env";

export async function register() {
  // Server-only secrets are validated on the Node runtime only. Running this on
  // Edge (middleware) caused MIDDLEWARE_INVOCATION_FAILED when vars were unset or
  // not yet applied to a deployment.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    assertProductionEnv();
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
