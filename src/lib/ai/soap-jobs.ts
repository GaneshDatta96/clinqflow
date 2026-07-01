import type { SupabaseClient } from "@supabase/supabase-js";
import { generateSoapDraft } from "@/lib/ai/generate-soap";
import { assertAiGenerationAllowed } from "@/lib/billing/entitlements";
import { getEncounterSoapContext } from "@/lib/db/repositories/intake";
import { logError, logInfo } from "@/lib/logging/logger";

export const SOAP_FALLBACK_PROMPT_VERSION = "soap_fallback_v1";
export const SOAP_FALLBACK_MODEL = "fallback/local-template";

export type SoapEnhancementJobPayload = {
  kind: "intake_soap_enhance";
  createdBy?: string;
};

export async function enqueueSoapEnhancementJob(
  supabase: SupabaseClient,
  args: {
    tenantId: string;
    encounterId: string;
    payload?: SoapEnhancementJobPayload;
  },
) {
  const { data: existing } = await supabase
    .from("ai_jobs")
    .select("id")
    .eq("encounter_id", args.encounterId)
    .in("status", ["pending", "processing"])
    .maybeSingle();

  if (existing) {
    return;
  }

  const insert = await supabase.from("ai_jobs").insert({
    tenant_id: args.tenantId,
    encounter_id: args.encounterId,
    status: "pending",
    payload: args.payload ?? { kind: "intake_soap_enhance" },
  });

  if (insert.error) {
    throw insert.error;
  }
}

export async function processSoapEnhancementJob(
  admin: SupabaseClient,
  job: {
    id: string;
    tenant_id: string;
    encounter_id: string;
    attempts: number | null;
    payload: SoapEnhancementJobPayload | null;
  },
) {
  await assertAiGenerationAllowed(job.tenant_id);

  const context = await getEncounterSoapContext(
    admin,
    job.tenant_id,
    job.encounter_id,
  );

  if (!context?.intake) {
    throw new Error("Encounter is missing intake data for SOAP enhancement.");
  }

  if (context.assessmentResults.length === 0) {
    throw new Error("Encounter is missing assessment results for SOAP enhancement.");
  }

  const generated = await generateSoapDraft({
    intake: context.intake,
    assessmentResults: context.assessmentResults,
  });

  const createdBy = job.payload?.createdBy;

  const [soapUpdate, generationInsert, usageInsert] = await Promise.all([
    admin.from("soap_notes").upsert(
      {
        encounter_id: job.encounter_id,
        subjective: generated.soap.subjective,
        objective: generated.soap.objective,
        assessment: generated.soap.assessment,
        plan: generated.soap.plan_draft,
        soap_json: generated.soap,
        prompt_version: generated.promptVersion,
        model: generated.model,
        review_status: "draft",
      },
      { onConflict: "encounter_id" },
    ),
    admin.from("ai_generations").insert({
      tenant_id: job.tenant_id,
      encounter_id: job.encounter_id,
      prompt_version: generated.promptVersion,
      model: generated.model,
      used_fallback: generated.usedFallback,
      created_by: createdBy ?? null,
    }),
    admin.from("usage_tracking").insert({
      tenant_id: job.tenant_id,
      metric_key: "ai_soap_generation",
      quantity: 1,
    }),
  ]);

  if (soapUpdate.error) {
    throw soapUpdate.error;
  }

  if (generationInsert.error) {
    throw generationInsert.error;
  }

  if (usageInsert.error) {
    throw usageInsert.error;
  }

  logInfo({
    message: "soap_job.completed",
    step: "process_ai_jobs",
    status: "ok",
    metadata: {
      jobId: job.id,
      encounterId: job.encounter_id,
      model: generated.model,
      usedFallback: generated.usedFallback,
    },
  });
}

export async function runSoapEnhancementJobWithLogging(
  admin: SupabaseClient,
  job: {
    id: string;
    tenant_id: string;
    encounter_id: string;
    attempts: number | null;
    payload: SoapEnhancementJobPayload | null;
  },
) {
  try {
    await processSoapEnhancementJob(admin, job);
    return { ok: true as const };
  } catch (error) {
    logError({
      message: "soap_job.failed",
      step: "process_ai_jobs",
      status: "error",
      error,
      metadata: { jobId: job.id, encounterId: job.encounter_id },
    });
    return { ok: false as const, error };
  }
}
