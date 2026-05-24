import { forbidden } from "@/lib/api/errors";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";

export async function assertFeature(
  tenantId: string,
  feature: "ai_generation" | "invites" | "intake_links",
) {
  const entitlements = await getEntitlementsSummary(tenantId);

  if (entitlements.status === "canceled" || entitlements.status === "past_due") {
    throw forbidden("Subscription inactive. Update billing to continue.");
  }

  if (feature === "ai_generation" && entitlements.aiGenerations.used >= entitlements.aiGenerations.limit) {
    throw forbidden("AI generation limit reached for this billing period.");
  }
}
