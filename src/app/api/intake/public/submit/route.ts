import { getClinicByNiche } from "@/lib/clinics/niche-configs";
import { getClinicForSlug } from "@/lib/clinics/store";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest } from "@/lib/api/errors";
import { processPublicIntakeSubmission } from "@/lib/intake/workflow";
import {
  buildNicheIntakeSubmissionSchema,
  nicheIntakeBaseSchema,
} from "@/lib/schemas/niche-intake";

export const POST = createApiHandler({
  route: "/api/intake/public/submit",
  step: "public_intake_pipeline",
  handler: async ({ request, startedAt, requestLog }) => {
    const intakeToken = request.headers.get("x-intake-token");

    if (!intakeToken) {
      throw badRequest("Missing intake token.");
    }

    const body = await request.json();
    const baseInput = nicheIntakeBaseSchema.parse(body);
    const clinic =
      (await getClinicForSlug(baseInput.clinic_slug)) ??
      getClinicByNiche(baseInput.niche);

    if (!clinic) {
      throw badRequest("Unknown clinic configuration.");
    }

    const input = buildNicheIntakeSubmissionSchema(clinic.config).parse(body);
    const processed = await processPublicIntakeSubmission(input, intakeToken);

    return jsonOk({
      encounterId: processed.encounterId,
      bookingEnabled: processed.supportsAppointments,
      submittedAt: new Date().toISOString(),
      latency_ms: Date.now() - startedAt,
      request_id: requestLog.request_id,
    });
  },
});
