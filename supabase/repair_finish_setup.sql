-- Run in Supabase SQL Editor if `db push` failed on duplicate policies
-- but tables already exist. Safe to re-run.

-- Platform admin column + function (idempotent)
alter table public.profiles
  add column if not exists is_platform_admin boolean not null default false;

create index if not exists profiles_platform_admin_idx
  on public.profiles (is_platform_admin)
  where is_platform_admin = true;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_platform_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Platform admin policies (drop + recreate)
drop policy if exists platform_admin_tenants on public.tenants;
drop policy if exists platform_admin_profiles on public.profiles;
drop policy if exists platform_admin_memberships on public.tenant_memberships;
drop policy if exists platform_admin_invites on public.tenant_invites;
drop policy if exists platform_admin_clinics on public.clinics;
drop policy if exists platform_admin_patients on public.patients;
drop policy if exists platform_admin_encounters on public.encounters;
drop policy if exists platform_admin_intake_submissions on public.intake_submissions;
drop policy if exists platform_admin_assessment_results on public.assessment_results;
drop policy if exists platform_admin_soap_notes on public.soap_notes;
drop policy if exists platform_admin_appointment_requests on public.appointment_requests;
drop policy if exists platform_admin_intake_links on public.intake_links;
drop policy if exists platform_admin_intake_drafts on public.intake_drafts;
drop policy if exists platform_admin_ai_generations on public.ai_generations;
drop policy if exists platform_admin_audit_logs on public.audit_logs;
drop policy if exists platform_admin_subscriptions on public.subscriptions;
drop policy if exists platform_admin_usage on public.usage_tracking;
drop policy if exists platform_admin_api_keys on public.api_keys;
drop policy if exists platform_admin_niche_configs on public.niche_configs;

create policy platform_admin_tenants on public.tenants for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_profiles on public.profiles for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_memberships on public.tenant_memberships for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_invites on public.tenant_invites for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_clinics on public.clinics for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_patients on public.patients for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_encounters on public.encounters for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_intake_submissions on public.intake_submissions for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_assessment_results on public.assessment_results for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_soap_notes on public.soap_notes for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_appointment_requests on public.appointment_requests for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_intake_links on public.intake_links for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_intake_drafts on public.intake_drafts for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_ai_generations on public.ai_generations for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_audit_logs on public.audit_logs for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_subscriptions on public.subscriptions for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_usage on public.usage_tracking for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_api_keys on public.api_keys for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
create policy platform_admin_niche_configs on public.niche_configs for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());
