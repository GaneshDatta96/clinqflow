import { z } from "zod";
import { createApiHandler, jsonCreated } from "@/lib/api/handler";
import { sendSignupVerificationEmail } from "@/lib/auth/send-auth-email";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().min(1).max(120),
});

export const POST = createApiHandler({
  route: "/api/auth/signup",
  step: "auth_signup",
  rateLimit: "auth",
  schema: signupSchema,
  handler: async ({ body }) => {
    const result = await sendSignupVerificationEmail({
      email: body.email,
      password: body.password,
      fullName: body.full_name,
    });

    return jsonCreated(result);
  },
});
