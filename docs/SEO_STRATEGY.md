# CliniqFlow SEO Strategy (Phase 1 & 2)

## Goals

Establish correct technical SEO foundations and compliance-safe on-page optimization for `https://cliniqflow.app`, with five high-intent landing pages and a single conversion path: **Sign up** → `/signup`.

## Phase 1: Technical foundation (implemented)

| Item | Implementation |
|------|----------------|
| Canonical domain | `SITE_URL` in `src/lib/seo/site.ts`; `metadataBase` in root layout |
| Reusable metadata | `buildPageMetadata()` in `src/lib/seo/metadata.ts` |
| robots.txt | `src/app/robots.ts` — allow `/`, disallow app/auth/intake routes |
| Sitemap | `src/app/sitemap.ts` — indexable marketing + legal routes |
| Open Graph / Twitter | Default `summary_large_image` with `/og/cliniqflow-og.png` |
| JSON-LD | Organization + WebSite (root); SoftwareApplication + FAQPage (homepage); BreadcrumbList + page schema on landing pages |
| noindex | Auth, intake, questionnaire, `/c/*`, onboarding, invite |

## Phase 2: On-page optimization (implemented)

- Homepage title, description, H1/H2 alignment, internal links, FAQ schema
- Landing pages: `/how-patient-intake-works`, `/ai-documentation`, `/clinic-workflows`, `/security`, `/faq`
- Header/footer internal linking on all marketing routes
- Legal pages refactored to `buildPageMetadata()` for canonical + OG consistency

## Compliance rules

All public copy must pass `docs/MARKETING_NOT_TO_DO_MANUSCRIPT.md`:

- Position CliniqFlow as an **intake and documentation workflow layer**, not an EHR
- AI is **assisted documentation** and **clinical decision-support for licensed practitioner review**
- No telehealth, diagnostic, certification, or outcome guarantees
- No competitor attack pages or programmatic city spam

## Indexing policy

**Index:** `/`, five landing pages, 13 legal pages.

**Do not index:** `/app/*`, `/proof/*`, `/c/*`, `/intake`, `/questionnaire`, auth routes, `/onboarding`, legacy `/dashboard`, `/patients`.

**Signup:** noindex — traffic should come from CTAs, not organic auth-page rankings.

## Schema strategy

| Schema | Pages |
|--------|-------|
| Organization | Root layout (sitewide) |
| WebSite | Root layout |
| SoftwareApplication | Homepage, `/ai-documentation` |
| FAQPage | Homepage FAQ, `/faq` |
| BreadcrumbList | All five landing pages, `/faq` |

Validate after deploy: [Google Rich Results Test](https://search.google.com/test/rich-results), schema.org validator.

## Measurement plan

### Google Search Console setup

1. Add property for `https://cliniqflow.app`
2. Verify via DNS or HTML tag
3. Submit `https://cliniqflow.app/sitemap.xml`
4. Monitor Coverage, Core Web Vitals, and Queries (filter branded vs non-branded)

### Post-deploy checklist

1. Confirm `robots.txt` allows `/` and blocks `/app/`
2. Rich Results Test on `/`, `/faq`, `/ai-documentation`
3. Spot-check canonical tags on homepage, one landing page, one legal page
4. OG preview via LinkedIn/Twitter card debuggers
5. Lighthouse mobile on `/` (aspirational LCP &lt; 2.5s on 4G)

## 90-day expectations

| Timeframe | Expected outcome |
|-----------|------------------|
| 2–4 weeks | Correct indexing of marketing and legal pages; app/auth routes excluded |
| 1–3 months | Long-tail rankings (intake and documentation software, clinic intake software) |
| 3–6 months | Competitive AI documentation terms need backlinks + content refresh |

**Realistic traffic:** New domain + niche B2B = low initial organic volume. Primary win is **qualified clinic-intent visitors**, not mass traffic.

## Phase 3+ (planned)

Phase 1–2 established the foundation. The next layer — measurement, Core Web Vitals, content depth, niche vertical pages, authority, and conversion optimization — is documented in **[SEO_PHASE_3_PLAN.md](./SEO_PHASE_3_PLAN.md)**.

**Recommended first sprint:** GSC setup, privacy-respecting analytics, homepage LCP pass, per-page OG images, legacy route redirects.
