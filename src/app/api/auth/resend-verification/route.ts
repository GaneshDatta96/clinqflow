import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { resendSignupVerificationEmail } from "@/lib/auth/send-auth-email";

const resendSchema = z.object({
  email: z.string().email(),
});

export const POST = createApiHandler({
  route: "/api/auth/resend-verification",
  step: "auth_resend_verification",
  rateLimit: "auth",
  schema: resendSchema,
  handler: async ({ body }) => {
    const result = await resendSignupVerificationEmail({ email: body.email });
    return jsonOk(result);
  },
});
