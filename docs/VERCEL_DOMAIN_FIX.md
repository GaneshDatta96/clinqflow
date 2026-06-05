# Fix Vercel `404 NOT_FOUND` on custom domain

## Symptom

- `https://cliniqflow.vercel.app` → **works (200)**
- `https://cliniqflow.app` or `https://www.cliniqflow.app` → **404 NOT_FOUND** (`X-Vercel-Error: NOT_FOUND`)

DNS is correct; the domain is on Vercel’s network but **not attached to the project that has your deployment**.

## Fix (5 minutes)

1. Open **https://vercel.com** → find the project whose default URL is **`cliniqflow.vercel.app`** (open that URL in the project list to confirm).
2. That project only → **Settings → Domains**.
3. Ensure **both** domains are listed on **this** project:
   - `cliniqflow.app`
   - `www.cliniqflow.app`
4. Status must be **Valid Configuration** (not “Pending” forever).
5. Set **primary** domain to `cliniqflow.app` and enable **redirect** `www` → apex (or the reverse — pick one).
6. If domains appear on **another** project (or only under Team → Domains), **remove** them there and add them only on the `cliniqflow` app project.
7. **Deployments** → latest **Production** must be **Ready** (green). If failed, fix build and redeploy.
8. **Settings → Environment Variables** — add Supabase + `PLATFORM_ADMIN_EMAILS` + `APP_URL`, then **Redeploy**.

## DNS (registrar)

| Host | Type | Value |
|------|------|--------|
| `@` (apex) | A | `76.76.21.21` (use exact value Vercel shows) |
| `www` | CNAME | `cname.vercel-dns.com` (or the `*.vercel-dns-*.com` host Vercel gives you) |

Remove old **Wix** A/CNAME records for the same names.

## Verify

```bash
curl -I https://cliniqflow.app
curl -I https://www.cliniqflow.app
```

Both should return `HTTP/2 200` (or `308` redirect to one canonical host), **not** `X-Vercel-Error: NOT_FOUND`.

Working fallback until custom domains are fixed: **https://cliniqflow.vercel.app**
