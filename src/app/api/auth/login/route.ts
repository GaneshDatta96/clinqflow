import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { unauthorized } from "@/lib/api/errors";
import { env } from "@/lib/env";
import { withCookieDomain } from "@/lib/routing/zones";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(128),
});

export const POST = createApiHandler({
  route: "/api/auth/login",
  step: "auth_login",
  rateLimit: "auth_sensitive",
  schema: loginSchema,
  handler: async ({ body }) => {
    const cookieStore = await cookies();
    const host = (await headers()).get("host");
    const supabase = createServerClient(
      env.supabaseUrl!,
      env.supabaseAnonKey!,
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email.trim().toLowerCase(),
      password: body.password,
    });

    if (error || !data.user) {
      throw unauthorized("Invalid email or password.");
    }

    return jsonOk({
      userId: data.user.id,
      emailConfirmed: Boolean(data.user.email_confirmed_at),
    });
  },
});
