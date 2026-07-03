import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { env, isAuthConfigured } from "@/lib/env";
import { withCookieDomain } from "@/lib/routing/zones";

export async function createSupabaseServerClient() {
  if (!isAuthConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const host = (await headers()).get("host");

  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, withCookieDomain(options, host));
          });
        } catch {
          // Called from Server Component — middleware handles refresh.
        }
      },
    },
  });
}
