import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import type { createSupabaseServerClient } from "@/lib/db/supabase-server";
import type { TenantContext } from "@/lib/tenancy/types";

/**
 * Platform support has no patient/clinical record access (RLS). When impersonating
 * a tenant for operational tasks, writes use the service role with explicit
 * tenant_id filters in application code — never for PHI tables.
 */
export function resolveDbClientForContext(
  userClient: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  context: TenantContext,
): SupabaseClient {
  if (context.isPlatformSupport && context.tenantId) {
    const admin = getSupabaseAdmin();
    if (admin) {
      return admin;
    }
  }

  return userClient;
}

export function isMfaStepUpRequired(_context: TenantContext): boolean {
  // Phase 2: enforce Supabase MFA for platform staff before impersonation.
  return false;
}
