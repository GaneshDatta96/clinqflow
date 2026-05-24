import { unauthorized } from "@/lib/api/errors";
import { env } from "@/lib/env";

export function assertCronAuthorized(request: Request) {
  const secret = env.cronSecret;
  if (!secret) {
    throw unauthorized("CRON_SECRET is not configured.");
  }

  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw unauthorized("CRON_SECRET must be at least 32 characters.");
  }

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const headerSecret = request.headers.get("x-cron-secret");

  if (bearer !== secret && headerSecret !== secret) {
    throw unauthorized("Invalid cron secret.");
  }
}
