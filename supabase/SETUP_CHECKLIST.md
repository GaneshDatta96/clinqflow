# Supabase finish setup — CliniqFlow

Project ref: **rukcgmyurytfqxyxzfjh**  
Dashboard: [Supabase project](https://supabase.com/dashboard/project/rukcgmyurytfqxyxzfjh)

Use this checklist after pulling the latest code. Everything you run **in Supabase** is in `RUN_ON_SUPABASE.sql`.

---

## Step 1 — Run SQL (Supabase Dashboard)

1. Open **SQL Editor** → **New query**
2. Paste the full contents of **`supabase/RUN_ON_SUPABASE.sql`**
3. Click **Run**

**Already partially set up?**

| Situation | What to run |
|-----------|-------------|
| Ran an old `RUN_ON_SUPABASE.sql` (before June 2026 migrations) | Only the files in `migrations/` from `20260601000000_*` through `20260605000000_*` |
| `policy already exists` errors | `repair_finish_setup.sql`, then retry missing migrations |
| Fresh empty project | Full `RUN_ON_SUPABASE.sql` |

---

## Step 2 — Auth URLs (Supabase Dashboard)

**Authentication → URL configuration**

| Setting | Value |
|---------|--------|
| Site URL | `https://cliniqflow.app` |
| Redirect URLs | `https://cliniqflow.app/auth/callback` |
| | `https://cliniqflow.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |

Enable **Email** provider if signup uses email/password.

---

## Step 3 — Local commands (repo root)

Requires `.env` with `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL`.

```powershell
cd d:\Cliniqflow\Cliniqflow
npm install
npm run seed:niche-configs
```

**Only if you had data before the SaaS migration:**

```powershell
npm run db:backfill-tenants
```

---

## Step 4 — Platform admin account (local terminal)

Set in `.env`:

- `PLATFORM_ADMIN_EMAILS=your@email.com`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Then run once:

```powershell
$env:PLATFORM_ADMIN_PASSWORD='choose-a-strong-password'
npm run create:platform-admin
```

Log in at `/login` → open `/app/admin`.

---

## Step 5 — Vercel environment variables

Copy from `.env` / `.env.example` into **Vercel → Settings → Environment Variables (Production)**:

| Required | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Same as Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard → API → anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to browser |
| `APP_URL` | `https://cliniqflow.app` |
| `INTAKE_TOKEN_SECRET` | Random, 32+ characters |
| `PLATFORM_ADMIN_EMAILS` | Your admin login email |
| `UPSTASH_REDIS_REST_URL` | Rate limiting (required in prod) |
| `UPSTASH_REDIS_REST_TOKEN` | |
| `CRON_SECRET` | 32+ characters |

**PayPal webhook** (after creating webhook in PayPal Developer Dashboard):

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Same Client ID as your PayPal app |
| `NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID` | Hosted button on homepage |
| `PAYPAL_CLIENT_SECRET` | Server only — never `NEXT_PUBLIC_*` |
| `PAYPAL_WEBHOOK_ID` | Dashboard → Webhooks → ID starts with `WH-` |
| `PAYPAL_MODE` | `live` or `sandbox` |
| `PAYPAL_DEFAULT_PLAN` | Usually `growth` |

Webhook URL in PayPal: `https://cliniqflow.app/api/webhooks/paypal`

Run in SQL Editor if not using full `RUN_ON_SUPABASE.sql`:

`supabase/migrations/20260606000000_paypal_webhook_events.sql`

Optional: Stripe, email, Sentry — see `.env.example`.

Redeploy after saving env vars.

---

## Step 6 — Verify

```powershell
npm run dev
```

1. Open `http://localhost:3000/signup` — create a clinic account
2. Complete onboarding
3. Open `/app/dashboard`
4. Hit `https://cliniqflow.app/api/health` on production

---

## Files in this folder

| File | Purpose |
|------|---------|
| `RUN_ON_SUPABASE.sql` | **Main file** — all migrations in order |
| `repair_finish_setup.sql` | Fix duplicate RLS policies after partial runs |
| `migrations/*.sql` | Source migrations (used by CLI `npm run supabase:push`) |
| `SETUP_CHECKLIST.md` | This checklist |

**CLI alternative:** `npx supabase login` → `npx supabase link --project-ref rukcgmyurytfqxyxzfjh` → `npm run supabase:push`
