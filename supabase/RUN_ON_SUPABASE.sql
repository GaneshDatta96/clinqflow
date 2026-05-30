-- =============================================================================
-- CliniqFlow — COMPLETE Supabase setup (SQL Editor)
-- Project: rukcgmyurytfqxyxzfjh
-- URL: https://rukcgmyurytfqxyxzfjh.supabase.co
--
-- WHEN TO USE THIS FILE
--   • Fresh Supabase project → run this entire file once.
--   • Already ran older RUN_ON_SUPABASE.sql → run ONLY the migrations you
--     are missing (see list below), or use repair_finish_setup.sql for policy
--     duplicates, then run migrations 20260601–20260606.
--
-- MIGRATION ORDER (also in supabase/migrations/)
--   1. 20260415070000_init.sql
--   2. 20260415101500_add_appointment_requests.sql
--   3. 20260521000000_saas_foundation.sql
--   4. 20260521120000_platform_admins.sql
--   5. 20260601000000_remove_demo_surface.sql
--   6. 20260602000000_production_hardening.sql
--   7. 20260603000000_add_support_role.sql
--   8. 20260604000000_platform_support_role.sql
--   9. 20260605000000_security_hardening.sql
--  10. 20260606000000_paypal_webhook_events.sql
--
-- AFTER THIS SQL (run locally from repo root — NOT in SQL Editor)
--   npm run seed:niche-configs          Load specialty intake configs
--   npm run db:backfill-tenants         Only if you had legacy rows before SaaS
--
-- PLATFORM ADMIN (local terminal, not SQL Editor)
--   $env:PLATFORM_ADMIN_PASSWORD='your-password'
--   node --env-file-if-exists=.env scripts/create-platform-admin.mjs
--   (Set PLATFORM_ADMIN_EMAILS in .env first)
--
-- SUPABASE DASHBOARD — Authentication → URL configuration
--   Site URL: https://cliniqflow.app
--   Redirect URLs:
--     https://cliniqflow.app/auth/callback
--     https://cliniqflow.vercel.app/auth/callback
--     http://localhost:3000/auth/callback
--
-- VERCEL ENV (Production) — same Supabase keys + APP_URL + PLATFORM_ADMIN_EMAILS
--   See .env.example and docs/SUPABASE_SETUP.md
--
-- ALTERNATIVE: Supabase CLI (after npx supabase link --project-ref rukcgmyurytfqxyxzfjh)
--   npm run supabase:push
-- =============================================================================


-- ========== 20260415070000_init.sql ==========

