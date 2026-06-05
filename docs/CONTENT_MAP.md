# CliniqFlow Content Map

Indexable pages, target keywords, intent, internal links, and CTAs. All marketing CTAs use **Sign up** → `/signup` only.

## Homepage

| URL | Target keyword | Intent | Internal links | CTA |
|-----|----------------|--------|----------------|-----|
| `/` | intake and documentation software; patient intake software | Commercial | `/how-patient-intake-works`, `/ai-documentation`, `/clinic-workflows`, `/security`, `/faq` | Sign up |

## Landing pages

| URL | Target keyword | Intent | Internal links | CTA |
|-----|----------------|--------|----------------|-----|
| `/how-patient-intake-works` | patient intake software; healthcare intake workflow | Commercial / informational | `/ai-documentation`, `/clinic-workflows`, `/signup` | Sign up |
| `/ai-documentation` | AI-assisted clinical documentation | Commercial | `/how-patient-intake-works`, `/ai-disclaimer`, `/signup` | Sign up |
| `/clinic-workflows` | clinic documentation workflow; healthcare workflow automation | Commercial | `/how-patient-intake-works`, `/security`, `/signup` | Sign up |
| `/security` | clinic data security | Informational / trust | `/security-policy`, `/subprocessors`, `/privacy`, `/dpa` | Sign up |
| `/faq` | intake and documentation software (informational) | Informational | All landing pages + legal disclaimers | Sign up |

## Legal pages (indexable, low priority)

| URL | Purpose | CTA |
|-----|---------|-----|
| `/privacy` | Privacy Policy | — |
| `/terms` | Terms of Service | — |
| `/terms-of-use` | Terms of Use | — |
| `/medical-disclaimer` | Medical disclaimer | — |
| `/ai-disclaimer` | AI disclaimer | — |
| `/acceptable-use` | Acceptable Use Policy | — |
| `/dpa` | Data Processing Addendum | — |
| `/security-policy` | Security & Data Protection Policy (legal) | — |
| `/cookies` | Cookie Policy | — |
| `/subprocessors` | Subprocessor Disclosure | — |
| `/legal-liability` | Limitation of Liability | — |
| `/cancellation` | Cancellation Policy | — |
| `/privacy-request` | Privacy Requests | — |

`/security` (marketing trust summary) links prominently to `/security-policy` (canonical legal document). No certification badges on marketing pages.

## Excluded from sitemap (noindex / disallow)

| URL pattern | Reason |
|-------------|--------|
| `/app/*` | Authenticated app |
| `/proof/*` | Sales demos |
| `/c/*`, `/intake`, `/questionnaire` | Patient-facing intake |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Auth |
| `/auth/*`, `/invite/*`, `/onboarding` | Account flows |

## Internal linking graph

```
/ (homepage)
 ├── /how-patient-intake-works
 │    ├── /ai-documentation
 │    └── /clinic-workflows
 ├── /ai-documentation
 │    └── /ai-disclaimer
 ├── /clinic-workflows
 │    └── /security
 ├── /security
 │    ├── /security-policy
 │    ├── /subprocessors
 │    ├── /privacy
 │    └── /dpa
 └── /faq
      └── (all landing + legal disclaimers)

Header/footer: Product links on all marketing routes via SEO_LANDING_PAGES
```

## Sitemap priorities

| Route type | Priority | changeFrequency |
|------------|----------|-----------------|
| Homepage | 1.0 | weekly |
| Landing pages | 0.8 | monthly |
| Legal pages | 0.5 | yearly |
