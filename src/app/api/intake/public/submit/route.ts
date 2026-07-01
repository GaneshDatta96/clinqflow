import { getClinicByNiche } from "@/lib/clinics/niche-configs";
import { getClinicForSlug } from "@/lib/clinics/store";
import { createApiHandler, jsonOk, revalidateDashboard } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import { processPublicIntakeSubmission } from "@/lib/intake/workflow";
import {
  assertPublicIntakeCaptchaIfRequired,
  recordPublicIntakeSubmission,
} from "@/lib/security/public-intake-guard";
import {
  getNicheIntakeSubmissionSchema,
  nicheIntakeBaseSchema,
} from "@/lib/schemas/niche-intake";

export const POST = createApiHandler({
  route: "/api/intake/public/submit",
  step: "public_intake_pipeline",
  rateLimit: "public_intake",
  handler: async ({ request, startedAt, requestLog }) => {
    const intakeToken = request.headers.get("x-intake-token");

    if (!intakeToken) {
      throw badRequest("Missing intake token.");
    }

    const body = (await request.json()) as Record<string, unknown>;
    const captchaToken =
      (typeof body.captcha_token === "string" ? body.captcha_token : null) ??
      request.headers.get("x-captcha-token");

    await assertPublicIntakeCaptchaIfRequired(request, captchaToken);

    const baseInput = nicheIntakeBaseSchema.parse(body);
    const clinic =
      (await getClinicForSlug(baseInput.clinic_slug)) ??
      getClinicByNiche(baseInput.niche);

    if (!clinic) {
      throw badRequest("Unknown clinic configuration.");
    }

    const input = getNicheIntakeSubmissionSchema(clinic.config).parse(body);

    if (!input.consent_accepted) {
      throw badRequest("Consent is required before submitting intake.");
    }

    const processed = await processPublicIntakeSubmission(
      input,
      intakeToken,
      {
        ipAddress: request.headers.get("x-forwarded-for"),
        userAgent: request.headers.get("user-agent"),
      },
    );

    await recordPublicIntakeSubmission(request);

    revalidateDashboard(processed.tenantId);

    return jsonOk({
      encounterId: processed.encounterId,
      bookingEnabled: processed.supportsAppointments,
      submittedAt: new Date().toISOString(),
      latency_ms: Date.now() - startedAt,
      request_id: requestLog.request_id,
    });
  },
});
