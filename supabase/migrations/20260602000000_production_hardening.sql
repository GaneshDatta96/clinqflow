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
