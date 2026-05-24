import { generateSoapDraft } from "@/lib/ai/generate-soap";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { badRequest, notFound } from "@/lib/api/errors";
import { getEncounterForTenant } from "@/lib/db/repositories/encounters";
import {
  getEncounterAssessmentResults,
  getEncounterIntakeSubmission,
} from "@/lib/db/repositories/intake";
import { assertAiGenerationAllowed } from "@/lib/billing/entitlements";
import { logPhiAccessIfPlatformStaff, requirePermission } from "@/lib/tenancy/context";
import { trackUsage } from "@/services/usage.service";

export const POST = createApiHandler({
  route: "/api/encounters/[id]/generate-soap",
  step: "soap_generation",
  rateLimit: "ai_generate",
  handler: async ({ request }) => {
    const id = request.url.split("/encounters/")[1]?.split("/")[0];
    if (!id) throw notFound();

    const { supabase, context } = await requirePermission("encounter:write");
    const encounter = await getEncounterForTenant(supabase, context.tenantId, id);

    if (!encounter) throw notFound();

    const intake = await getEncounterIntakeSubmission(supabase, context.tenantId, id);
    if (!intake) {
      throw badRequest("No intake submission found for this encounter.");
    }

    const assessmentResults = await getEncounterAssessmentResults(
      supabase,
      context.tenantId,
      id,
    );

    if (assessmentResults.length === 0) {
      throw badRequest("Run assessment before generating SOAP.");
    }

    await logPhiAccessIfPlatformStaff({
      supabase,
      context,
      action: "phi.encounter.soap_generate",
      resourceType: "encounter",
      resourceId: id,
    });

    await assertAiGenerationAllowed(context.tenantId);

    const generated = await generateSoapDraft({
      intake,
      assessmentResults,
    });

    await supabase.from("soap_notes").upsert(
      {
        encounter_id: id,
        subjective: generated.soap.subjective,
        objective: generated.soap.objective,
        assessment: generated.soap.assessment,
        plan: generated.soap.plan_draft,
        soap_json: generated.soap,
        prompt_version: generated.promptVersion,
        model: generated.model,
        review_status: "draft",
      },
      { onConflict: "encounter_id" },
    );

    await supabase.from("ai_generations").insert({
      tenant_id: context.tenantId,
      encounter_id: id,
      prompt_version: generated.promptVersion,
      model: generated.model,
      used_fallback: generated.usedFallback,
      created_by: context.userId,
    });

    await trackUsage({
      supabase,
      tenantId: context.tenantId,
      metricKey: "ai_soap_generation",
    });

    return jsonOk({
      soap: generated.soap,
      model: generated.model,
      usedFallback: generated.usedFallback,
    });
  },
});
