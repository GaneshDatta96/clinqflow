import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

let adminClient: SupabaseClient | null = null;

/**
 * Service-role client — system jobs, intake token validation, webhooks only.
 * Never use for user-scoped reads/writes when RLS should apply.
 */
export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