create extension if not exists pgcrypto;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  dob date,
  sex_at_birth text,
  gender_identity text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.encounters (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  status text not null default 'draft',
  chief_complaint text not null,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references public.encounters(id) on delete cascade,
  schema_version text not null,
  raw_json jsonb not null,
  normalized_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null references public.encounters(id) on delete cascade,
  pattern_key text not null,
  confidence numeric(4, 2) not null,
  evidence jsonb not null default '[]'::jsonb,
  data_gaps jsonb not null default '[]'::jsonb,
  risk_level text not null,
  rank integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.soap_notes (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null unique references public.encounters(id) on delete cascade,
  subjective text not null,
  objective text not null,
  assessment text not null,
  plan text not null,
  soap_json jsonb not null,
  prompt_version text not null,
  model text not null,
  review_status text not null default 'draft',
  created_at timestamptz not null default now()
);

create index if not exists encounters_patient_status_idx
  on public.encounters (patient_id, status, submitted_at desc nulls last);

create index if not exists assessment_results_encounter_rank_idx
  on public.assessment_results (encounter_id, rank);

-- ========== 20260415101500_add_appointment_requests.sql ==========

create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null unique references public.encounters(id) on delete cascade,
  preferred_day text not null,
  preferred_time text not null,
  notes text not null default '',
  status text not null default 'requested',
  requested_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists appointment_requests_status_idx
  on public.appointment_requests (status, requested_at desc);

-- ========== 20260521000000_saas_foundation.sql ==========

-- Cliniqflow SaaS foundation: multi-tenant schema, RBAC, RLS, billing hooks
-- Supersedes ad-hoc tenant tables (intakes/soap_reports) â€” use encounters pipeline only.

-- ---------------------------------------------------------------------------
-- Extensions & enums
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

do $$ begin
  create type public.tenant_role as enum (
    'owner', 'admin', 'practitioner', 'staff', 'viewer'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_status as enum (
    'trialing', 'active', 'past_due', 'canceled', 'incomplete'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.encounter_status as enum (
    'draft', 'submitted', 'in_review', 'completed', 'archived'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.intake_link_status as enum (
    'active', 'expired', 'revoked', 'completed'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Tenants (organizations)
-- ---------------------------------------------------------------------------
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  stripe_customer_id text unique,
  plan_key text not null default 'trial',
  subscription_status public.subscription_status not null default 'trialing',
  trial_ends_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists tenants_slug_idx on public.tenants (slug) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Memberships (RBAC)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.tenant_role not null default 'staff',
  invited_by uuid references public.profiles (id),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists tenant_memberships_user_idx
  on public.tenant_memberships (user_id, tenant_id);

-- ---------------------------------------------------------------------------
-- Invites
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_invites (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  email text not null,
  role public.tenant_role not null default 'staff',
  token_hash text not null unique,
  invited_by uuid not null references public.profiles (id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists tenant_invites_email_idx
  on public.tenant_invites (tenant_id, email);

-- ---------------------------------------------------------------------------
-- Clinics (tenant-scoped locations)
-- ---------------------------------------------------------------------------
create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  slug text not null,
  niche text not null,
  location text,
  country text default 'United States',
  website text,
  description text,
  approach text,
  is_demo boolean not null default false,
  settings jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (tenant_id, slug)
);

create index if not exists clinics_tenant_idx
  on public.clinics (tenant_id, created_at desc) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Niche configs (global + tenant overrides optional later)
-- ---------------------------------------------------------------------------
create table if not exists public.niche_configs (
  niche text primary key,
  config jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Alter legacy patients for tenancy
-- ---------------------------------------------------------------------------
alter table public.patients
  add column if not exists tenant_id uuid references public.tenants (id) on delete cascade,
  add column if not exists clinic_id uuid references public.clinics (id) on delete set null,
  add column if not exists created_by uuid references public.profiles (id),
  add column if not exists updated_at timestamptz default now(),
  add column if not exists deleted_at timestamptz;

create index if not exists patients_tenant_clinic_idx
  on public.patients (tenant_id, clinic_id, created_at desc)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Alter encounters for tenancy
-- ---------------------------------------------------------------------------
alter table public.encounters
  add column if not exists tenant_id uuid references public.tenants (id) on delete cascade,
  add column if not exists clinic_id uuid references public.clinics (id) on delete set null,
  add column if not exists created_by uuid references public.profiles (id),
  add column if not exists updated_at timestamptz default now(),
  add column if not exists deleted_at timestamptz;

create index if not exists encounters_tenant_status_idx
  on public.encounters (tenant_id, status, submitted_at desc nulls last)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Intake links (signed patient access)
-- ---------------------------------------------------------------------------
create table if not exists public.intake_links (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  token_hash text not null unique,
  status public.intake_link_status not null default 'active',
  expires_at timestamptz not null,
  completed_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index if not exists intake_links_patient_idx
  on public.intake_links (patient_id, status);

-- ---------------------------------------------------------------------------
-- Intake drafts (resume flow)
-- ---------------------------------------------------------------------------
create table if not exists public.intake_drafts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  clinic_id uuid not null references public.clinics (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  intake_link_id uuid references public.intake_links (id) on delete set null,
  step_index integer not null default 0,
  answers_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (patient_id, clinic_id)
);

-- ---------------------------------------------------------------------------
-- AI generation audit
-- ---------------------------------------------------------------------------
create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  encounter_id uuid references public.encounters (id) on delete set null,
  prompt_version text not null,
  model text not null,
  input_tokens integer,
  output_tokens integer,
  used_fallback boolean not null default false,
  status text not null default 'completed',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index if not exists ai_generations_tenant_idx
  on public.ai_generations (tenant_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_tenant_idx
  on public.audit_logs (tenant_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Subscriptions & usage
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants (id) on delete cascade,
  stripe_subscription_id text unique,
  plan_key text not null,
  status public.subscription_status not null default 'trialing',
  seat_limit integer not null default 5,
  ai_monthly_limit integer not null default 500,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_tracking (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  metric_key text not null,
  quantity integer not null default 1,
  recorded_at timestamptz not null default now()
);

create index if not exists usage_tracking_tenant_metric_idx
  on public.usage_tracking (tenant_id, metric_key, recorded_at desc);

-- ---------------------------------------------------------------------------
-- API keys (tenant service integrations)
-- ---------------------------------------------------------------------------
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  last_used_at timestamptz,
  created_by uuid references public.profiles (id),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helper: current user's tenant ids
-- ---------------------------------------------------------------------------
create or replace function public.current_tenant_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id
  from public.tenant_memberships
  where user_id = auth.uid();
$$;

create or replace function public.has_tenant_role(p_tenant_id uuid, p_roles public.tenant_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tenant_memberships
    where tenant_id = p_tenant_id
      and user_id = auth.uid()
      and role = any (p_roles)
  );
$$;

create or replace function public.can_write_tenant(p_tenant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_tenant_role(
    p_tenant_id,
    array['owner', 'admin', 'practitioner', 'staff']::public.tenant_role[]
  );
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.tenant_invites enable row level security;
alter table public.clinics enable row level security;
alter table public.patients enable row level security;
alter table public.encounters enable row level security;
alter table public.intake_submissions enable row level security;
alter table public.assessment_results enable row level security;
alter table public.soap_notes enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.intake_links enable row level security;
alter table public.intake_drafts enable row level security;
alter table public.ai_generations enable row level security;
alter table public.audit_logs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_tracking enable row level security;
alter table public.api_keys enable row level security;
alter table public.niche_configs enable row level security;

-- Tenants
create policy tenants_select on public.tenants for select
  using (id in (select public.current_tenant_ids()));
create policy tenants_update on public.tenants for update
  using (public.has_tenant_role(id, array['owner', 'admin']::public.tenant_role[]));

-- Profiles
create policy profiles_select_own on public.profiles for select
  using (id = auth.uid());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid());
create policy profiles_select_tenant_peers on public.profiles for select
  using (
    id in (
      select user_id from public.tenant_memberships
      where tenant_id in (select public.current_tenant_ids())
    )
  );

-- Memberships
create policy memberships_select on public.tenant_memberships for select
  using (tenant_id in (select public.current_tenant_ids()));
create policy memberships_manage on public.tenant_memberships for all
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[]));

-- Invites
create policy invites_select on public.tenant_invites for select
  using (tenant_id in (select public.current_tenant_ids()));
create policy invites_manage on public.tenant_invites for all
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[]));

-- Clinics
create policy clinics_select on public.clinics for select
  using (tenant_id in (select public.current_tenant_ids()) and deleted_at is null);
create policy clinics_write on public.clinics for insert
  with check (public.can_write_tenant(tenant_id));
create policy clinics_update on public.clinics for update
  using (public.has_tenant_role(tenant_id, array['owner', 'admin', 'practitioner']::public.tenant_role[]));
create policy clinics_delete on public.clinics for delete
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[]));

-- Patients
create policy patients_tenant on public.patients for all
  using (tenant_id in (select public.current_tenant_ids()) and deleted_at is null)
  with check (public.can_write_tenant(tenant_id));

-- Encounters + children via encounter tenant
create policy encounters_tenant on public.encounters for all
  using (tenant_id in (select public.current_tenant_ids()) and deleted_at is null)
  with check (public.can_write_tenant(tenant_id));

create policy intake_submissions_tenant on public.intake_submissions for all
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy assessment_results_tenant on public.assessment_results for all
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy soap_notes_tenant on public.soap_notes for all
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

create policy appointment_requests_tenant on public.appointment_requests for all
  using (
    encounter_id in (
      select id from public.encounters
      where tenant_id in (select public.current_tenant_ids())
    )
  );

-- Intake links: staff manage; patient access via service role + token validation in API
create policy intake_links_staff on public.intake_links for all
  using (tenant_id in (select public.current_tenant_ids()))
  with check (public.can_write_tenant(tenant_id));

create policy intake_drafts_staff on public.intake_drafts for all
  using (tenant_id in (select public.current_tenant_ids()))
  with check (public.can_write_tenant(tenant_id));

-- AI, audit, billing
create policy ai_generations_tenant on public.ai_generations for select
  using (tenant_id in (select public.current_tenant_ids()));
create policy audit_logs_tenant on public.audit_logs for select
  using (tenant_id in (select public.current_tenant_ids()));
create policy subscriptions_tenant on public.subscriptions for select
  using (tenant_id in (select public.current_tenant_ids()));
create policy usage_tenant on public.usage_tracking for select
  using (tenant_id in (select public.current_tenant_ids()));
create policy api_keys_admin on public.api_keys for all
  using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[]));

-- Niche configs: readable by all authenticated users
create policy niche_configs_read on public.niche_configs for select
  using (auth.uid() is not null);

-- ---------------------------------------------------------------------------
-- Seed default niche configs from app (idempotent upsert placeholders)
-- ---------------------------------------------------------------------------
-- Run scripts/seed-niche-configs.mjs after deploy to populate from niche_configs.json

-- ========== 20260521120000_platform_admins.sql ==========

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

-- ========== 20260601000000_remove_demo_surface.sql ==========

-- Deprecate demo clinic flag; pure SaaS uses tenant-owned clinics only.
alter table public.clinics
  alter column is_demo set default false;

comment on column public.clinics.is_demo is
  'Deprecated. Retained for backward compatibility; new clinics must be is_demo = false.';

-- ========== 20260602000000_production_hardening.sql ==========

-- Production hardening: RLS writes, compliance tables, billing idempotency, tenant NOT NULL

-- ---------------------------------------------------------------------------
-- Stripe webhook idempotency
-- ---------------------------------------------------------------------------
create table if not exists public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

-- ---------------------------------------------------------------------------
-- HIPAA-oriented tables
-- ---------------------------------------------------------------------------
create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  encounter_id uuid references public.encounters (id) on delete set null,
  consent_version text not null,
  ip_address inet,
  user_agent text,
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists consent_records_tenant_idx
  on public.consent_records (tenant_id, signed_at desc);

create table if not exists public.baa_agreements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  vendor text not null,
  signed_at timestamptz not null,
  document_url text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists baa_agreements_tenant_idx
  on public.baa_agreements (tenant_id, vendor);

create table if not exists public.prompt_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants (id) on delete cascade,
  template_key text not null,
  version text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, template_key, version)
);

