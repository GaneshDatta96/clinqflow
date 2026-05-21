import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isPlatformAdminEmail(email: string | undefined) {
  if (!email) return false;
  const allowed = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/auth/callback",
  "/onboarding",
  "/invite",
  "/api/health",
  "/api/webhooks",
  "/intake",
  "/questionnaire",
];

const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  // Public clinic intake: /c/[slug] or legacy /[slug] with token
  if (pathname.startsWith("/c/") || pathname.startsWith("/api/intake/public")) return true;
  if (/^\/[^/]+$/.test(pathname) && !pathname.startsWith("/app")) {
    return true;
  }
  if (pathname.startsWith("/api/intake/public")) return true;
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && AUTH_PATHS.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = isPlatformAdminEmail(user.email)
      ? "/app/admin"
      : "/app/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/onboarding" && isPlatformAdminEmail(user.email)) {
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
    // Platform admin APIs validated in route handlers
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
