# Phase 2 security backlog

Enterprise readiness items tracked from the full security audit. Phase 0/1 code changes address launch blockers; this document tracks remaining work.

## AUTH-04 / AUTH-05 — MFA and impersonation step-up

- **Implemented (2026-06):** Supabase TOTP MFA required for `PLATFORM_ADMIN_EMAILS` and `PLATFORM_SUPPORT_EMAILS` in production (`PLATFORM_STAFF_MFA_REQUIRED`, default on in prod). Enrollment at `/app/mfa/setup`, step-up at `/app/mfa/verify`. Enforced on `/app/admin`, `requirePlatformStaff()`, and acting-tenant impersonation.
- Short TTL on `cliniqflow_acting_tenant_id` cookie (4 hours) — existing.
- Remaining: session rotation on impersonation start (AUTH-05).

## LOG-04 — SIEM and anomaly detection

- Export `audit_logs` to a SIEM (Datadog, Splunk, or CloudWatch).
- Alert on: profile privilege changes, cross-tenant admin queries, failed cron auth bursts, AI generation spikes.

## WAF / bot protection

- Vercel Firewall or Cloudflare in front of `/api/intake/public/*` and `/c/*`.
- **Implemented (2026-06):** Cloudflare Turnstile on public intake after 3 submissions per IP per hour (`/api/intake/public/captcha-status`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`).
- **Implemented (2026-06):** Per-tenant rate limit on authenticated intake submit (`tenant_intake` bucket, 120/hour).

## Password policy

- **Implemented (2026-06):** Rules-based strength checker on signup (API + UI), password reset (client), with uppercase/lowercase/digit requirements and common-password blocklist.

## AI job worker

- Implement `process-ai-jobs` cron with signed payload schema validation.
- Never send raw intake from queued jobs without redaction pipeline.

## Third-party penetration test

- See [PEN_TEST_SCHEDULE.md](./PEN_TEST_SCHEDULE.md) for scope, vendor criteria, and retest triggers.
- Required before PHI production GO (see `docs/SECURITY_AUDIT.md` checklist).
- Retest C-01, C-03, H-01 after each major release.

## TEN-05 — Active tenant in RLS

- Optional JWT claim or session variable for `current_tenant_ids()` narrowing when users hit PostgREST directly.
