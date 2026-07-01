import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { badRequest } from "@/lib/api/errors";
import { PLAN_LIMITS } from "@/lib/billing/plans";
import { nicheConfigs } from "@/lib/clinics/niche-configs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function bootstrapTenantForUser(args: {
  userId: string;
  email: string;
  organizationName: string;
  niche?: string;
}) {
  const admin = getSupabaseAdmin();

  if (!admin) {
    throw badRequest("Database is not configured.");
  }

  const baseSlug = slugify(args.organizationName) || "clinic";
  const tenantSlug = `${baseSlug}-${args.userId.slice(0, 8)}`;
  const niche = args.niche && args.niche in nicheConfigs ? args.niche : "general_practice";

  const { data: existingMembership } = await admin
    .from("tenant_memberships")
    .select("tenant_id")
    .eq("user_id", args.userId)
    .limit(1)
    .maybeSingle();

  if (existingMembership?.tenant_id) {
    const { data: tenant } = await admin
      .from("tenants")
      .select("id, slug, name")
      .eq("id", existingMembership.tenant_id)
      .single();

    return { tenant, created: false };
  }

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({
      name: args.organizationName.trim(),
      slug: tenantSlug,
      plan_key: "starter",
      subscription_status: "incomplete",
      trial_ends_at: null,
    })
    .select("id, slug, name")
    .single();

  if (tenantError || !tenant) {
    throw tenantError ?? badRequest("Unable to create organization.");
  }

  await admin.from("tenant_memberships").insert({
    tenant_id: tenant.id,
    user_id: args.userId,
    role: "owner",
    accepted_at: new Date().toISOString(),
  });

  await admin.from("subscriptions").insert({
    tenant_id: tenant.id,
    plan_key: "starter",
    status: "incomplete",
    seat_limit: PLAN_LIMITS.starter.seats,
    ai_monthly_limit: PLAN_LIMITS.starter.aiMonthly,
  });

  const clinicSlug = `${baseSlug}-main`;

  const { data: clinic } = await admin
    .from("clinics")
    .insert({
      tenant_id: tenant.id,
      name: args.organizationName.trim(),
      slug: clinicSlug,
      niche,
      is_demo: false,
      created_by: args.userId,
    })
    .select("id, slug, name, niche")
    .single();

  await admin.from("niche_configs").upsert(
    Object.entries(nicheConfigs).map(([nicheKey, config]) => ({
      niche: nicheKey,
      config,
    })),
    { onConflict: "niche" },
  );

  await admin.from("audit_logs").insert({
    tenant_id: tenant.id,
    actor_id: args.userId,
    action: "tenant.created",
    resource_type: "tenant",
    resource_id: tenant.id,
    metadata: { clinic_id: clinic?.id },
  });

  return { tenant, clinic, created: true };
}
