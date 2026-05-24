import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { resolvePostLoginPath } from "@/lib/tenancy/role-routing";
import {
  fetchIsPlatformAdmin,
  fetchIsPlatformSupport,
  syncPlatformRoleProfiles,
} from "@/lib/tenancy/platform-admin";
import type { TenantRole } from "@/lib/tenancy/types";

export async function resolveAuthRedirect(
  supabase: SupabaseClient,
  user: User,
) {
  await syncPlatformRoleProfiles(user);

  const isPlatformAdmin = await fetchIsPlatformAdmin(
    supabase,
    user.id,
    user.email,
  );
  const isPlatformSupport =
    !isPlatformAdmin &&
    (await fetchIsPlatformSupport(supabase, user.id, user.email));

  const { data: membership } = await supabase
    .from("tenant_memberships")
    .select("role")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const role = membership?.role as TenantRole | undefined;

  return resolvePostLoginPath({
    isPlatformAdmin,
    isPlatformSupport,
    role,
    hasMembership: Boolean(membership),
  });
}
