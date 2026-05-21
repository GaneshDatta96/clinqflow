# Cliniqflow

Multi-tenant SaaS for outpatient wellness clinics: pre-visit intake, rule-based assessment, and AI-assisted SOAP drafting with clinician review.

## Stack

- Next.js 16 App Router · React 19 · Tailwind 4
- Supabase Auth + Postgres + RLS
- OpenRouter (structured SOAP JSON)
- Stripe webhooks (billing foundation)

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill Supabase + OpenRouter keys
npm run dev
```

Apply database:

```bash
npm run supabase:push
```

## Routes

| Route | Access |
|-------|--------|
| `/` | Marketing |
| `/login`, `/signup`, `/onboarding` | Auth lifecycle |
| `/app/dashboard`, `/app/patients`, `/app/settings`, `/app/billing` | Authenticated workspace |
| `/c/[slug]?patientId=&token=` | Public signed intake |
| `/api/intake/public/submit` | Token + patient intake submit |
| `/api/intake/submit` | Authenticated staff submit |

See [docs/SAAS_ARCHITECTURE.md](./docs/SAAS_ARCHITECTURE.md) for tenancy, RLS, and security model.

## Required environment

Copy `.env.example` → `.env.local`. Minimum for SaaS:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INTAKE_TOKEN_SECRET` (32+ chars in production)
- `OPENROUTER_API_KEY` (optional; falls back to templates)

## Roles

`owner` · `admin` · `practitioner` · `staff` · `viewer` — enforced via RLS and `src/lib/tenancy/permissions.ts`.

## Platform admin (god account)

Add your email to `PLATFORM_ADMIN_EMAILS` in `.env.local` (comma-separated for multiple). After login you get:

- **`/app/admin`** — list all customers, click **Act as this org**
- Full access to that tenant’s dashboard, patients, and data (RLS bypass + audit log)

Run `npm run supabase:push` to apply `20260521120000_platform_admins.sql`.

## Orchestrator (lead → demo clinic)

```bash
npm run orchestrator:start
```

Requires `SUPABASE_*` and SQLite `leads.db`. Demo clinics now require `tenant_id` in Supabase.
