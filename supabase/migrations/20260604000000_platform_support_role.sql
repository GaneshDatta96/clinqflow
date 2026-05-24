-- Platform customer support: Cliniqflow staff who help clinics/practitioners.
-- Distinct from God mode (is_platform_admin) and from tenant membership roles.

alter table public.profiles
  add column if not exists is_platform_support boolean not null default false;

create index if not exists profiles_platform_support_idx
  on public.profiles (is_platform_support)
  where is_platform_support = true;

create or replace function public.is_platform_support()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_platform_support from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_platform_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_platform_admin() or public.is_platform_support();
$$;

-- Mirror platform admin RLS for support staff (cross-tenant read/write when helping customers)
create policy platform_support_tenants on public.tenants for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_profiles on public.profiles for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_memberships on public.tenant_memberships for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_invites on public.tenant_invites for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_clinics on public.clinics for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_patients on public.patients for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_encounters on public.encounters for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_intake_submissions on public.intake_submissions for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_assessment_results on public.assessment_results for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_soap_notes on public.soap_notes for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_appointment_requests on public.appointment_requests for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_intake_links on public.intake_links for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_intake_drafts on public.intake_drafts for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_ai_generations on public.ai_generations for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_audit_logs on public.audit_logs for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_subscriptions on public.subscriptions for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_usage on public.usage_tracking for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_api_keys on public.api_keys for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_niche_configs on public.niche_configs for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_consent on public.consent_records for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_baa on public.baa_agreements for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_prompts on public.prompt_templates for all
  using (public.is_platform_support()) with check (public.is_platform_support());

create policy platform_support_ai_jobs on public.ai_jobs for all
  using (public.is_platform_support()) with check (public.is_platform_support());
