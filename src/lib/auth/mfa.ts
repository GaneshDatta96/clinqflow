import type { SupabaseClient } from "@supabase/supabase-js";
import { forbidden } from "@/lib/api/errors";
import { isEmailConfiguredAsPlatformStaff } from "@/lib/tenancy/platform-admin";
import type { TenantContext } from "@/lib/tenancy/types";

export type PlatformStaffMfaStatus = "ok" | "enroll" | "verify";

export function isPlatformStaffMfaEnforced() {
  if (process.env.PLATFORM_STAFF_MFA_REQUIRED === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production";
}

export async function getPlatformStaffMfaStatus(
  supabase: SupabaseClient,
): Promise<PlatformStaffMfaStatus> {
  const { data: assurance, error: assuranceError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (assuranceError || !assurance) {
    return "verify";
  }

  if (assurance.currentLevel === "aal2") {
    return "ok";
  }

  const { data: factors, error: factorsError } =
    await supabase.auth.mfa.listFactors();

  if (factorsError) {
    return "verify";
  }

  const verifiedTotp =
    factors?.totp?.filter((factor) => factor.status === "verified") ?? [];

  if (verifiedTotp.length === 0) {
    return "enroll";
  }

  if (assurance.nextLevel === "aal2") {
    return "verify";
  }

  return "ok";
}

export async function resolvePlatformStaffMfaRedirect(
  supabase: SupabaseClient,
  email: string | null | undefined,
): Promise<string | null> {
  if (!isPlatformStaffMfaEnforced()) {
    return null;
  }

  if (!isEmailConfiguredAsPlatformStaff(email)) {
    return null;
  }

  const status = await getPlatformStaffMfaStatus(supabase);

  if (status === "ok") {
    return null;
  }

  return status === "enroll" ? "/app/mfa/setup" : "/app/mfa/verify";
}

export async function assertPlatformStaffMfa(
  supabase: SupabaseClient,
  email: string | null | undefined,
) {
  const redirect = await resolvePlatformStaffMfaRedirect(supabase, email);

  if (redirect) {
    throw forbidden(
      "Multi-factor authentication is required for platform staff access.",
    );
  }
}

export function isMfaStepUpRequired(context: TenantContext): boolean {
  if (!isPlatformStaffMfaEnforced()) {
    return false;
  }

  return Boolean(context.isPlatformAdmin || context.isPlatformSupport);
}

export function buildMfaRedirectPath(
  status: Exclude<PlatformStaffMfaStatus, "ok">,
  nextPath: string,
) {
  const base = status === "enroll" ? "/app/mfa/setup" : "/app/mfa/verify";
  return `${base}?next=${encodeURIComponent(nextPath)}`;
}
