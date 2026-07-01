import { NextResponse } from "next/server";
import { z } from "zod";
import { createApiHandler } from "@/lib/api/handler";
import { PRIVATE_NO_STORE } from "@/lib/http/cache-control";
import { requireUser } from "@/lib/tenancy/context";
import { ACTIVE_TENANT_COOKIE } from "@/lib/tenancy/active-tenant";
import { bootstrapTenantForUser } from "@/lib/tenancy/onboarding";

const onboardingSchema = z.object({
  organization_name: z.string().trim().min(2).max(120),
  niche: z.string().trim().optional(),
});

export const POST = createApiHandler({
  route: "/api/auth/onboarding",
  step: "onboarding",
  rateLimit: "auth_sensitive",
  requireAuth: true,
  schema: onboardingSchema,
  handler: async ({ body }) => {
    const { user } = await requireUser();

    const result = await bootstrapTenantForUser({
      userId: user.id,
      email: user.email ?? "",
      organizationName: body.organization_name,
      niche: body.niche,
    });

    const payload = {
      tenant: result.tenant,
      clinic: result.clinic,
      created: result.created,
    };

    const response = NextResponse.json(payload, {
      status: result.created ? 201 : 200,
      headers: { "Cache-Control": PRIVATE_NO_STORE },
    });

    if (result.tenant?.id) {
      response.cookies.set(ACTIVE_TENANT_COOKIE, result.tenant.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 90,
      });
    }

    return response;
  },
});
