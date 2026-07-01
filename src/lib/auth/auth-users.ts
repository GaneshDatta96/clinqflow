import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

export function isAuthDuplicateEmailError(error: { message?: string } | null) {
  const message = (error?.message ?? "").toLowerCase();
  return (
    message.includes("already been registered") ||
    message.includes("already registered") ||
    message.includes("user already exists")
  );
}

export async function findAuthUserByEmail(email: string): Promise<User | null> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  const normalized = email.trim().toLowerCase();

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", normalized)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile?.id) {
    return null;
  }

  const { data, error } = await admin.auth.admin.getUserById(profile.id);
  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export function isEmailConfirmed(user: User) {
  return Boolean(user.email_confirmed_at);
}
