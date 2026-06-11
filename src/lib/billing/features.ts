import { forbidden } from "@/lib/api/errors";
import { getEntitlementsSummary } from "@/lib/billing/entitlements";
import { isActiveSubscriptionStatus } from "@/lib/billing/plans";

export async function assertFeature(
  tenantId: string,
  feature: "ai_generation" | "invites" | "intake_links",
) {
  const entitlements = await getEntitlementsSummary(tenantId);

  if (!isActiveSubscriptionStatus(entitlements.status)) {
    throw forbidden("Active subscription required. Subscribe in Billing to continue.");
  }

  if (feature === "ai_generation" && entitlements.aiGenerations.used >= entitlements.aiGenerations.limit) {
    throw forbidden("AI generation limit reached for this billing period.");
  }
}
