import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}/login?error=missing_verification_token`);
  }

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
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    const errorPath =
      type === "recovery" ? "/reset-password" : "/login";
    return NextResponse.redirect(
      `${origin}${errorPath}?error=${encodeURIComponent(error.message)}`,
    );
  }

  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { resolveAuthRedirect } = await import("@/lib/auth/post-login");
    const path = await resolveAuthRedirect(supabase, user);
    return NextResponse.redirect(`${origin}${path}`);
  }

  return NextResponse.redirect(`${origin}/app/dashboard`);
}
