/**
 * Backfill tenant_id on legacy patients/encounters before NOT NULL migration.
 * Usage: node --env-file-if-exists=.env.local scripts/backfill-tenant-ids.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: patients } = await admin
    .from("patients")
    .select("id, clinic_id")
    .is("tenant_id", null);

  for (const patient of patients ?? []) {
    if (!patient.clinic_id) continue;
    const { data: clinic } = await admin
      .from("clinics")
      .select("tenant_id")
      .eq("id", patient.clinic_id)
      .maybeSingle();
    if (clinic?.tenant_id) {
      await admin
        .from("patients")
        .update({ tenant_id: clinic.tenant_id })
        .eq("id", patient.id);
    }
  }

  const { data: encounters } = await admin
    .from("encounters")
    .select("id, patient_id")
    .is("tenant_id", null);

  for (const encounter of encounters ?? []) {
    const { data: patient } = await admin
      .from("patients")
      .select("tenant_id")
      .eq("id", encounter.patient_id)
      .maybeSingle();
    if (patient?.tenant_id) {
      await admin
        .from("encounters")
        .update({ tenant_id: patient.tenant_id })
        .eq("id", encounter.id);
    }
  }

  console.log("Backfill complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
