import { z } from "zod";
import { createApiHandler, jsonCreated } from "@/lib/api/handler";
import { passwordSchemaForEmail } from "@/lib/auth/password";
import { sendSignupVerificationEmail } from "@/lib/auth/send-auth-email";

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    full_name: z.string().trim().min(1).max(120),
  })
  .superRefine((data, ctx) => {
    const result = passwordSchemaForEmail(data.email).safeParse(data.password);
    if (!result.success) {
      for (const issue of result.error.issues) {
        ctx.addIssue({ ...issue, path: ["password"] });
      }
    }
  });
export const POST = createApiHandler({
  route: "/api/auth/signup",
  step: "auth_signup",
  rateLimit: "auth_sensitive",
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
