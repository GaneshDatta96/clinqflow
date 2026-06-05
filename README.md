# Cliniqflow

Multi-tenant SaaS for outpatient wellness clinics: pre-visit intake, rule-based assessment, and AI-assisted SOAP drafting with clinician review.

## Stack

- Next.js 16 App Router · React 19 · Tailwind 4
- Supabase Auth + Postgres + RLS
- OpenRouter (structured SOAP JSON)
- Razorpay subscription billing (payment links + webhooks)

## Deploy on Vercel

Use **Framework Preset: Next.js** and leave **Output Directory** empty (do not use `dist` or `build`). See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for full settings and environment variables.
