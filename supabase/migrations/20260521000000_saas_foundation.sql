-- Cliniqflow SaaS foundation: multi-tenant schema, RBAC, RLS, billing hooks
-- Supersedes ad-hoc tenant tables (intakes/soap_reports) — use encounters pipeline only.

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