create index if not exists prompt_templates_lookup_idx
  on public.prompt_templates (template_key, is_active)
  where tenant_id is null;

-- ---------------------------------------------------------------------------
-- AI job queue
-- ---------------------------------------------------------------------------
create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  encounter_id uuid not null references public.encounters (id) on delete cascade,
  status text not null default 'pending',
  attempts integer not null default 0,
  last_error text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_jobs_status_idx
  on public.ai_jobs (status, created_at asc)
  where status in ('pending', 'processing');

-- ---------------------------------------------------------------------------
-- Legacy column hardening
-- ---------------------------------------------------------------------------
alter table public.patients
  add column if not exists updated_by uuid references public.profiles (id);

alter table public.encounters
  add column if not exists updated_by uuid references public.profiles (id);

-- Backfill tenant_id from clinic when possible (no-op if already set)
update public.patients p
set tenant_id = c.tenant_id
from public.clinics c
where p.tenant_id is null and p.clinic_id = c.id;

update public.encounters e
set tenant_id = p.tenant_id
from public.patients p
where e.tenant_id is null and e.patient_id = p.id and p.tenant_id is not null;

-- Delete orphan legacy rows without tenant (demo-era data)
delete from public.encounters where tenant_id is null;
delete from public.patients where tenant_id is null;

