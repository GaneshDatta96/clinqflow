import { badRequest } from "@/lib/api/errors";
import { rateLimitIdentifier } from "@/lib/api/upstash-rate-limit";
import { env } from "@/lib/env";
import {
  assertTurnstileToken,
  getPublicIntakeAttemptCount,
  incrementPublicIntakeAttemptCount,
  isTurnstileConfigured,
} from "@/lib/security/turnstile";

/** After this many public intake submissions per IP per hour, CAPTCHA is required. */
export const PUBLIC_INTAKE_CAPTCHA_THRESHOLD = 3;

export async function getPublicIntakeCaptchaStatus(request: Request) {
  const ip = rateLimitIdentifier(request);
  const attempts = await getPublicIntakeAttemptCount(ip);
  const configured = isTurnstileConfigured();

  return {
    required: configured && attempts >= PUBLIC_INTAKE_CAPTCHA_THRESHOLD,
    siteKey: configured ? env.turnstileSiteKey : null,
    attempts,
    threshold: PUBLIC_INTAKE_CAPTCHA_THRESHOLD,
  };
}

export async function assertPublicIntakeCaptchaIfRequired(
  request: Request,
  captchaToken: string | null | undefined,
) {
  const status = await getPublicIntakeCaptchaStatus(request);

  if (!status.required) {
    return;
  }

  if (!captchaToken) {
    throw badRequest("CAPTCHA verification is required. Complete the challenge and try again.", {
      code: "captcha_required",
      siteKey: status.siteKey,
    });
  }

  const ip = rateLimitIdentifier(request);
  await assertTurnstileToken(captchaToken, ip);
}

export async function recordPublicIntakeSubmission(request: Request) {
  const ip = rateLimitIdentifier(request);
  await incrementPublicIntakeAttemptCount(ip);
}
