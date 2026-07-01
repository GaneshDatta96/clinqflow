import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { assertCronAuthorized } from "@/lib/cron/verify";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

const DEFAULT_RETENTION_DAYS = 90;
const MIN_AUDIT_RETENTION_DAYS = 365;
const INTAKE_DRAFT_RETENTION_DAYS = 7;

export const GET = createApiHandler({
  route: "/api/cron/retention",
  step: "cron_retention",
  rateLimit: "cron",
  handler: async ({ request }) => {
    assertCronAuthorized(request);

    const admin = getSupabaseAdmin();
    if (!admin) {
      return jsonOk({ deleted: 0, skipped: "no_database" });
    }

    const configuredRetention = Number.isFinite(env.auditRetentionDays)
      ? env.auditRetentionDays
      : DEFAULT_RETENTION_DAYS;
    const auditRetentionDays = Math.max(configuredRetention, MIN_AUDIT_RETENTION_DAYS);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - auditRetentionDays);
    const cutoffIso = cutoff.toISOString();

    const usageCutoff = new Date();
    usageCutoff.setDate(usageCutoff.getDate() - DEFAULT_RETENTION_DAYS);

    const draftCutoff = new Date();
    draftCutoff.setDate(draftCutoff.getDate() - INTAKE_DRAFT_RETENTION_DAYS);

    const [
      { count: auditDeleted },
      { count: usageDeleted },
      { count: expiredInvites },
      { count: draftsDeleted },
    ] = await Promise.all([
      admin
        .from("audit_logs")
        .delete({ count: "exact" })
        .lt("created_at", cutoffIso),
      admin
        .from("usage_tracking")
        .delete({ count: "exact" })
        .lt("recorded_at", usageCutoff.toISOString()),
      admin
        .from("tenant_invites")
        .delete({ count: "exact" })
        .is("accepted_at", null)
        .lt("expires_at", new Date().toISOString()),
      admin
        .from("intake_drafts")
        .delete({ count: "exact" })
        .lt("updated_at", draftCutoff.toISOString()),
    ]);

    return jsonOk({
      auditLogsDeleted: auditDeleted ?? 0,
      usageRowsDeleted: usageDeleted ?? 0,
      expiredInvitesDeleted: expiredInvites ?? 0,
      intakeDraftsDeleted: draftsDeleted ?? 0,
      auditRetentionDays,
      intakeDraftRetentionDays: INTAKE_DRAFT_RETENTION_DAYS,
    });
  },
});
