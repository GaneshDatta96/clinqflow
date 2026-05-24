import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

export async function writeAuditLog(args: {
  supabase?: SupabaseClient | null;
  tenantId: string;
  actorId: string | null;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const client = args.supabase ?? getSupabaseAdmin();
  if (!client) return;

  await client.from("audit_logs").insert({
    tenant_id: args.tenantId,
    actor_id: args.actorId,
    action: args.action,
    resource_type: args.resourceType ?? null,
    resource_id: args.resourceId ?? null,
    metadata: args.metadata ?? {},
  });
}
