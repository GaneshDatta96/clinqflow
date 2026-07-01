import { ApiError } from "@/lib/api/errors";
import { apiErrorResponse } from "@/lib/api/error-response";
import { assertIpRateLimit } from "@/lib/api/upstash-rate-limit";

export async function GET(request: Request) {
  try {
    await assertIpRateLimit(request, "health", "/api/health");
  } catch (error) {
    if (error instanceof ApiError) {
      return apiErrorResponse(error);
    }

    throw error;
  }

  return Response.json({
    ok: true,
    service: "cliniqflow",
    timestamp: new Date().toISOString(),
  });
}
