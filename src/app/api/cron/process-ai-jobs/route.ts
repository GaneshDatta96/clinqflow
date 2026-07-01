import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { assertCronAuthorized } from "@/lib/cron/verify";
import {
  runSoapEnhancementJobWithLogging,
  type SoapEnhancementJobPayload,
} from "@/lib/ai/soap-jobs";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { logInfo } from "@/lib/logging/logger";

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

      logInfo({
        message: "cron.ai_job.start",
        step: "process_ai_jobs",
        status: "started",
        metadata: { jobId: job.id, encounterId: job.encounter_id },
      });

      const result = await runSoapEnhancementJobWithLogging(admin, {
        id: job.id,
        tenant_id: job.tenant_id,
        encounter_id: job.encounter_id,
        attempts: job.attempts,
        payload: (job.payload as SoapEnhancementJobPayload | null) ?? null,
      });

      if (result.ok) {
        await admin
          .from("ai_jobs")
          .update({
            status: "completed",
            updated_at: new Date().toISOString(),
            last_error: null,
          })
          .eq("id", job.id);
        processed += 1;
        continue;
      }

      const attempts = (job.attempts ?? 0) + 1;
      await admin
        .from("ai_jobs")
        .update({
          status: attempts >= 3 ? "failed" : "pending",
          attempts,
          last_error:
            result.error instanceof Error
              ? result.error.message
              : "Unknown error",
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);
    }

    return jsonOk({ processed, queued: jobs?.length ?? 0 });
  },
});
