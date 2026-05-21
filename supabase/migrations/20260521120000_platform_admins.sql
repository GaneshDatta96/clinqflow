-- Platform admin ("god") accounts for customer support and cross-tenant operations.
-- Set is_platform_admin = true on your profile after first login, or via env sync in the app.

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

-- Permissive policies: platform admins bypass tenant membership (OR with existing policies)
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
