import { getClinicByNiche } from "@/lib/clinics/niche-configs";
import { getClinicForSlug } from "@/lib/clinics/store";
import {
  createApiHandler,
  jsonOk,
  revalidateDashboard,
} from "@/lib/api/handler";
import { processAuthenticatedIntakeSubmission } from "@/lib/intake/workflow";
import { logInfo } from "@/lib/logging/logger";
import { requirePermission } from "@/lib/tenancy/context";
import {
  buildNicheIntakeSubmissionSchema,
  nicheIntakeBaseSchema,
} from "@/lib/schemas/niche-intake";

export const POST = createApiHandler({
  route: "/api/intake/submit",
  step: "intake_pipeline",
  handler: async ({ request, requestLog, startedAt }) => {
    const body = await request.json();
    const baseInput = nicheIntakeBaseSchema.parse(body);
    const { supabase, context } = await requirePermission("encounter:write");

    const clinic =
      (await getClinicForSlug(baseInput.clinic_slug, context.tenantId)) ??
      getClinicByNiche(baseInput.niche);

    if (!clinic?.id) {
      throw new Error("Unknown clinic configuration.");
    }

    const input = buildNicheIntakeSubmissionSchema(clinic.config).parse(body);
    const processed = await processAuthenticatedIntakeSubmission(input, {
      supabase,
      tenantId: context.tenantId,
      userId: context.userId,
    });

    revalidateDashboard();

    logInfo({
      ...requestLog,
      message: "route.complete",
      step: "intake_pipeline",
      status: "ok",
      encounter_id: processed.encounterId,
      latency_ms: Date.now() - startedAt,
      metadata: {
        tenant_id: context.tenantId,
        clinic_id: processed.clinicId,
        pattern_count: processed.assessmentResults.length,
        used_fallback: processed.usedFallback,
      },
    });

    return jsonOk({
      encounterId: processed.encounterId,
      assessmentResults: processed.assessmentResults,
      soap: processed.soap,
      bookingEnabled: processed.supportsAppointments,
    });
  },
});
