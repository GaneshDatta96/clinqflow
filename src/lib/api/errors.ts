export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function unauthorized(message = "Unauthorized") {
  return new ApiError(message, 401, "unauthorized");
}

export function forbidden(message = "Forbidden") {
  return new ApiError(message, 403, "forbidden");
}

export function notFound(message = "Not found") {
  return new ApiError(message, 404, "not_found");
}

export function badRequest(message: string, details?: Record<string, unknown>) {
  return new ApiError(message, 400, "bad_request", details);
}

export function conflict(message: string) {
  return new ApiError(message, 409, "conflict");
}

export function tooManyRequests(message = "Rate limit exceeded") {
  return new ApiError(message, 429, "rate_limited");
}

export function internal(message = "Internal server error") {
  return new ApiError(message, 500, "internal_error");
}
