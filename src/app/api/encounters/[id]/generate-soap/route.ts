import { z } from "zod";
import { generateSoapDraft } from "@/lib/ai/generate-soap";
import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { notFound } from "@/lib/api/errors";
import { getEncounterForTenant } from "@/lib/db/repositories/encounters";
import { normalizedIntakeSchema } from "@/lib/schemas/intake";
import { assessmentResultSchema } from "@/lib/schemas/soap";
import { assertAiGenerationAllowed } from "@/lib/billing/entitlements";
import { requirePermission } from "@/lib/tenancy/context";

const bodySchema = z.object({
  normalized_intake: normalizedIntakeSchema,
  assessment_results: z.array(assessmentResultSchema),
});

export const POST = createApiHandler({
  route: "/api/encounters/[id]/generate-soap",
  step: "soap_generation",
  schema: bodySchema,
  handler: async ({ body, request }) => {
    const id = request.url.split("/encounters/")[1]?.split("/")[0];
    if (!id) throw notFound();

    const { supabase, context } = await requirePermission("encounter:write");
    const encounter = await getEncounterForTenant(supabase, context.tenantId, id);

    if (!encounter) throw notFound();

    await assertAiGenerationAllowed(context.tenantId);

    const generated = await generateSoapDraft({
      intake: body.normalized_intake,
      assessmentResults: body.assessment_results,
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

    return jsonOk({
      soap: generated.soap,
      model: generated.model,
      usedFallback: generated.usedFallback,
    });
  },
});
