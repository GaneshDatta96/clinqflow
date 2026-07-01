import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { getPublicIntakeCaptchaStatus } from "@/lib/security/public-intake-guard";

export const GET = createApiHandler({
  route: "/api/intake/public/captcha-status",
  step: "public_intake_captcha_status",
  rateLimit: "public_intake",
  handler: async ({ request }) => {
    const status = await getPublicIntakeCaptchaStatus(request);
    return jsonOk(status);
  },
});
