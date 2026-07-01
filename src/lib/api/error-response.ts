import { ApiError } from "@/lib/api/errors";
import { PRIVATE_NO_STORE } from "@/lib/http/cache-control";

export function apiErrorResponse(error: ApiError) {
  const headers = new Headers({ "Cache-Control": PRIVATE_NO_STORE });

  if (error.status === 429 && typeof error.details?.retryAfter === "number") {
    headers.set("Retry-After", String(error.details.retryAfter));
  }

  return Response.json(
    { error: error.message, code: error.code, details: error.details },
    { status: error.status, headers },
  );
}
