-- Remove Stripe billing artifacts (Razorpay is the active processor)

drop table if exists public.stripe_webhook_events;

alter table public.subscriptions
  drop column if exists stripe_subscription_id;

alter table public.tenants
  drop column if exists stripe_customer_id;
