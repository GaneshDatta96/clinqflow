import { z } from "zod";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { sendPasswordResetEmail } from "@/lib/auth/send-auth-email";

const forgotSchema = z.object({
  email: z.string().email(),
});

export const POST = createApiHandler({
  route: "/api/auth/forgot-password",
  step: "auth_forgot_password",
  rateLimit: "auth_sensitive",
  schema: forgotSchema,
  handler: async ({ body }) => {
    await sendPasswordResetEmail({ email: body.email });
    return jsonOk({ emailSent: true });
  },
});
