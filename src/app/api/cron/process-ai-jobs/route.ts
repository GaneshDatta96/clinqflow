import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { assertCronAuthorized } from "@/lib/cron/verify";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { logError, logInfo } from "@/lib/logging/logger";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = createApiHandler({
  route: "/api/cron/process-ai-jobs",
  step: "cron_process_ai_jobs",
  rateLimit: "cron",
  handler: async ({ request }) => {
    assertCronAuthorized(request);

    const admin = getSupabaseAdmin();
    if (!admin) {
      return jsonOk({ processed: 0, skipped: "no_database" });
    }

    const { data: jobs } = await admin
      .from("ai_jobs")
      .select("id, tenant_id, encounter_id, attempts, payload")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10);

    let processed = 0;

    for (const job of jobs ?? []) {
      await admin
        .from("ai_jobs")
        .update({ status: "processing", updated_at: new Date().toISOString() })
        .eq("id", job.id);

      try {
        logInfo({
          message: "cron.ai_job.start",
          step: "process_ai_jobs",
          status: "started",
          metadata: { jobId: job.id, encounterId: job.encounter_id },
        });

        await admin
          .from("ai_jobs")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", job.id);

        processed += 1;
      } catch (error) {
        logError({
          message: "cron.ai_job.failed",
          step: "process_ai_jobs",
          status: "error",
          error,
          metadata: { jobId: job.id },
        });

        await admin
          .from("ai_jobs")
          .update({
            status: (job.attempts ?? 0) >= 2 ? "failed" : "pending",
            attempts: (job.attempts ?? 0) + 1,
            last_error: error instanceof Error ? error.message : "Unknown error",
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }
    }

    return jsonOk({ processed, queued: jobs?.length ?? 0 });
  },
});