alter table public.patients
  alter column tenant_id set not null;

alter table public.encounters
  alter column tenant_id set not null;

-- ---------------------------------------------------------------------------
-- RLS: tenant INSERT for observability tables
-- ---------------------------------------------------------------------------
create policy ai_generations_insert on public.ai_generations for insert
  with check (
    tenant_id in (select public.current_tenant_ids())
    and public.can_write_tenant(tenant_id)
  );

create policy audit_logs_insert on public.audit_logs for insert
  with check (
    tenant_id in (select public.current_tenant_ids())
    and public.can_write_tenant(tenant_id)
  );

create policy usage_tracking_insert on public.usage_tracking for insert
  with check (
    tenant_id in (select public.current_tenant_ids())
    and public.can_write_tenant(tenant_id)
  );

-- Compliance tables
alter table public.consent_records enable row level security;
alter table public.baa_agreements enable row level security;
alter table public.prompt_templates enable row level security;
alter table public.ai_jobs enable row level security;

create policy consent_records_tenant on public.consent_records for all
  using (tenant_id in (select public.current_tenant_ids()))
  with check (public.can_write_tenant(tenant_id));

create policy baa_agreements_tenant on public.baa_agreements for all
  using (tenant_id in (select public.current_tenant_ids()))
  with check (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[]));

