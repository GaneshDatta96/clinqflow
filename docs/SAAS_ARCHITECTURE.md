# Cliniqflow SaaS Architecture

## Overview

Cliniqflow is a multi-tenant B2B SaaS for outpatient wellness clinics: pre-visit intake, deterministic pattern scoring, and AI-assisted SOAP drafting with clinician review.

**Pure self-serve model:** Signup → email verification → onboarding (tenant + clinic) → invite team → create patients → secure intake links → practitioner review. No DFY demo or orchestrator flows.

## Tenancy model

```
Tenant (organization)
  └── tenant_memberships (users + roles)
  └── clinics (1..n)
        └── patients → encounters → intake, assessment, SOAP
```

- **Isolation**: `tenant_id` on clinical rows; Supabase RLS + API guards
- **Active org**: cookie `cliniqflow_active_tenant_id` for multi-org users
- **Roles**: `owner`, `admin`, `practitioner`, `staff`, `viewer`

## Auth

- Supabase Auth + `@supabase/ssr`
- Email verification required before workspace access
- Onboarding: `POST /api/auth/onboarding`
- Invites: `/invite/accept` (invitable roles exclude `owner`)

## Public intake

- Staff creates patient → `POST /api/intake/links` → JWT URL `/c/{slug}?patientId&token=`
- Patient submits with consent → `POST /api/intake/public/submit`

## Database migrations

1. `20260415070000_init.sql`
2. `20260415101500_add_appointment_requests.sql`
3. `20260521000000_saas_foundation.sql`
4. `20260521120000_platform_admins.sql`
5. `20260601000000_remove_demo_surface.sql`
6. `20260602000000_production_hardening.sql`

## Billing

- Stripe Checkout + Customer Portal
- Webhooks with idempotency (`stripe_webhook_events`)
- Plans: `trial`, `starter`, `growth`, `enterprise` — see `PLAN_LIMITS` in `src/lib/billing/stripe.ts`

## Compliance

- `consent_records`, `baa_agreements`, audit export
- See [HIPAA.md](./HIPAA.md), [OPERATIONS.md](./OPERATIONS.md)

## Deploy

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

```bash
npm run supabase:push
npm run seed:niche-configs
```
