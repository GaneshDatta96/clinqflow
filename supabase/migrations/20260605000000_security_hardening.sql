-- Security hardening: C-01 profile escalation, C-03 support read-only, H-04 viewer write, TEN-03 tenant consistency

-- ---------------------------------------------------------------------------
-- C-01: Block self-escalation to platform admin/support
-- ---------------------------------------------------------------------------
create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if new.is_platform_admin is distinct from old.is_platform_admin
     or new.is_platform_support is distinct from old.is_platform_support then
    raise exception 'Cannot modify platform privilege flags';
  end if;

  return new;
end;
$$;

-- Reset rogue flags before the escalation trigger exists; staff are re-synced on login.
drop trigger if exists profiles_prevent_privilege_escalation on public.profiles;
update public.profiles
set
  is_platform_admin = false,
  is_platform_support = false,
  updated_at = now()
where is_platform_admin = true or is_platform_support = true;

create trigger profiles_prevent_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_privilege_escalation();

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- TEN-03: Encounter patient must belong to same tenant
-- ---------------------------------------------------------------------------
create or replace function public.check_encounter_patient_tenant()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  patient_tenant uuid;
begin
  select tenant_id into patient_tenant
  from public.patients
  where id = new.patient_id;

  if patient_tenant is null then
    raise exception 'Patient not found for encounter';
  end if;

  if patient_tenant is distinct from new.tenant_id then
    raise exception 'Encounter tenant must match patient tenant';
  end if;

  return new;
end;
$$;

drop trigger if exists encounters_patient_tenant_check on public.encounters;
create trigger encounters_patient_tenant_check
  before insert or update of patient_id, tenant_id on public.encounters
  for each row execute function public.check_encounter_patient_tenant();

-- ---------------------------------------------------------------------------
-- TEN-04: Globally unique clinic slugs for safe public intake lookup
-- ---------------------------------------------------------------------------
create unique index if not exists clinics_slug_global_unique_idx
  on public.clinics (slug)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- H-04: Viewer cannot write SOAP-related child tables
-- ---------------------------------------------------------------------------
drop policy if exists assessment_results_tenant on public.assessment_results;
drop policy if exists soap_notes_tenant on public.soap_notes;
drop policy if exists intake_submissions_tenant on public.intake_submissions;
drop policy if exists appointment_requests_tenant on public.appointment_requests;

create policy assessment_results_select on public.assessment_results for select
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy assessment_results_insert on public.assessment_results for insert
  with check (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy assessment_results_update on public.assessment_results for update
  using (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy assessment_results_delete on public.assessment_results for delete
  using (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy soap_notes_select on public.soap_notes for select
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy soap_notes_insert on public.soap_notes for insert
  with check (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy soap_notes_update on public.soap_notes for update
  using (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy soap_notes_delete on public.soap_notes for delete
  using (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy intake_submissions_select on public.intake_submissions for select
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy intake_submissions_insert on public.intake_submissions for insert
  with check (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy appointment_requests_select on public.appointment_requests for select
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy appointment_requests_insert on public.appointment_requests for insert
  with check (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

create policy appointment_requests_update on public.appointment_requests for update
  using (
    encounter_id in (
      select e.id from public.encounters e
      where e.tenant_id in (select public.current_tenant_ids())
        and public.can_write_tenant(e.tenant_id)
    )
  );

-- ---------------------------------------------------------------------------
-- Restrict global prompt template inserts to service role only
-- ---------------------------------------------------------------------------
drop policy if exists prompt_templates_write on public.prompt_templates;
create policy prompt_templates_write on public.prompt_templates for insert
  with check (
    tenant_id is not null
    and tenant_id in (select public.current_tenant_ids())
    and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[])
  );

-- ---------------------------------------------------------------------------
-- C-03: Platform support — cross-tenant SELECT only (no direct writes)
-- ---------------------------------------------------------------------------
drop policy if exists platform_support_tenants on public.tenants;
drop policy if exists platform_support_profiles on public.profiles;
drop policy if exists platform_support_memberships on public.tenant_memberships;
drop policy if exists platform_support_invites on public.tenant_invites;
drop policy if exists platform_support_clinics on public.clinics;
drop policy if exists platform_support_patients on public.patients;
drop policy if exists platform_support_encounters on public.encounters;
drop policy if exists platform_support_intake_submissions on public.intake_submissions;
drop policy if exists platform_support_assessment_results on public.assessment_results;
drop policy if exists platform_support_soap_notes on public.soap_notes;
drop policy if exists platform_support_appointment_requests on public.appointment_requests;
drop policy if exists platform_support_intake_links on public.intake_links;
drop policy if exists platform_support_intake_drafts on public.intake_drafts;
drop policy if exists platform_support_ai_generations on public.ai_generations;
drop policy if exists platform_support_audit_logs on public.audit_logs;
drop policy if exists platform_support_subscriptions on public.subscriptions;
drop policy if exists platform_support_usage on public.usage_tracking;
drop policy if exists platform_support_api_keys on public.api_keys;
drop policy if exists platform_support_niche_configs on public.niche_configs;
drop policy if exists platform_support_consent on public.consent_records;
drop policy if exists platform_support_baa on public.baa_agreements;
drop policy if exists platform_support_prompts on public.prompt_templates;
drop policy if exists platform_support_ai_jobs on public.ai_jobs;

create policy platform_support_tenants_select on public.tenants for select
  using (public.is_platform_support());
create policy platform_support_profiles_select on public.profiles for select
  using (public.is_platform_support());
create policy platform_support_memberships_select on public.tenant_memberships for select
  using (public.is_platform_support());
create policy platform_support_invites_select on public.tenant_invites for select
  using (public.is_platform_support());
create policy platform_support_clinics_select on public.clinics for select
  using (public.is_platform_support());
create policy platform_support_patients_select on public.patients for select
  using (public.is_platform_support());
create policy platform_support_encounters_select on public.encounters for select
  using (public.is_platform_support());
create policy platform_support_intake_submissions_select on public.intake_submissions for select
  using (public.is_platform_support());
create policy platform_support_assessment_results_select on public.assessment_results for select
  using (public.is_platform_support());
create policy platform_support_soap_notes_select on public.soap_notes for select
  using (public.is_platform_support());
create policy platform_support_appointment_requests_select on public.appointment_requests for select
  using (public.is_platform_support());
create policy platform_support_intake_links_select on public.intake_links for select
  using (public.is_platform_support());
create policy platform_support_intake_drafts_select on public.intake_drafts for select
  using (public.is_platform_support());
create policy platform_support_ai_generations_select on public.ai_generations for select
  using (public.is_platform_support());
create policy platform_support_audit_logs_select on public.audit_logs for select
  using (public.is_platform_support());
create policy platform_support_subscriptions_select on public.subscriptions for select
  using (public.is_platform_support());
create policy platform_support_usage_select on public.usage_tracking for select
  using (public.is_platform_support());
create policy platform_support_api_keys_select on public.api_keys for select
  using (public.is_platform_support());
create policy platform_support_niche_configs_select on public.niche_configs for select
  using (public.is_platform_support());
create policy platform_support_consent_select on public.consent_records for select
  using (public.is_platform_support());
create policy platform_support_baa_select on public.baa_agreements for select
  using (public.is_platform_support());
create policy platform_support_prompts_select on public.prompt_templates for select
  using (public.is_platform_support());
create policy platform_support_ai_jobs_select on public.ai_jobs for select
  using (public.is_platform_support());
