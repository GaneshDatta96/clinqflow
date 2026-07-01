# Penetration test schedule

CliniqFlow requires a third-party penetration test before processing PHI in production. This document defines scope, timing, and retest triggers.

## Status

| Item | Status |
|------|--------|
| Internal security audit | Complete — see [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) |
| Automated dependency / header review | Ongoing (Vercel, Sentry, Supabase) |
| Third-party penetration test | **Not scheduled** — required before PHI GO |

## When to schedule

Book the pen test when **all** of the following are true:

1. Production environment matches the GO checklist in `SECURITY_AUDIT.md` (except pen test itself).
2. Upstash rate limiting is live in production.
3. Platform staff MFA is enabled and verified for all `PLATFORM_ADMIN_EMAILS` and `PLATFORM_SUPPORT_EMAILS`.
4. Razorpay webhooks, cron jobs, and public intake flows are deployed to the target URL (`https://cliniqflow.app`).

Recommended lead time: **3–4 weeks** before planned PHI launch.

## Scope (minimum)

### In scope

- Public marketing site and auth flows (`/login`, `/signup`, `/auth/*`, password reset)
- Multi-tenant isolation (RLS, `tenant_id` scoping, active-tenant cookie)
- Platform admin / support console (`/app/admin`, acting-tenant impersonation)
- Public patient intake (`/c/*`, `/api/intake/public/*`)
- API authentication and authorization on `/api/*`
- Billing webhooks (Razorpay)
- AI SOAP generation endpoints and PHI handling (`AI_PHI_MODE=restricted`)

### Out of scope (unless vendor agrees)

- Supabase infrastructure (covered by Supabase SOC 2 / shared responsibility)
- Vercel platform layer
- Social engineering / physical security
- Denial-of-service load testing (coordinate separately)

## Test types

1. **Grey-box web application test** — credentials for clinic user, platform support, and platform admin test accounts.
2. **Multi-tenant IDOR review** — patient, encounter, intake, and SOAP records across tenants.
3. **Auth abuse** — brute force, password reset flooding, invite abuse, session fixation.
4. **API fuzzing** — validation bypass on intake and admin routes.

## Deliverables

- Executive summary and risk-rated findings (Critical / High / Medium / Low)
- Proof-of-concept steps for reproducible issues
- Retest letter after remediation

## Retest triggers

Schedule a **full or focused retest** after:

- Any change to RLS policies or `tenant_id` scoping
- New public API surface or auth flow changes
- Platform admin / impersonation logic changes
- Major Next.js or Supabase Auth upgrades
- Before each PHI production milestone

## Suggested vendors

Use a HIPAA-aware application security firm. Evaluate:

- Experience with Supabase / Postgres RLS
- BAA availability (if tester will access PHI-like test data)
- Sample healthcare SaaS report

## Internal pre-test checklist

Before handing access to testers:

- [ ] Create isolated test tenants (no real patient data)
- [ ] Provision platform admin + support test accounts with MFA enrolled
- [ ] Confirm `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in production
- [ ] Confirm rate limits return `429` on auth abuse (signup, login, forgot-password)
- [ ] Confirm CSP is enforced (no `unsafe-eval` in production)
- [ ] Share `SECURITY_AUDIT.md` and architecture summary (`SAAS_ARCHITECTURE.md`)
- [ ] Rotate `CRON_SECRET` and webhook secrets after test completes

## Tracking

Update `SECURITY_AUDIT.md` GO checklist when:

- Vendor is engaged
- Test report is received
- Critical/High findings are remediated and retested