create policy prompt_templates_read on public.prompt_templates for select
  using (tenant_id is null or tenant_id in (select public.current_tenant_ids()));

create policy prompt_templates_write on public.prompt_templates for insert
  with check (
    tenant_id is null
    or (
      tenant_id in (select public.current_tenant_ids())
      and public.has_tenant_role(tenant_id, array['owner', 'admin']::public.tenant_role[])
    )
  );

create policy ai_jobs_tenant on public.ai_jobs for all
  using (tenant_id in (select public.current_tenant_ids()))
  with check (public.can_write_tenant(tenant_id));

-- Platform admin policies (mirror existing pattern)
create policy platform_admin_consent on public.consent_records for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy platform_admin_baa on public.baa_agreements for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy platform_admin_prompts on public.prompt_templates for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy platform_admin_ai_jobs on public.ai_jobs for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ========== 20260603000000_add_support_role.sql ==========

-- Customer service / support role for intake-focused staff
do $$ begin
  alter type public.tenant_role add value if not exists 'support';
exception when duplicate_object then null;
end $$;

-- ========== 20260604000000_platform_support_role.sql ==========

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

-- ========== 20260605000000_security_hardening.sql ==========

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

drop trigger if exists profiles_prevent_privilege_escalation on public.profiles;
create trigger profiles_prevent_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_privilege_escalation();

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Reset rogue flags; legitimate staff are re-synced via service role on next login
update public.profiles
set
  is_platform_admin = false,
  is_platform_support = false,
  updated_at = now()
where is_platform_admin = true or is_platform_support = true;

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
-- C-03: Platform support â€” cross-tenant SELECT only (no direct writes)
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

-- ========== 20260606000000_paypal_webhook_events.sql ==========

-- PayPal webhook idempotency (run in SQL Editor if not using full RUN_ON_SUPABASE.sql)

create table if not exists public.paypal_webhook_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.paypal_webhook_events enable row level security;

comment on table public.paypal_webhook_events is
  'Idempotency store for PayPal REST webhooks';

-- =============================================================================
-- POST-RUN VERIFICATION (optional)
-- =============================================================================
-- If db push failed with "policy already exists", run repair_finish_setup.sql next.
-- =============================================================================
