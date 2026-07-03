/**
 * Subdomain zone routing for the 3-part deployment (single Next.js app):
 *   - marketing → cliniqflow.app        (public site, SEO, legal)
 *   - app       → app.cliniqflow.app     (workspace, billing, patient intake)
 *   - auth      → mail.cliniqflow.app    (signup, login, onboarding, invites, email)
 *
 * All three hosts point at the same deployment. `proxy.ts` enforces which zone
 * serves which path and redirects mismatches to the canonical host. Auth/session
 * cookies are issued for the shared parent domain so a login on `mail.*` is valid
 * on `app.*`.
 *
 * This module is client-safe: it only reads NEXT_PUBLIC_* env and exposes pure
 * helpers. Callers that need the request host pass it in explicitly.
 */

export type Zone = "marketing" | "app" | "auth";

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "cliniqflow.app";

export const ZONE_ORIGINS: Record<Zone, string> = {
  marketing:
    process.env.NEXT_PUBLIC_MARKETING_URL ?? `https://${ROOT_DOMAIN}`,
  app: process.env.NEXT_PUBLIC_APP_ORIGIN ?? `https://app.${ROOT_DOMAIN}`,
  auth: process.env.NEXT_PUBLIC_AUTH_ORIGIN ?? `https://mail.${ROOT_DOMAIN}`,
};

const APP_PATH_PREFIXES = [
  "/app",
  "/c",
  "/intake",
  "/questionnaire",
  "/dashboard",
  "/patients",
  "/settings",
];

const AUTH_PATH_PREFIXES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
  "/invite",
  "/auth",
];

function hostname(host?: string | null): string | null {
  if (!host) return null;
  return host.split(":")[0].trim().toLowerCase() || null;
}

function isNonProdHost(h: string): boolean {
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".vercel.app") ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(h)
  );
}

function hasPathPrefix(pathname: string, prefix: string): boolean {
  const p = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return pathname === p || pathname.startsWith(`${p}/`);
}

/** Classifies a pathname into the zone that should serve it. */
export function zoneForPath(pathname: string): Zone {
  if (APP_PATH_PREFIXES.some((p) => hasPathPrefix(pathname, p))) return "app";
  if (AUTH_PATH_PREFIXES.some((p) => hasPathPrefix(pathname, p))) return "auth";
  return "marketing";
}

/**
 * Maps a request host to its zone, or `null` when host-based enforcement should
 * be skipped (localhost dev, *.vercel.app previews, raw IPs).
 */
export function zoneForHost(host?: string | null): Zone | null {
  const h = hostname(host);
  if (!h || isNonProdHost(h)) return null;
  if (h.startsWith("app.")) return "app";
  if (h.startsWith("mail.")) return "auth";
  if (h === ROOT_DOMAIN || h === `www.${ROOT_DOMAIN}`) return "marketing";
  if (h.endsWith(`.${ROOT_DOMAIN}`)) return "marketing";
  return null;
}

/**
 * Cookie `domain` for cross-subdomain session sharing. Returns the parent domain
 * (`.cliniqflow.app`) for production hosts, or `undefined` for localhost/preview
 * so cookies stay host-only and local auth keeps working.
 */
export function cookieDomainForHost(host?: string | null): string | undefined {
  const h = hostname(host);
  if (!h || isNonProdHost(h)) return undefined;
  if (h === ROOT_DOMAIN || h.endsWith(`.${ROOT_DOMAIN}`)) {
    return `.${ROOT_DOMAIN}`;
  }
  return undefined;
}

/** Merges the cross-subdomain cookie domain into cookie options for a host. */
export function withCookieDomain<T extends { domain?: string }>(
  options: T | undefined,
  host?: string | null,
): T {
  const domain = cookieDomainForHost(host);
  const base = (options ?? {}) as T;
  return domain ? { ...base, domain } : base;
}

function joinUrl(origin: string, path: string): string {
  const base = origin.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** Absolute URL for a path on its canonical zone origin. */
export function zoneUrl(zone: Zone, path: string): string {
  return joinUrl(ZONE_ORIGINS[zone], path);
}

/** Absolute auth-zone URL (signup/login/onboarding/invite/verify emails). */
export function authUrl(path: string): string {
  return zoneUrl("auth", path);
}

/** Absolute app-zone URL (workspace + patient intake links). */
export function appUrl(path: string): string {
  return zoneUrl("app", path);
}

/** Absolute marketing-zone URL (public site). */
export function marketingUrl(path: string): string {
  return zoneUrl("marketing", path);
}
