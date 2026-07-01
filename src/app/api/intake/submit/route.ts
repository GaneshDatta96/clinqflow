import { getClinicByNiche } from "@/lib/clinics/niche-configs";
import { getClinicForSlug } from "@/lib/clinics/store";
import {
  createApiHandler,
  jsonOk,
  revalidateDashboard,
} from "@/lib/api/handler";
import { assertTenantIntakeRateLimit } from "@/lib/api/upstash-rate-limit";
import { processAuthenticatedIntakeSubmission } from "@/lib/intake/workflow";
import { logInfo } from "@/lib/logging/logger";
import { requirePermission } from "@/lib/tenancy/context";
import {
  getNicheIntakeSubmissionSchema,
  nicheIntakeBaseSchema,
} from "@/lib/schemas/niche-intake";

export const POST = createApiHandler({
  route: "/api/intake/submit",
  step: "intake_pipeline",
  rateLimit: "write",
  handler: async ({ request, requestLog, startedAt }) => {
    const body = await request.json();
    const baseInput = nicheIntakeBaseSchema.parse(body);
    const { supabase, context } = await requirePermission("encounter:write");

    await assertTenantIntakeRateLimit(context.tenantId);

    const clinic =
      (await getClinicForSlug(baseInput.clinic_slug, context.tenantId)) ??
      getClinicByNiche(baseInput.niche);

    if (!clinic?.id) {
      throw new Error("Unknown clinic configuration.");
    }

    const input = getNicheIntakeSubmissionSchema(clinic.config).parse(body);
    const processed = await processAuthenticatedIntakeSubmission(input, {
      supabase,
      tenantId: context.tenantId,
      userId: context.userId,
      clinic: clinic?.id ? clinic : undefined,
    });

    revalidateDashboard(context.tenantId);

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
      soapStatus: processed.soapStatus,
      bookingEnabled: processed.supportsAppointments,
    });
  },
});
