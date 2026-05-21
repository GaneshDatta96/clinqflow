# Cliniqflow SaaS Architecture

## Overview

Cliniqflow is a multi-tenant B2B SaaS for outpatient wellness clinics: pre-visit intake, deterministic pattern scoring, and AI-assisted SOAP drafting with clinician review.

## Tenancy model

```
Tenant (organization)
  └── tenant_memberships (users + roles)
  └── clinics (1..n locations / brands)
        └── patients
        └── encounters → intake_submissions, assessment_results, soap_notes
```

- **Isolation**: Every clinical row carries `tenant_id`. Supabase RLS enforces membership.
- **Roles**: `owner`, `admin`, `practitioner`, `staff`, `viewer` — see `src/lib/tenancy/permissions.ts`.

## Auth

- Supabase Auth (email/password) with `@supabase/ssr` cookies.
- `src/middleware.ts` protects `/app/*` and authenticated APIs.
- Onboarding: `POST /api/auth/onboarding` creates tenant + owner membership + default clinic.

## Public intake

- Staff creates patient → `POST /api/intake/links` returns signed JWT URL.
- Patient opens `/c/{clinic-slug}?patientId=…&token=…`
- Submit via `POST /api/intake/public/submit` with `x-intake-token` header (no session).

## API layers

| Layer | Client | Use |
|-------|--------|-----|
| User session | Anon key + JWT | Dashboard, patients, authenticated intake |
| Service role | Admin client | Public intake validation, webhooks, orchestrator |

## Database migrations

1. `20260415070000_init.sql` — legacy clinical tables
2. `20260415101500_add_appointment_requests.sql`
3. `20260521000000_saas_foundation.sql` — tenants, RBAC, RLS, billing hooks

**Removed**: conflicting `20260415141500_create_patients.sql`

## Billing

- Stripe webhooks: `POST /api/webhooks/stripe`
- Plans: `trial`, `starter`, `growth`, `enterprise` in `src/lib/billing/stripe.ts`
- Usage: `usage_tracking` + `ai_generations` per tenant

## Platform admin (god account)

Set your email in `PLATFORM_ADMIN_EMAILS` (comma-separated). On login, `profiles.is_platform_admin` is set automatically.

1. Open **`/app/admin`** — list all tenants
2. Click **Act as this org** — sets cookie `cliniqflow_acting_tenant_id`
3. Use **Dashboard / Patients** as that customer (full owner permissions, RLS bypass via `is_platform_admin()`)

All impersonation is logged to `audit_logs` (`platform_admin.impersonate`).

## Recently added

- Team invites (create, list, accept at `/invite/accept`)
- Stripe Checkout + Customer Portal APIs
- Plan enforcement (AI monthly limits, seat limits on invites)
- Intake draft autosave (`PUT/GET /api/intake/drafts`)
- Public intake rate limit (per tenant, hourly)
- Dashboard search, SOAP approve, appointment display
- Platform admin audit log (`/app/admin/audit`)
- Intake link revoke API
- Legacy route redirects (`/[slug]` → `/c/[slug]`, `/patients` → `/app/patients`)
- `npm run seed:niche-configs`
- Orchestrator assigns `tenant_id` to demo clinics

## Remaining work

- [ ] Transactional invite emails (Resend/SendGrid)
- [ ] File uploads + consent records
- [ ] HIPAA BAA / audit export
- [ ] Automated tests + CI
- [ ] Distributed rate limiting (Upstash) for multi-region

## Deployment

```bash
npm run supabase:push
# Set all vars from .env.example in Vercel
npx vercel --prod
```
