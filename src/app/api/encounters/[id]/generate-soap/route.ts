import { generateSoapDraft } from "@/lib/ai/generate-soap";
import { createApiHandler, invalidateTenantCache, jsonOk } from "@/lib/api/handler";
import { badRequest, notFound } from "@/lib/api/errors";
import { getEncounterSoapContext } from "@/lib/db/repositories/intake";
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
    const encounterContext = await getEncounterSoapContext(supabase, context.tenantId, id);

    if (!encounterContext) throw notFound();

    const { intake, assessmentResults } = encounterContext;

    if (!intake) {
      throw badRequest("No intake submission found for this encounter.");
    }

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

    await Promise.all([
      supabase.from("soap_notes").upsert(
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
      ),
      supabase.from("ai_generations").insert({
        tenant_id: context.tenantId,
        encounter_id: id,
        prompt_version: generated.promptVersion,
        model: generated.model,
        used_fallback: generated.usedFallback,
        created_by: context.userId,
      }),
      trackUsage({
        supabase,
        tenantId: context.tenantId,
        metricKey: "ai_soap_generation",
      }),
    ]);

    invalidateTenantCache(context.tenantId);

    return jsonOk({
      soap: generated.soap,
      model: generated.model,
      usedFallback: generated.usedFallback,
    });
  },
});
