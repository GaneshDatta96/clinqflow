import { type TenantRole } from "@/lib/tenancy/types";

const ROLE_RANK: Record<TenantRole, number> = {
  owner: 100,
  admin: 80,
  practitioner: 60,
  staff: 40,
  support: 35,
  viewer: 10,
};

export const PERMISSIONS = {
  "tenant:manage": ["owner", "admin"] as TenantRole[],
  "tenant:billing": ["owner"] as TenantRole[],
  "members:invite": ["owner", "admin"] as TenantRole[],
  "members:manage": ["owner", "admin"] as TenantRole[],
  "clinic:create": ["owner", "admin", "practitioner"] as TenantRole[],
  "clinic:update": ["owner", "admin", "practitioner"] as TenantRole[],
  "clinic:delete": ["owner", "admin"] as TenantRole[],
  "patient:create": ["owner", "admin", "practitioner", "staff"] as TenantRole[],
  "patient:read": ["owner", "admin", "practitioner", "staff", "viewer"] as TenantRole[],
  "patient:update": ["owner", "admin", "practitioner", "staff"] as TenantRole[],
  "encounter:read": ["owner", "admin", "practitioner", "staff", "viewer"] as TenantRole[],
  "encounter:write": ["owner", "admin", "practitioner", "staff"] as TenantRole[],
  "soap:approve": ["owner", "admin", "practitioner"] as TenantRole[],
  "intake:link:create": ["owner", "admin", "practitioner", "staff"] as TenantRole[],
  "analytics:view": ["owner", "admin"] as TenantRole[],
  "api_keys:manage": ["owner", "admin"] as TenantRole[],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: TenantRole, permission: Permission) {
  return PERMISSIONS[permission].includes(role);
}

export function hasMinimumRole(role: TenantRole, minimum: TenantRole) {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function canWriteClinical(role: TenantRole) {
  return hasPermission(role, "encounter:write");
}
