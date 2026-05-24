import { z } from "zod";
import type { TenantRole } from "@/lib/tenancy/types";

/** Roles that can be assigned via invite (owner transfer is not invite-based). */
export const INVITABLE_ROLES = [
  "admin",
  "practitioner",
  "staff",
  "viewer",
] as const satisfies readonly TenantRole[];

export type InvitableRole = (typeof INVITABLE_ROLES)[number];
