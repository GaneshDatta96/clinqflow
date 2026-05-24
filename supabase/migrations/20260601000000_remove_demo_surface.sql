-- Deprecate demo clinic flag; pure SaaS uses tenant-owned clinics only.
alter table public.clinics
  alter column is_demo set default false;

comment on column public.clinics.is_demo is
  'Deprecated. Retained for backward compatibility; new clinics must be is_demo = false.';
