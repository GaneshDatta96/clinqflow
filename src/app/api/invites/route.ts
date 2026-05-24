import { z } from "zod";
import { createApiHandler, jsonCreated, jsonOk } from "@/lib/api/handler";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { INVITABLE_ROLES } from "@/lib/tenancy/invitable-roles";
import { env } from "@/lib/env";
import { createTenantInvite } from "@/lib/tenancy/invites";
import { requirePermission } from "@/lib/tenancy/context";

const createSchema = z.object({
  email: z.string().email(),
  role: z.enum(INVITABLE_ROLES).default("staff"),
});

export const GET = createApiHandler({
  route: "/api/invites",
  step: "invites_list",
  handler: async () => {
    const { context } = await requirePermission("members:invite");
    const admin = getSupabaseAdmin();

    if (!admin) {
      return jsonOk({ invites: [] });
    }

    const { data } = await admin
      .from("tenant_invites")
      .select("id, email, role, expires_at, accepted_at, created_at")
      .eq("tenant_id", context.tenantId)
      .order("created_at", { ascending: false })
      .limit(50);

    return jsonOk({ invites: data ?? [] });
  },
});

export const POST = createApiHandler({
  route: "/api/invites",
  step: "invites_create",
  rateLimit: "invite",
  schema: createSchema,
  handler: async ({ body }) => {
    const { context } = await requirePermission("members:invite");

    const result = await createTenantInvite({
      tenantId: context.tenantId,
      email: body.email,
      role: body.role,
      invitedBy: context.userId,
    });

    return jsonCreated({
      invite: result.invite,
      emailSent: env.emailEnabled,
    });
  },
});
