# CliniqFlow Security Audit Registry

**Last updated:** 2026-06-05  
**Overall score (pre-remediation):** ~39/100  
**Production PHI verdict:** NO-GO until GO checklist below is complete.

This document tracks every finding from the full 30-section security audit and remediation status.

---

## GO checklist (Section 30)

| Requirement | Status |
|-------------|--------|
| C-01 patched and verified | Fixed — migration `20260605000000_security_hardening.sql` |
| C-02 resolved (BAA vendor OR on-prem AI) | Partial — `AI_PHI_MODE=restricted` default; OpenRouter blocked in prod without `AI_BAA_VENDOR` |
| C-03 support RLS scoped | Fixed — SELECT-only policies; writes via service role when impersonating |
| Upstash + cron hardening live | Fixed — required in prod; cron rate limit + `CRON_SECRET` ≥32 |
| Next.js patched + security headers | Fixed — next@16.2.6+; headers in `next.config.ts` |
| RLS viewer-write fixed (H-04) | Fixed — child table write policies use `can_write_tenant()` |
| Third-party pen test clean | Open — schedule before PHI launch | See [PEN_TEST_SCHEDULE.md](./PEN_TEST_SCHEDULE.md) |

---

## Critical

| ID | Finding | Status | Remediation |
|----|---------|--------|-------------|
| C-01 | Profile self-escalation | Fixed | Trigger + policy; flag reset migration |
| C-02 | Full PHI to OpenRouter; no BAA | Partial | Default restricted; prod gate; document BAA gap |
| C-03 | Support RLS = admin | Fixed | SELECT-only; app-layer service role writes |

## High

| ID | Finding | Status | Remediation |
|----|---------|--------|-------------|
| H-01 | Prompt injection | Fixed | `prompt-sandbox.ts`; untrusted data wrapper |
| H-02 | No security headers | Fixed | `next.config.ts` |
| H-03 | Rate limiting optional | Fixed | Fail closed in production |
| H-04 | Viewer writes SOAP children | Fixed | Split RLS policies |
| H-05 | Middleware public regex | Fixed | Removed catch-all single-segment |
| H-06 | Next.js CVEs | Fixed | Upgrade to 16.2.6+ |
| H-07 | Razorpay webhook idempotency | Fixed | Mark processed after handler success |
| H-08 | Cron unrate-limited | Fixed | `cron` bucket + secret length |

## Authentication

| ID | Finding | Status | Remediation |
|----|---------|--------|-------------|
| AUTH-01 | Email verify client-only | Fixed | `requireUser()` checks `email_confirmed_at` |
| AUTH-02 | Env email = instant god mode | Documented | DB flags + env allowlist; manual provisioning |
| AUTH-03 | Admin flag never revoked | Fixed | Sync clears flags when email removed |
| AUTH-04 | No MFA for platform staff | Partial | TOTP MFA enforced in production for platform staff (`/app/mfa/*`, AAL2) |
| AUTH-05 | No session rotation on impersonation | Partial | Acting cookie TTL 4h |

## Multi-tenant

| ID | Finding | Status | Remediation |
|----|---------|--------|-------------|
| TEN-01 | Profile escalation | Fixed | C-01 |
| TEN-02 | Support RLS | Fixed | C-03 |
| TEN-03 | Encounter/patient tenant mismatch | Fixed | DB trigger |
| TEN-04 | Slug collision | Fixed | Global unique slug index |
| TEN-05 | Multi-membership RLS | Phase 2 | Active tenant cookie documented |
| TEN-06 | Draft IDOR | Fixed | Patient-in-clinic validation |

## AI / PHI

| ID | Finding | Status | Remediation |
|----|---------|--------|-------------|
| AI-01 | Full PHI default | Fixed | Restricted default + prod gate |
| AI-03 | Client regen body trust | Fixed | Load intake from DB |
| AI-04 | No zero-retention headers | Partial | OpenRouter data policy header |
| AI-05 | Shape-only validation | Open | Clinical review of record |

## Frontend / API

| ID | Finding | Status | Remediation |
|----|---------|--------|-------------|
| FE-03 | Intake JWT in URL | Fixed | Header/hash/manual entry; URL token removed |
| FE-04 | Invite tokens in API | Fixed | Email only; no acceptUrl in response |
| LOG-01 | Platform staff PHI audit gaps | Fixed | `logPhiAccessIfPlatformStaff()` |
| LOG-02 | 90-day audit purge | Fixed | Min 365 days; configurable `AUDIT_RETENTION_DAYS` |

## Previously fixed (Phase 1 SaaS)

- Invite API no longer allows `owner` role
- Auth callback `next` allowlist
- `INTAKE_TOKEN_SECRET` required in production
- Active tenant cookie for multi-org users
- RLS INSERT for `ai_generations`, `audit_logs`, `usage_tracking`

---

## Environment variables (production)

| Variable | Required | Notes |
|----------|----------|-------|
| `UPSTASH_REDIS_REST_URL` | Yes | Rate limiting fail-closed |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | |
| `CRON_SECRET` | Yes | ≥32 characters |
| `AI_PHI_MODE` | Default `restricted` | Set `full` only with BAA |
| `AI_BAA_VENDOR` | Yes for OpenRouter in prod | e.g. `openrouter-enterprise` |
| `AUDIT_RETENTION_DAYS` | Optional | Default 2190 (6 years) |

---

## Phase 2 backlog

See [PHASE2_SECURITY_BACKLOG.md](./PHASE2_SECURITY_BACKLOG.md) for MFA, SIEM, WAF, AI worker, and pen test.
