# Operations runbook

## Deploy order

1. `npm run supabase:push`
2. `node --env-file-if-exists=.env.local scripts/backfill-tenant-ids.mjs` (if upgrading legacy DB)
3. `npm run seed:niche-configs`
4. Deploy Next.js to Vercel (Framework: **Next.js**, no custom output directory)
5. Register Stripe webhook → `/api/webhooks/stripe`

## Health

- `GET /api/health` — liveness probe

## Backups

- Enable Supabase Point-in-Time Recovery on production projects
- Export audit logs periodically from Compliance settings
