import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

export async function trackUsage(args: {
  supabase?: SupabaseClient | null;
  tenantId: string;
  metricKey: string;
  quantity?: number;
}) {
  const client = args.supabase ?? getSupabaseAdmin();
  if (!client) return;

  await client.from("usage_tracking").insert({
    tenant_id: args.tenantId,
    metric_key: args.metricKey,
    quantity: args.quantity ?? 1,
  });
}
