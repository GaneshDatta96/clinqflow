export type ApiErrorCode =
  | "rate_limited"
  | "unauthorized"
  | "forbidden"
  | "validation_error"
  | "service_unavailable"
  | "internal_error"
  | "bad_request"
  | "not_found"
  | "conflict"
  | string;

export type ApiErrorBody = {
  error?: string;
  code?: ApiErrorCode;
  details?: {
    retryAfter?: number;
    [key: string]: unknown;
  };
};

export class ClientApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly retryAfter?: number;
  readonly details?: ApiErrorBody["details"];

  constructor(
    message: string,
    status: number,
    code: string,
    retryAfter?: number,
    details?: ApiErrorBody["details"],
  ) {
    super(message);
    this.name = "ClientApiError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
    this.details = details;
  }
}

export function isRateLimitedError(error: unknown): error is ClientApiError {
  return error instanceof ClientApiError && error.code === "rate_limited";
}

export function isServiceUnavailableError(error: unknown): error is ClientApiError {
  return error instanceof ClientApiError && error.code === "service_unavailable";
}

export function formatRateLimitMessage(retryAfter?: number) {
  if (retryAfter && retryAfter > 0) {
    return `Too many requests. Please wait ${retryAfter} seconds and try again.`;
  }
  return "Too many requests. Please wait a moment and try again.";
}

function parseRetryAfter(response: Response, body: ApiErrorBody) {
  if (typeof body.details?.retryAfter === "number") {
    return body.details.retryAfter;
  }

  const header = response.headers.get("Retry-After");
  if (!header) return undefined;

  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) ? seconds : undefined;
}

export async function readApiError(response: Response): Promise<ClientApiError> {
  let body: ApiErrorBody = {};

  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = {};
  }

  const code = body.code ?? "unknown_error";
  const retryAfter = parseRetryAfter(response, body);
  let message = body.error ?? "Request failed";

  if (code === "rate_limited") {
    message = formatRateLimitMessage(retryAfter);
  } else if (code === "service_unavailable") {
    message =
      body.error ?? "Service temporarily unavailable. Please try again shortly.";
  }

  return new ClientApiError(message, response.status, code, retryAfter, body.details);
}

export async function fetchApi<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw await readApiError(response);
  }

  return response.json() as Promise<T>;
}

export async function fetchApiVoid(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw await readApiError(response);
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ClientApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
