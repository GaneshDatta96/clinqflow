# Deploying Cliniqflow on Vercel

This project is **Next.js 16** (App Router). It is **not** Vite, Create React App, or a static `index.html` site.

## Project Settings → General

| Setting | Correct value |
|--------|----------------|
| **Framework Preset** | **Next.js** |
| **Root Directory** | *(leave empty)* — repo root contains `package.json` |
| **Build Command** | `npm run build` *(or leave default)* |
| **Output Directory** | *(leave empty — do not set)* |
| **Install Command** | `npm install` *(or leave default)* |

### Do not use these (common mistakes)

- **Output Directory `dist`** — Vite only; Next.js does not emit a `dist` app bundle for hosting.
- **Output Directory `build`** — Create React App only.
- **Output Directory `out`** — only if you explicitly enable `output: "export"` in `next.config.ts` (this project does not).
- **Framework Preset: Vite** — build may succeed but the deployed site will be empty or broken.

## Environment variables

Set these in **Project Settings → Environment Variables** (Production, Preview, Development as needed):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY` *(optional for build; required for AI features)*
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` *(billing)*
- `INTAKE_TOKEN_SECRET` *(32+ chars in production)*
- `PLATFORM_ADMIN_EMAILS` *(comma-separated)*
- `APP_URL` — e.g. `https://clinqflow.vercel.app`

The build should complete **without** Supabase credentials (app routes use `force-dynamic` and skip auth when env is missing). Runtime requires Supabase for real usage.

## Build log: admin audit / prerender

Commit `315f612` fixed a prior failure on `/app/admin/audit` by:

- `export const dynamic = "force-dynamic"` on `/app/*` and admin routes
- Skipping auth/DB calls during build when Supabase env vars are absent

If you still see prerender errors, check the log for:

- `useSearchParams` without a `Suspense` boundary (invite accept and dashboard search are wrapped)
- `window` / `localStorage` in Server Components
- Missing env vars causing thrown errors in `generateMetadata` or static pages

## Cron jobs (Hobby plan)

Vercel **Hobby** only allows cron schedules that run **once per day**. Do not use `*/5 * * * *` in `vercel.json` — deploys will fail with `deploy_failed`. This repo uses daily schedules (`0 3 * * *`, `0 4 * * *`). Upgrade to **Pro** if you need sub-daily crons.

## After deploy

- Homepage: `/`
- Legal: `/privacy`, `/terms`, `/terms-of-use`, `/cancellation`
- App (auth required): `/app/dashboard`
- Health check: `/api/health`

If the deployment shows a blank page but the build is green, **Output Directory** is almost always wrong — clear it and redeploy.
