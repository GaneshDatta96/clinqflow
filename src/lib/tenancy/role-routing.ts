import type { TenantRole } from "@/lib/tenancy/types";

export type UserPersona =
  | "god"
  | "platform_support"
  | "clinic_admin"
  | "practitioner"
  | "viewer";

export const ROLE_LABELS: Record<TenantRole | "god" | "platform_support", string> = {
  god: "Platform Admin (God mode)",
  platform_support: "Cliniqflow Customer Support",
  owner: "Clinic owner",
  admin: "Clinic administrator",
  practitioner: "Practitioner",
  staff: "Staff",
  support: "Staff (legacy)",
  viewer: "Viewer",
};

export function roleToPersona(role: TenantRole): UserPersona {
  switch (role) {
    case "owner":
    case "admin":
      return "clinic_admin";
    case "practitioner":
    case "staff":
      return "practitioner";
    case "viewer":
      return "viewer";
    default:
      return "viewer";
  }
}

export function resolvePostLoginPath(args: {
  isPlatformAdmin: boolean;
  isPlatformSupport: boolean;
  role?: TenantRole;
  hasMembership: boolean;
}) {
  if (args.isPlatformAdmin || args.isPlatformSupport) {
    return "/app/admin";
  }

  if (!args.hasMembership || !args.role) {
    return "/onboarding";
  }

  return "/app/dashboard";
}

export type NavItem = {
  href: string;
  label: string;
  permission?: keyof typeof import("@/lib/tenancy/permissions").PERMISSIONS;
};

export function getWorkspaceNav(args: {
  role: TenantRole;
  isPlatformAdmin: boolean;
  isPlatformSupport: boolean;
  platformStaffOnly: boolean;
  actingTenantId: string | null;
}): NavItem[] {
  const items: NavItem[] = [];

  if (args.isPlatformAdmin) {
    items.push({ href: "/app/admin", label: "God mode console" });
  } else if (args.isPlatformSupport) {
    items.push({ href: "/app/admin", label: "Customer support console" });
  }

  if (args.platformStaffOnly && !args.actingTenantId) {
    return items;
  }

  if (args.isPlatformAdmin || args.isPlatformSupport) {
    items.push(
      { href: "/app/dashboard", label: "Dashboard", permission: "encounter:read" },
      { href: "/app/patients", label: "Patients", permission: "patient:read" },
    );
    return items;
  }

  const persona = roleToPersona(args.role);

  if (persona === "viewer") {
    items.push(
      { href: "/app/dashboard", label: "Dashboard", permission: "encounter:read" },
      { href: "/app/patients", label: "Patients", permission: "patient:read" },
    );
    return items;
  }

  items.push(
    { href: "/app/dashboard", label: "Dashboard", permission: "encounter:read" },
    { href: "/app/patients", label: "Patients", permission: "patient:read" },
    { href: "/app/settings", label: "Settings" },
    { href: "/app/billing", label: "Billing", permission: "tenant:billing" },
  );

  return items;
}
