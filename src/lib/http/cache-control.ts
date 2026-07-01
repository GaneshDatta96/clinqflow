/** Prevents CDN/proxy/browser caching of authenticated or PHI-bearing responses. */
export const PRIVATE_NO_STORE =
  "private, no-store, no-cache" as const;

const PUBLIC_API_PREFIXES = [
  "/api/health",
  "/api/webhooks",
  "/api/cron",
];

const PUBLIC_PAGE_PREFIXES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/auth/verify",
  "/auth/confirm",
  "/privacy",
  "/terms",
  "/terms-of-use",
  "/cancellation",
  "/medical-disclaimer",
  "/ai-disclaimer",
  "/acceptable-use",
  "/dpa",
  "/security-policy",
  "/cookies",
  "/subprocessors",
  "/legal-liability",
  "/privacy-request",
];

function isPublicPage(pathname: string) {
  return PUBLIC_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isPublicApi(pathname: string) {
  return PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function shouldApplyPrivateNoStore(pathname: string): boolean {
  if (pathname.startsWith("/app")) return true;
  if (pathname.startsWith("/c/")) return true;
  if (pathname.startsWith("/invite")) return true;
  if (
    pathname === "/intake" ||
    pathname.startsWith("/intake/") ||
    pathname === "/questionnaire" ||
    pathname.startsWith("/questionnaire/")
  ) {
    return true;
  }
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/settings")
  ) {
    return true;
  }
  if (pathname.startsWith("/api/")) {
    if (isPublicApi(pathname)) return false;
    return true;
  }
  if (isPublicPage(pathname)) return false;
  return false;
}

export function applyPrivateNoStoreHeaders(headers: Headers) {
  headers.set("Cache-Control", PRIVATE_NO_STORE);
}
