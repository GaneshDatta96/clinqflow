import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { resolveAuthRedirect } from "@/lib/auth/post-login";
import { createSupabaseServerClient } from "@/lib/db/supabase-server";
import { ROLE_LABELS, roleToPersona } from "@/lib/tenancy/role-routing";
import {
  fetchIsPlatformAdmin,
  fetchIsPlatformSupport,
} from "@/lib/tenancy/platform-admin";
import type { TenantRole } from "@/lib/tenancy/types";

export const GET = createApiHandler({
  route: "/api/auth/session-role",
  step: "session_role",
  rateLimit: "auth",
  handler: async () => {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return jsonOk({ path: "/login", role: null, persona: null, roleLabel: "Guest" });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonOk({ path: "/login", role: null, persona: null, roleLabel: "Guest" });
    }

    const path = await resolveAuthRedirect(supabase, user);

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
      .select("role, tenants ( name )")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    const role = (membership?.role as TenantRole | undefined) ?? undefined;
    const persona = isPlatformAdmin
      ? "god"
      : isPlatformSupport
        ? "platform_support"
        : role
          ? roleToPersona(role)
          : null;

    const roleLabel = isPlatformAdmin
      ? ROLE_LABELS.god
      : isPlatformSupport
        ? ROLE_LABELS.platform_support
        : role
          ? ROLE_LABELS[role]
          : "No organization";

    return jsonOk({
      path,
      role: role ?? null,
      roleLabel,
      isPlatformAdmin,
      isPlatformSupport,
      persona,
      tenantName: (() => {
        const tenants = membership?.tenants;
        if (!tenants) return undefined;
        if (Array.isArray(tenants)) return tenants[0]?.name;
        return (tenants as { name?: string }).name;
      })(),
    });
  },
});
