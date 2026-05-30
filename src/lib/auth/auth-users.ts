import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

export async function findAuthUserByEmail(email: string): Promise<User | null> {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return null;
  }

  const normalized = email.trim().toLowerCase();
  let page = 1;

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      throw error;
    }

    const match = data.users.find(
      (user) => user.email?.trim().toLowerCase() === normalized,
    );
    if (match) {
      return match;
    }

    if (data.users.length < 200) {
      break;
    }

    page += 1;
  }

  return null;
}

export function isEmailConfirmed(user: User) {
  return Boolean(user.email_confirmed_at);
}
