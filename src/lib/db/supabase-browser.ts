"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { cookieDomainForHost } from "@/lib/routing/zones";

export function createSupabaseBrowserClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase auth is not configured.");
  }

  const domain =
    typeof window !== "undefined"
      ? cookieDomainForHost(window.location.host)
      : undefined;

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookieOptions: domain ? { domain } : undefined,
  });
}
