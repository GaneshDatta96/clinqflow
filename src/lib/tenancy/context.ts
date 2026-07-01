import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/db/supabase-server";
import { forbidden, unauthorized } from "@/lib/api/errors";
import { hasPermission, type Permission } from "@/lib/tenancy/permissions";
import { getActiveTenantIdFromCookies } from "@/lib/tenancy/active-tenant";
import { getActingTenantIdFromCookies } from "@/lib/tenancy/acting-tenant";
import {
  resolvePlatformRoles,
  syncPlatformRoleProfiles,
} from "@/lib/tenancy/platform-admin";
import { type TenantContext, type TenantRole } from "@/lib/tenancy/types";
import { isAuthConfigured } from "@/lib/env";
import { isActiveSubscriptionStatus } from "@/lib/billing/plans";
import { resolveDbClientForContext } from "@/lib/security/platform-staff";
import { writeAuditLog } from "@/services/audit.service";

export const requireUser = cache(async () => {
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

  if (process.env.NODE_ENV === "production" && !user.email_confirmed_at) {
    throw unauthorized("Email address must be verified.");
  }

  await syncPlatformRoleProfiles(user);

  return { supabase, user };
});

async function resolveActingTenantId(explicitTenantId?: string) {
  if (explicitTenantId) return explicitTenantId;
  return getActingTenantIdFromCookies();
}

async function resolveActiveTenantId(explicitTenantId?: string) {
  if (explicitTenantId) return explicitTenantId;
  return (await getActiveTenantIdFromCookies()) ?? undefined;
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

export async function logPhiAccessIfPlatformStaff(args: {
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
  context: TenantContext;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!args.context.isPlatformAdmin) {
    return;
  }

  await writeAuditLog({
    supabase: args.supabase,
    tenantId: args.context.tenantId,
    actorId: args.context.userId,
    action: args.action,
    resourceType: args.resourceType,
    resourceId: args.resourceId,
    metadata: args.metadata,
  });
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
  isPlatformSupport?: boolean;
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
    isPlatformSupport: args.isPlatformSupport ?? false,
  };
}

export const requireTenantContext = cache(async (tenantId?: string) => {
  const { supabase, user } = await requireUser();
  const { isPlatformAdmin, isPlatformSupport } = await resolvePlatformRoles(
    supabase,
    user.id,
    user.email,
  );
  const isPlatformStaff = isPlatformAdmin || isPlatformSupport;
  const actingTenantId = await resolveActingTenantId(tenantId);

  if (isPlatformStaff && actingTenantId) {
    const tenant = await loadTenantById(supabase, actingTenantId);

    if (!tenant) {
      throw forbidden("Selected organization not found.");
    }

    const context = buildTenantContext({
      tenant,
      userId: user.id,
      role: "owner",
      isPlatformAdmin,
      isPlatformSupport,
    });

    return {
      supabase: resolveDbClientForContext(supabase, context),
      context,
    };
  }

  if (isPlatformStaff && !actingTenantId) {
    throw forbidden(
      "Select an organization in the support console before using the workspace.",
    );
  }

  const activeTenantId = await resolveActiveTenantId(tenantId);
  let membership = await getTenantMembership(supabase, user.id, activeTenantId);

  if (!membership && activeTenantId) {
    membership = await getTenantMembership(supabase, user.id);
  }

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
});

/** Tenant context for platform staff without requiring an acting tenant (support console). */
export async function requirePlatformAdminContext() {
  const { supabase, user } = await requireUser();
  const { isPlatformAdmin, isPlatformSupport } = await resolvePlatformRoles(
    supabase,
    user.id,
    user.email,
  );

  if (!isPlatformAdmin && !isPlatformSupport) {
    throw forbidden("Platform staff access required.");
  }

  return {
    supabase,
    user,
    context: {
      tenantId: "",
      tenantSlug: "",
      tenantName: isPlatformAdmin ? "Platform Admin" : "Customer Support",
      userId: user.id,
      role: "owner" as TenantRole,
      planKey: "platform",
      subscriptionStatus: "active",
      isPlatformAdmin,
      isPlatformSupport,
    } satisfies TenantContext,
  };
}

/** God mode only — analytics, audit export, and other restricted operations. */
export async function requireGodModeContext() {
  const { supabase, user, context } = await requirePlatformAdminContext();

  if (!context.isPlatformAdmin) {
    throw forbidden("Platform admin (God mode) access required.");
  }

  return { supabase, user, context };
}

