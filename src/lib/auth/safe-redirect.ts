const ALLOWED_PREFIXES = [
  "/app",
  "/invite",
  "/onboarding",
  "/login",
  "/signup",
] as const;

export function sanitizeAuthRedirect(next: string | null | undefined, fallback = "/app/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  const path = next.split("?")[0] ?? next;

  if (ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return next;
  }

  return fallback;
}
