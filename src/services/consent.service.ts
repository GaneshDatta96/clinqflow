import { getSupabaseAdmin } from "@/lib/db/supabase-admin";

export const CURRENT_CONSENT_VERSION = "2026-05-30";

export async function recordConsent(args: {
  tenantId: string;
  patientId: string;
  encounterId?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  await admin.from("consent_records").insert({
    tenant_id: args.tenantId,
    patient_id: args.patientId,
    encounter_id: args.encounterId ?? null,
    consent_version: CURRENT_CONSENT_VERSION,
    ip_address: args.ipAddress,
    user_agent: args.userAgent,
  });
}
