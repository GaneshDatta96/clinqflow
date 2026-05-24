# HIPAA technical controls (Cliniqflow)

Cliniqflow implements technical safeguards to support HIPAA-aligned operations. **Legal BAAs** with Supabase (Pro), Stripe, and your AI vendor remain your responsibility.

## Implemented controls

- Tenant isolation via Postgres RLS
- Role-based access (owner → viewer)
- Audit logs + export (`/app/settings/compliance`)
- PHI access logging on encounter views
- Patient consent capture on public intake (`consent_records`)
- AI PHI minimization when `AI_PHI_MODE=restricted`
- BAA tracking table (`baa_agreements`)

## Operator checklist

- [ ] Execute BAA with Supabase
- [ ] Execute BAA with AI provider or use a BAA-covered model endpoint
- [ ] Enable Supabase audit logs and backups (PITR)
- [ ] Restrict `PLATFORM_ADMIN_EMAILS` and enable MFA for admins
- [ ] Set strong `INTAKE_TOKEN_SECRET` in production
