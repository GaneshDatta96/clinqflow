import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import type { createSupabaseServerClient } from "@/lib/db/supabase-server";

export const ACTING_TENANT_COOKIE = "cliniqflow_acting_tenant_id";

function parsePlatformAdminEmails() {
  const raw = process.env.PLATFORM_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailConfiguredAsPlatformAdmin(email: string | undefined | null) {
  if (!email) return false;
  const allowed = parsePlatformAdminEmails();
  return allowed.includes(email.trim().toLowerCase());
}

export async function syncPlatformAdminProfile(user: User) {
  if (!isEmailConfiguredAsPlatformAdmin(user.email)) {
    return false;
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return false;
  }

  const { error } = await admin
    .from("profiles")
    .update({
      is_platform_admin: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "platform_admin.sync_failed",
        user_id: user.id,
        error: error.message,
      }),
    );
    return false;
  }

  return true;
}

export async function fetchIsPlatformAdmin(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  userId: string,
  email?: string | null,
) {
  if (isEmailConfiguredAsPlatformAdmin(email)) {
    return true;
  }

  const { data } = await supabase
    .from("profiles")
    .select("is_platform_admin")
    .eq("id", userId)
    .maybeSingle();

  return data?.is_platform_admin === true;
}

export async function requirePlatformAdmin() {
  const { requireUser } = await import("@/lib/tenancy/context");
  const { supabase, user } = await requireUser();
  await syncPlatformAdminProfile(user);

  const isAdmin = await fetchIsPlatformAdmin(supabase, user.id, user.email);

  if (!isAdmin) {
    const { forbidden } = await import("@/lib/api/errors");
    throw forbidden("Platform admin access required.");
  }

  return { supabase, user, isPlatformAdmin: true as const };
}
