import { z } from "zod";
import { createApiHandler, jsonCreated } from "@/lib/api/handler";
import { requireUser } from "@/lib/tenancy/context";
import { setActiveTenantCookie } from "@/lib/tenancy/active-tenant";
import { bootstrapTenantForUser } from "@/lib/tenancy/onboarding";

const onboardingSchema = z.object({
  organization_name: z.string().trim().min(2).max(120),
  niche: z.string().trim().optional(),
});

export const POST = createApiHandler({
  route: "/api/auth/onboarding",
  step: "onboarding",
  rateLimit: "auth",
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

    if (result.tenant?.id) {
      await setActiveTenantCookie(result.tenant.id);
    }

    return jsonCreated({
      tenant: result.tenant,
      clinic: result.clinic,
      created: result.created,
    });
  },
});
