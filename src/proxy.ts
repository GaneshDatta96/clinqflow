import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";
import {
  applyPrivateNoStoreHeaders,
  shouldApplyPrivateNoStore,
} from "@/lib/http/cache-control";
import {
  buildContentSecurityPolicy,
  CSP_NONCE_HEADER,
  generateCspNonce,
} from "@/lib/security/csp";

function finalizeResponse(
  response: NextResponse,
  pathname: string,
  nonce: string,
) {
  const production = process.env.NODE_ENV === "production";
  response.headers.set(
    "Content-Security-Policy",
    buildContentSecurityPolicy(nonce, production),
  );

  if (shouldApplyPrivateNoStore(pathname)) {
    applyPrivateNoStoreHeaders(response.headers);
  }

  return response;
}

function jsonResponse(
  body: object,
  status: number,
  pathname: string,
  nonce: string,
) {
  const headers = new Headers({ "Content-Type": "application/json" });
  return finalizeResponse(NextResponse.json(body, { status, headers }), pathname, nonce);
}

function isPlatformStaffEmail(email: string | undefined) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const adminEmails = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const supportEmails = (process.env.PLATFORM_SUPPORT_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(normalized) || supportEmails.includes(normalized);
}

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
  "/auth/verify",
  "/auth/confirm",
  "/onboarding",
  "/invite",
  "/contact",
  "/faq",
  "/how-patient-intake-works",
  "/ai-documentation",
  "/clinic-workflows",
  "/security",
  "/api/health",
  "/api/webhooks",
  "/api/cron",
  "/api/auth/signup",
  "/api/auth/login",
  "/api/auth/session-role",
  "/api/auth/resend-verification",
  "/api/auth/forgot-password",
  "/intake",
  "/questionnaire",
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

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  if (pathname.startsWith("/c/") || pathname.startsWith("/api/intake/public")) {
    return true;
  }
  return false;
}

function isAppPath(pathname: string) {
  return (
    pathname.startsWith("/app") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/patients") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/onboarding")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const nonce = generateCspNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);
  const enrichedRequest = new NextRequest(request, { headers: requestHeaders });

  let response = NextResponse.next({ request: enrichedRequest });

  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith("/api/") && !isPublicPath(pathname)) {
      return jsonResponse(
        { error: "Service unavailable", code: "auth_not_configured" },
        503,
        pathname,
        nonce,
      );
    }
    if (isAppPath(pathname) && !pathname.startsWith("/app/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "auth_not_configured");
      return finalizeResponse(NextResponse.redirect(url), pathname, nonce);
    }
    return finalizeResponse(response, pathname, nonce);
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request: enrichedRequest });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  let user: Awaited<
    ReturnType<typeof supabase.auth.getUser>
  >["data"]["user"] = null;

  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    if (pathname.startsWith("/api/") && !isPublicPath(pathname)) {
      return jsonResponse(
        { error: "Service unavailable", code: "auth_unavailable" },
        503,
        pathname,
        nonce,
      );
    }
    return finalizeResponse(response, pathname, nonce);
  }

  if (user && AUTH_PATHS.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = isPlatformStaffEmail(user.email)
      ? "/app/admin"
      : "/app/dashboard";
    return finalizeResponse(NextResponse.redirect(url), pathname, nonce);
  }

  if (user && pathname === "/onboarding" && isPlatformStaffEmail(user.email)) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/admin";
    return finalizeResponse(NextResponse.redirect(url), pathname, nonce);
  }

  if (!user && isAppPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return finalizeResponse(NextResponse.redirect(url), pathname, nonce);
  }

  if (!user && pathname.startsWith("/api/") && !isPublicPath(pathname)) {
    return jsonResponse(
      { error: "Unauthorized", code: "unauthorized" },
      401,
      pathname,
      nonce,
    );
  }

  if (user && pathname.startsWith("/api/admin")) {
    return finalizeResponse(response, pathname, nonce);
  }

  return finalizeResponse(response, pathname, nonce);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
