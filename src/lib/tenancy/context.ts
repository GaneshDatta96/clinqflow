import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/db/supabase-server";
import { forbidden, unauthorized } from "@/lib/api/errors";
import { hasPermission, type Permission } from "@/lib/tenancy/permissions";
import {
  ACTING_TENANT_COOKIE,
  fetchIsPlatformAdmin,
  syncPlatformAdminProfile,
} from "@/lib/tenancy/platform-admin";
import { type TenantContext, type TenantRole } from "@/lib/tenancy/types";
import { isAuthConfigured } from "@/lib/env";

export async function requireUser() {
  if (!isAuthConfigured()) {
    throw unauthorized("Authentication is not configured.");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw unauthorized("Authentication is not configured.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw unauthorized();
  }

  await syncPlatformAdminProfile(user);

  return { supabase, user };
}

async function resolveActingTenantId(explicitTenantId?: string) {
  if (explicitTenantId) return explicitTenantId;

  const cookieStore = await cookies();
  return cookieStore.get(ACTING_TENANT_COOKIE)?.value ?? null;
}

async function loadTenantById(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  tenantId: string,
) {
  const { data, error } = await supabase
    .from("tenants")
    .select("id, name, slug, plan_key, subscription_status")
    .eq("id", tenantId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getTenantMembership(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  userId: string,
  tenantId?: string,
) {
  let query = supabase
    .from("tenant_memberships")
    .select(
      `
      role,
      tenant_id,
      tenants (
        id,
        name,
        slug,
        plan_key,
        subscription_status
      )
    `,
    )
    .eq("user_id", userId);

  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error || !data?.tenants) {
    return null;
  }

  const tenant = Array.isArray(data.tenants) ? data.tenants[0] : data.tenants;

  return {
    role: data.role as TenantRole,
    tenant,
  };
}

function buildTenantContext(args: {
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan_key: string;
    subscription_status: string;
  };
  userId: string;
  role: TenantRole;
  isPlatformAdmin?: boolean;
}): TenantContext {
  return {
    tenantId: args.tenant.id,
    tenantSlug: args.tenant.slug,
    tenantName: args.tenant.name,
    userId: args.userId,
    role: args.role,
    planKey: args.tenant.plan_key,
    subscriptionStatus: args.tenant.subscription_status,
    isPlatformAdmin: args.isPlatformAdmin ?? false,
  };
}

export async function requireTenantContext(tenantId?: string): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
  context: TenantContext;
}> {
  const { supabase, user } = await requireUser();
  const isPlatformAdmin = await fetchIsPlatformAdmin(
    supabase,
    user.id,
    user.email,
  );
  const actingTenantId = await resolveActingTenantId(tenantId);

  if (isPlatformAdmin && actingTenantId) {
    const tenant = await loadTenantById(supabase, actingTenantId);

    if (!tenant) {
      throw forbidden("Selected organization not found.");
    }

    return {
      supabase,
      context: buildTenantContext({
        tenant,
        userId: user.id,
        role: "owner",
        isPlatformAdmin: true,
      }),
    };
  }

  if (isPlatformAdmin && !actingTenantId) {
    throw forbidden(
      "Platform admin: select an organization in Platform Admin before using the workspace.",
    );
  }

  const membership = await getTenantMembership(supabase, user.id, tenantId);

  if (!membership) {
    throw forbidden("You are not a member of this organization.");
  }

  return {
    supabase,
    context: buildTenantContext({
      tenant: membership.tenant,
      userId: user.id,
      role: membership.role,
    }),
  };
}

/** Tenant context for platform admins without requiring an acting tenant (admin console only). */
export async function requirePlatformAdminContext() {
  const { supabase, user } = await requireUser();
  const isPlatformAdmin = await fetchIsPlatformAdmin(
    supabase,
    user.id,
    user.email,
  );

  if (!isPlatformAdmin) {
    throw forbidden("Platform admin access required.");
  }

  return {
    supabase,
    user,
    context: {
      tenantId: "",
      tenantSlug: "",
      tenantName: "Platform Admin",
      userId: user.id,
      role: "owner" as TenantRole,
      planKey: "platform",
      subscriptionStatus: "active",
      isPlatformAdmin: true,
    } satisfies TenantContext,
  };
}

export async function tryGetTenantContext(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
  context: TenantContext;
} | null> {
  if (!isAuthConfigured()) {
    return null;
  }

  try {
    return await requireTenantContext();
  } catch {
    return null;
  }
}

export async function requirePermission(
  permission: Permission,
  tenantId?: string,
) {
  const { supabase, context } = await requireTenantContext(tenantId);

  if (context.isPlatformAdmin || hasPermission(context.role, permission)) {
    return { supabase, context };
  }

  throw forbidden(`Missing permission: ${permission}`);
}

export async function requireClinicAccess(clinicId: string) {
  const { supabase, context } = await requireTenantContext();

  let query = supabase
    .from("clinics")
    .select("id, tenant_id, slug, name, niche")
    .eq("id", clinicId)
    .is("deleted_at", null);

  if (!context.isPlatformAdmin) {
    query = query.eq("tenant_id", context.tenantId);
  }

  const { data: clinic, error } = await query.maybeSingle();

  if (error || !clinic) {
    throw forbidden("Clinic not found in your organization.");
  }

  if (context.isPlatformAdmin && clinic.tenant_id !== context.tenantId) {
    throw forbidden("Clinic does not belong to the selected organization.");
  }

  return {
    supabase,
    context: {
      ...context,
      clinicId: clinic.id,
      clinicSlug: clinic.slug,
      clinicName: clinic.name,
      niche: clinic.niche,
    },
  };
}
