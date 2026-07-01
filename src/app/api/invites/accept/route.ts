import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { acceptTenantInvite } from "@/lib/tenancy/invites";
import { requireUser } from "@/lib/tenancy/context";

const schema = z.object({
  token: z.string().min(1),
});

export const POST = createApiHandler({
  route: "/api/invites/accept",
  step: "invites_accept",
  rateLimit: "auth_sensitive",
  schema,
  handler: async ({ body }) => {
    const { user } = await requireUser();

    const result = await acceptTenantInvite({
      rawToken: body.token,
      userId: user.id,
      userEmail: user.email ?? "",
    });

    return jsonOk({
      tenantId: result.tenantId,
      message: "Invite accepted. Redirecting to your workspace.",
    });
  },
});
