import { z } from "zod";
import { cookies } from "next/headers";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import {
  ACTING_TENANT_COOKIE,
  requirePlatformAdmin,
} from "@/lib/tenancy/platform-admin";

const setSchema = z.object({
  tenant_id: z.string().uuid(),
});

export const POST = createApiHandler({
  route: "/api/admin/acting-tenant",
  step: "admin_set_acting_tenant",
  schema: setSchema,
  handler: async ({ body }) => {
    const { supabase, user } = await requirePlatformAdmin();

    const { data: tenant, error } = await supabase
      .from("tenants")
      .select("id, name, slug")
      .eq("id", body.tenant_id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !tenant) {
      throw badRequest("Organization not found.");
    }

    const cookieStore = await cookies();
    cookieStore.set(ACTING_TENANT_COOKIE, tenant.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    await supabase.from("audit_logs").insert({
      tenant_id: tenant.id,
      actor_id: user.id,
      action: "platform_admin.impersonate",
      resource_type: "tenant",
      resource_id: tenant.id,
      metadata: { tenant_slug: tenant.slug },
    });

    return jsonOk({
      tenantId: tenant.id,
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
      message: `Now acting as ${tenant.name}. Open the dashboard to support this customer.`,
    });
  },
});

export const DELETE = createApiHandler({
  route: "/api/admin/acting-tenant",
  step: "admin_clear_acting_tenant",
  handler: async () => {
    await requirePlatformAdmin();

    const cookieStore = await cookies();
    cookieStore.delete(ACTING_TENANT_COOKIE);

    return jsonOk({ cleared: true });
  },
});
