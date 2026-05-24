# Phase 2 security backlog

Enterprise readiness items tracked from the full security audit. Phase 0/1 code changes address launch blockers; this document tracks remaining work.

## AUTH-04 / AUTH-05 — MFA and impersonation step-up

- Require Supabase MFA (AAL2) for `PLATFORM_ADMIN_EMAILS` and `PLATFORM_SUPPORT_EMAILS` before `/app/admin` and acting-tenant impersonation.
- Short TTL on `cliniqflow_acting_tenant_id` cookie (e.g. 4 hours) with explicit re-auth.
- Hook: `src/lib/security/platform-staff.ts` → `isMfaStepUpRequired()`.

## LOG-04 — SIEM and anomaly detection

- Export `audit_logs` to a SIEM (Datadog, Splunk, or CloudWatch).
- Alert on: profile privilege changes, cross-tenant admin queries, failed cron auth bursts, AI generation spikes.

## WAF / bot protection

- Vercel Firewall or Cloudflare in front of `/api/intake/public/*` and `/c/*`.
- CAPTCHA on public intake after N submissions per IP.

## AI job worker

- Implement `process-ai-jobs` cron with signed payload schema validation.
- Never send raw intake from queued jobs without redaction pipeline.

## Third-party penetration test

- Required before PHI production GO (see `docs/SECURITY_AUDIT.md` checklist).
- Retest C-01, C-03, H-01 after each major release.

## TEN-05 — Active tenant in RLS

- Optional JWT claim or session variable for `current_tenant_ids()` narrowing when users hit PostgREST directly.
