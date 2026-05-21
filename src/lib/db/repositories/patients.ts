import { type SupabaseClient } from "@supabase/supabase-js";

export async function createPatientForClinic(
  supabase: SupabaseClient,
  args: {
    tenantId: string;
    clinicId: string;
    firstName: string;
    lastName: string;
    email: string;
    createdBy: string;
    phone?: string;
  },
) {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      tenant_id: args.tenantId,
      clinic_id: args.clinicId,
      first_name: args.firstName,
      last_name: args.lastName,
      email: args.email,
      phone: args.phone ?? null,
      created_by: args.createdBy,
    })
    .select("id, first_name, last_name, email, created_at")
    .single();

  if (error || !data) {
    throw error ?? new Error("Patient insert failed.");
  }

  return data;
}

export async function listPatientsForTenant(
  supabase: SupabaseClient,
  tenantId: string,
  clinicId?: string,
) {
  let query = supabase
    .from("patients")
    .select("id, first_name, last_name, email, clinic_id, created_at")
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}
