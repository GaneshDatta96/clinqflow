import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/errors";
import { assertIpRateLimit } from "@/lib/api/upstash-rate-limit";
import { withCookieDomain } from "@/lib/routing/zones";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const host = request.headers.get("host");

  try {
    await assertIpRateLimit(request, "auth_sensitive", "/auth/callback");
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
    throw error;
  }

  const code = searchParams.get("code");
  const { sanitizeAuthRedirect } = await import("@/lib/auth/safe-redirect");
  const next = sanitizeAuthRedirect(searchParams.get("next"));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, withCookieDomain(options, host));
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { resolveAuthRedirect } = await import("@/lib/auth/post-login");
        const path = await resolveAuthRedirect(supabase, user);
        return NextResponse.redirect(`${origin}${path}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
