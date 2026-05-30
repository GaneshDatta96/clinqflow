-- PayPal webhook idempotency (run in SQL Editor if not using full RUN_ON_SUPABASE.sql)

create table if not exists public.paypal_webhook_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.paypal_webhook_events enable row level security;

comment on table public.paypal_webhook_events is
  'Idempotency store for PayPal REST webhooks';
