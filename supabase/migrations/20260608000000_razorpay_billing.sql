-- Razorpay subscription billing support

alter table public.subscriptions
  add column if not exists razorpay_subscription_id text unique;

create table if not exists public.razorpay_webhook_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.razorpay_webhook_events enable row level security;

comment on table public.razorpay_webhook_events is
  'Idempotency store for Razorpay webhooks';
