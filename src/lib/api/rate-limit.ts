import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { tooManyRequests } from "@/lib/api/errors";

const PUBLIC_INTAKE_HOURLY_LIMIT = 30;

export async function assertPublicIntakeRateLimit(tenantId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await admin
    .from("usage_tracking")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("metric_key", "public_intake_submit")
    .gte("recorded_at", hourAgo);

  if ((count ?? 0) >= PUBLIC_INTAKE_HOURLY_LIMIT) {
    throw tooManyRequests("Intake submission rate limit exceeded. Try again later.");
  }

  await admin.from("usage_tracking").insert({
    tenant_id: tenantId,
    metric_key: "public_intake_submit",
    quantity: 1,
  });
}
