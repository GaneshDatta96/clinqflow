# Infrastructure setup

## TanStack Query

Client-side caching is enabled via `QueryProvider` in the root layout. Hooks live in `src/lib/query/hooks.ts` (clinics, invites, session role).

## Transactional email

1. Set `EMAIL_PROVIDER=resend` or `sendgrid`.
2. Add `RESEND_API_KEY` or `SENDGRID_API_KEY`.
3. Set `EMAIL_FROM` to a verified sender domain.

Invites call `sendInviteEmail` after the DB row is created. If keys are missing, the invite still works and the accept URL is returned in the API response.

## Upstash rate limiting

Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. When unset, rate limits are skipped (DB intake limits still apply for public intake).

Buckets: `auth`, `invite`, `ai_generate`, `public_intake`, `api_default`.

## Sentry

Set `SENTRY_DSN` (and optionally `NEXT_PUBLIC_SENTRY_DSN`). For source map upload on Vercel, also set `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN`.

## Vercel cron jobs

Set `CRON_SECRET` (min 16 characters). Vercel sends it as `Authorization: Bearer <CRON_SECRET>`.

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/process-ai-jobs` | Every 5 min | Drain `ai_jobs` queue |
| `/api/cron/retention` | Daily 03:00 UTC | Purge old audit/usage rows and expired invites |

## Login roles

### Cliniqflow internal (platform)

| Config | Role | Landing | Access |
|--------|------|---------|--------|
| `PLATFORM_ADMIN_EMAILS` | God mode | `/app/admin` | Full platform console, analytics, audit |
| `PLATFORM_SUPPORT_EMAILS` | Customer support | `/app/admin` | Help clinics/practitioners — list orgs, act as tenant, use dashboard/patients |

Customer support staff are **not** clinic members. They use the support console to select a clinic organization and work in that tenant's workspace.

Run migration `20260604000000_platform_support_role.sql` before onboarding support staff.

### Clinic staff (tenant membership)

| Role | Landing |
|------|---------|
| `owner`, `admin` | `/app/dashboard` |
| `practitioner`, `staff` | `/app/dashboard` |
| `viewer` | `/app/dashboard` |

Invite clinic staff from **Settings → Team invites** (admin, practitioner, staff, viewer).
