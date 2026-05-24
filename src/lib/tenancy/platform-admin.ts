import type { User } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import type { createSupabaseServerClient } from "@/lib/db/supabase-server";
import { env } from "@/lib/env";

export const ACTING_TENANT_COOKIE = "cliniqflow_acting_tenant_id";

function parsePlatformAdminEmails() {
  return env.platformAdminEmails;
}

function parsePlatformSupportEmails() {
  return env.platformSupportEmails;
}

export function isEmailConfiguredAsPlatformAdmin(email: string | undefined | null) {
  if (!email) return false;
  return parsePlatformAdminEmails().includes(email.trim().toLowerCase());
}

export function isEmailConfiguredAsPlatformSupport(email: string | undefined | null) {
  if (!email) return false;
  return parsePlatformSupportEmails().includes(email.trim().toLowerCase());
}

export function isEmailConfiguredAsPlatformStaff(email: string | undefined | null) {
  return (
    isEmailConfiguredAsPlatformAdmin(email) ||
    isEmailConfiguredAsPlatformSupport(email)
  );
}

export async function syncPlatformAdminProfile(user: User) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return false;
  }

  const shouldBeAdmin = isEmailConfiguredAsPlatformAdmin(user.email);

  const { error } = await admin
    .from("profiles")
    .update({
      is_platform_admin: shouldBeAdmin,
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

  return shouldBeAdmin;
}

export async function syncPlatformSupportProfile(user: User) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return false;
  }

  const shouldBeSupport =
    !isEmailConfiguredAsPlatformAdmin(user.email) &&
    isEmailConfiguredAsPlatformSupport(user.email);

  const { error } = await admin
    .from("profiles")
    .update({
      is_platform_support: shouldBeSupport,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error(
      JSON.stringify({
        level: "error",
        message: "platform_support.sync_failed",
        user_id: user.id,
        error: error.message,
      }),
    );
    return false;
  }

  return shouldBeSupport;
}

export async function syncPlatformRoleProfiles(user: User) {
  await syncPlatformAdminProfile(user);
  await syncPlatformSupportProfile(user);
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

export async function fetchIsPlatformSupport(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  userId: string,
  email?: string | null,
) {
  if (isEmailConfiguredAsPlatformAdmin(email)) {
    return false;
  }

  if (isEmailConfiguredAsPlatformSupport(email)) {
    return true;
  }

  const { data } = await supabase
    .from("profiles")
    .select("is_platform_support")
    .eq("id", userId)
    .maybeSingle();

  return data?.is_platform_support === true;
}

export async function fetchIsPlatformStaff(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  userId: string,
  email?: string | null,
) {
  const isAdmin = await fetchIsPlatformAdmin(supabase, userId, email);
  if (isAdmin) return true;
  return fetchIsPlatformSupport(supabase, userId, email);
}

export async function requirePlatformAdmin() {
  const { requireUser } = await import("@/lib/tenancy/context");
  const { supabase, user } = await requireUser();
  await syncPlatformRoleProfiles(user);

  const isAdmin = await fetchIsPlatformAdmin(supabase, user.id, user.email);

  if (!isAdmin) {
    const { forbidden } = await import("@/lib/api/errors");
    throw forbidden("Platform admin (God mode) access required.");
  }

  return { supabase, user, isPlatformAdmin: true as const, isPlatformSupport: false as const };
}

export async function requirePlatformStaff() {
  const { requireUser } = await import("@/lib/tenancy/context");
  const { supabase, user } = await requireUser();
  await syncPlatformRoleProfiles(user);

  const isAdmin = await fetchIsPlatformAdmin(supabase, user.id, user.email);
  const isSupport = isAdmin
    ? false
    : await fetchIsPlatformSupport(supabase, user.id, user.email);

  if (!isAdmin && !isSupport) {
    const { forbidden } = await import("@/lib/api/errors");
    throw forbidden("Platform staff access required.");
  }

  return {
    supabase,
    user,
    isPlatformAdmin: isAdmin,
    isPlatformSupport: isSupport,
  };
}
