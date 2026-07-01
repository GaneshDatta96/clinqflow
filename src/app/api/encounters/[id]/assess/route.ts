import { scorePatterns } from "@/lib/assessment/score-patterns";
import { createApiHandler, invalidateTenantCache, jsonOk } from "@/lib/api/handler";
import { badRequest, notFound } from "@/lib/api/errors";
import { getEncounterSoapContext } from "@/lib/db/repositories/intake";
import { logPhiAccessIfPlatformStaff, requirePermission } from "@/lib/tenancy/context";

export const POST = createApiHandler({
  route: "/api/encounters/[id]/assess",
  step: "assessment",
  rateLimit: "write",
  handler: async ({ request }) => {
    const id = request.url.split("/encounters/")[1]?.split("/")[0];
    if (!id) throw notFound();

    const { supabase, context } = await requirePermission("encounter:write");
    const encounterContext = await getEncounterSoapContext(supabase, context.tenantId, id);

    if (!encounterContext) {
      throw notFound();
    }

    const intake = encounterContext.intake;
    if (!intake) {
      throw badRequest("No intake submission found for this encounter.");
    }

    await logPhiAccessIfPlatformStaff({
      supabase,
      context,
      action: "phi.encounter.assess",
      resourceType: "encounter",
      resourceId: id,
    });

    const assessmentResults = scorePatterns(intake);

    await supabase.from("assessment_results").delete().eq("encounter_id", id);
    await supabase.from("assessment_results").insert(
      assessmentResults.map((item) => ({
        encounter_id: id,
        pattern_key: item.pattern_key,
        confidence: item.confidence,
        evidence: item.evidence,
        data_gaps: item.data_gaps,
        risk_level: item.risk_level,
        rank: item.rank,
      })),
    );

    invalidateTenantCache(context.tenantId, ["encounters"]);

    return jsonOk({ assessmentResults });
  },
});
