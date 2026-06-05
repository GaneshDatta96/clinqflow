import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
  "/api/health",
  "/api/webhooks",
  "/api/cron",
  "/api/auth/signup",
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
  let response = NextResponse.next({ request });

  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith("/api/") && !isPublicPath(pathname)) {
      return NextResponse.json(
        { error: "Service unavailable", code: "auth_not_configured" },
        { status: 503 },
      );
    }
    if (isAppPath(pathname) && !pathname.startsWith("/app/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "auth_not_configured");
      return NextResponse.redirect(url);
    }
    return response;
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
        response = NextResponse.next({ request });
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
      return NextResponse.json(
        { error: "Service unavailable", code: "auth_unavailable" },
        { status: 503 },
      );
    }
    return response;
  }

  if (user && AUTH_PATHS.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = isPlatformStaffEmail(user.email)
      ? "/app/admin"
      : "/app/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/onboarding" && isPlatformStaffEmail(user.email)) {
    const url = request.nextUrl.clone();
    url.pathname = "/app/admin";
    return NextResponse.redirect(url);
  }

  if (!user && isAppPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && pathname.startsWith("/api/") && !isPublicPath(pathname)) {
    return NextResponse.json(
      { error: "Unauthorized", code: "unauthorized" },
      { status: 401 },
    );
  }

  if (user && pathname.startsWith("/api/admin")) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