export const listUserTenants = cache(async (userId: string) => {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("tenant_memberships")
    .select(
      `
      role,
      tenant_id,
      tenants (
        id,
        name,
        slug
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data
    .map((row) => {
      const tenant = Array.isArray(row.tenants) ? row.tenants[0] : row.tenants;
      if (!tenant) return null;
      return {
        tenantId: tenant.id as string,
        tenantName: tenant.name as string,
        tenantSlug: tenant.slug as string,
        role: row.role as TenantRole,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
});

export type AppShellData = {
  context: TenantContext;
  platformStaffOnly: boolean;
  actingTenantId: string | null;
  activeTenantId: string;
  tenantOptions: Awaited<ReturnType<typeof listUserTenants>>;
};

/** Resolve tenant from memberships when the active-tenant cookie is missing or stale. */
async function resolveTenantContextFromMemberships(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
  context: TenantContext;
} | null> {
  const { supabase, user } = await requireUser();
  const tenantOptions = await listUserTenants(user.id);

  if (tenantOptions.length === 0) {
    return null;
  }

  const primary = tenantOptions[0]!;
  const tenant = await loadTenantById(supabase, primary.tenantId);

  if (!tenant) {
    return null;
  }

  return {
    supabase,
    context: buildTenantContext({
      tenant,
      userId: user.id,
      role: primary.role,
    }),
  };
}

/** Cached shell data for /app layout — one auth pass per request. */
export const getAppShellData = cache(async (): Promise<AppShellData | null> => {
  const tenantResult = await tryGetTenantContext();

  if (tenantResult) {
    const { context } = tenantResult;
    const [actingTenantId, activeTenantId, tenantOptions] = await Promise.all([
      getActingTenantIdFromCookies(),
      getActiveTenantIdFromCookies(),
      listUserTenants(context.userId),
    ]);

    return {
      context,
      platformStaffOnly: false,
      actingTenantId,
      activeTenantId: activeTenantId ?? context.tenantId,
      tenantOptions,
    };
  }

  try {
    const staffResult = await requirePlatformAdminContext();
    const [actingTenantId, activeTenantId] = await Promise.all([
      getActingTenantIdFromCookies(),
      getActiveTenantIdFromCookies(),
    ]);

    return {
      context: staffResult.context,
      platformStaffOnly: true,
      actingTenantId,
      activeTenantId: activeTenantId ?? "",
      tenantOptions: [] as Awaited<ReturnType<typeof listUserTenants>>,
    };
  } catch {
    const resolved = await resolveTenantContextFromMemberships();
    if (!resolved) {
      return null;
    }

    const tenantOptions = await listUserTenants(resolved.context.userId);

    return {
      context: resolved.context,
      platformStaffOnly: false,
      actingTenantId: null,
      activeTenantId: resolved.context.tenantId,
      tenantOptions,
    };
  }
});

/** Redirect unpaid workspaces to billing (sign up → subscribe, no silent free trial). */
export function requireActiveSubscriptionForPage(context: TenantContext) {
  if (context.isPlatformAdmin || context.isPlatformSupport) {
    return;
  }

  if (!isActiveSubscriptionStatus(context.subscriptionStatus)) {
    redirect("/app/billing");
  }
}

/** Tenant workspace pages — redirects platform staff and guests instead of throwing. */
export async function requireTenantContextForPage(): Promise<{
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>;
  context: TenantContext;
}> {
  try {
    return await requireTenantContext();
  } catch {
    try {
      await requirePlatformAdminContext();
    } catch {
      const resolved = await resolveTenantContextFromMemberships();
      if (!resolved) {
        redirect("/onboarding");
      }
      return resolved;
    }
    redirect("/app/admin");
  }
}

/** God-mode admin pages — redirects everyone else to the support console. */
export async function requireGodModeContextForPage() {
  try {
    return await requireGodModeContext();
  } catch {
    redirect("/app/admin");
  }
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

  if (context.isPlatformAdmin || context.isPlatformSupport || hasPermission(context.role, permission)) {
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

  if (!context.isPlatformAdmin && !context.isPlatformSupport) {
    query = query.eq("tenant_id", context.tenantId);
  }

  const { data: clinic, error } = await query.maybeSingle();

  if (error || !clinic) {
    throw forbidden("Clinic not found in your organization.");
  }

  if ((context.isPlatformAdmin || context.isPlatformSupport) && clinic.tenant_id !== context.tenantId) {
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
