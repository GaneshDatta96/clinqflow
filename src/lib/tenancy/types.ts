export const TENANT_ROLES = [
  "owner",
  "admin",
  "practitioner",
  "staff",
  "viewer",
] as const;

export type TenantRole = (typeof TENANT_ROLES)[number];

export type TenantContext = {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  userId: string;
  role: TenantRole;
  planKey: string;
  subscriptionStatus: string;
  /** True when logged in as platform admin (god account). */
  isPlatformAdmin?: boolean;
};

export type ClinicContext = TenantContext & {
  clinicId: string;
  clinicSlug: string;
  clinicName: string;
  niche: string;
};
