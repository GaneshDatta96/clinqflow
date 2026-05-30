# Supabase setup — CliniqFlow

**Start here:** [`supabase/SETUP_CHECKLIST.md`](../supabase/SETUP_CHECKLIST.md)

**Run in SQL Editor:** [`supabase/RUN_ON_SUPABASE.sql`](../supabase/RUN_ON_SUPABASE.sql) (all migrations, May 2026)

Project: **rukcgmyurytfqxyxzfjh** · `https://rukcgmyurytfqxyxzfjh.supabase.co`

Quick path:

1. Paste `supabase/RUN_ON_SUPABASE.sql` in Supabase SQL Editor → Run
2. Set auth redirect URLs (see checklist)
3. `npm run seed:niche-configs`
4. `npm run create:platform-admin` (with `PLATFORM_ADMIN_PASSWORD` set once)
5. Mirror env vars to Vercel and redeploy

If policies already exist from a partial run, use `supabase/repair_finish_setup.sql` then apply any missing migrations from `supabase/migrations/`.
