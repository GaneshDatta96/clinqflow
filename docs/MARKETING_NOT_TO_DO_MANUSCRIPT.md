# CliniqFlow Marketing Manuscript: Not-To-Dos and Not-To-Use

**Version:** legal-compliance-v1  
**Effective:** May 30, 2026  
**Audience:** Founders, sales, marketing, product copywriters, demo builders, contractors, and anyone who writes customer-facing language for CliniqFlow  
**Authority:** This manuscript reflects what was implemented, published, and deployed on May 30, 2026 — including legal pages live at [cliniqflow.app](https://cliniqflow.app), product copy changes, AI prompt constraints, database access rules, and [`build.txt`](../build.txt) section `legal-compliance-v1`.

**Purpose:** Prevent marketing, sales, and in-product language from creating medical liability, AI liability, regulatory scrutiny, false advertising exposure, or contradictions with our legal documents and actual product behavior.

**This is a guardrail document, not a feature list.** If a claim is not explicitly permitted elsewhere in product documentation, assume it is prohibited until counsel approves it.

---

## Table of contents

1. [What CliniqFlow is — and is not](#1-what-cliniqflow-is--and-is-not)
2. [The one approved AI phrase](#2-the-one-approved-ai-phrase)
3. [Prohibited words and phrases (master list)](#3-prohibited-words-and-phrases-master-list)
4. [Product category mistakes (do not position as)](#4-product-category-mistakes-do-not-position-as)
5. [Clinical and medical claims — never make these](#5-clinical-and-medical-claims--never-make-these)
6. [AI marketing — what not to say or imply](#6-ai-marketing--what-not-to-say-or-imply)
7. [Performance, ROI, and outcome claims — do not use](#7-performance-roi-and-outcome-claims--do-not-use)
8. [UI and dashboard language — do not use](#8-ui-and-dashboard-language--do-not-use)
9. [Features that exist in code but must not be marketed](#9-features-that-exist-in-code-but-must-not-be-marketed)
10. [Security, privacy, and compliance — do not overclaim](#10-security-privacy-and-compliance--do-not-overclaim)
11. [Access roles — do not misrepresent](#11-access-roles--do-not-misrepresent)
12. [Patient-facing copy — do not do](#12-patient-facing-copy--do-not-do)
13. [Sales calls and demos — do not do](#13-sales-calls-and-demos--do-not-do)
14. [Website, ads, and social — do not do](#14-website-ads-and-social--do-not-do)
15. [Competitive comparisons — avoid](#15-competitive-comparisons--avoid)
16. [Visual and brand mistakes](#16-visual-and-brand-mistakes)
17. [Specific phrases we removed on May 30, 2026](#17-specific-phrases-we-removed-on-may-30-2026)
18. [Approved replacements quick reference](#18-approved-replacements-quick-reference)
19. [When in doubt — escalation checklist](#19-when-in-doubt--escalation-checklist)

---

## 1. What CliniqFlow is — and is not

### What we are (accurate as of May 30, 2026)

CliniqFlow is an **intake and documentation workflow platform** for outpatient clinics. It:

- Collects **patient intake forms**, demographics, symptoms, and niche-configured questionnaires
- Applies **rule-based intake structuring** (internally: pattern scoring — never say that to customers)
- Produces **AI-assisted documentation and clinical decision-support** as **draft** SOAP-style documentation
- Requires **licensed practitioner review and approval** before any clinical or operational use
- Stores intake records for clinic tenants with role-based access

### What we are NOT — never describe CliniqFlow as any of the following

| Do not say | Why |
|------------|-----|
| Electronic Health Record (EHR) | We do not replace longitudinal records, orders, labs, or full charting |
| EMR | Same as EHR |
| Telehealth platform | We do not host visits, video, or remote care delivery |
| Telemedicine solution | Same |
| Insurance / billing / claims platform | Razorpay handles subscriptions only; no claims processing |
| Prescription platform | AI prompts explicitly forbid prescribing; product has no Rx workflow |
| Treatment management platform | No care plans, medication management, or treatment protocols |
| Appointment scheduling system | `supportsAppointments` is **false**; appointment UI removed from intake completion |
| Calendar / booking software | Same |
| Diagnostic tool | Rule-based highlights are intake themes, not diagnoses |
| AI doctor / AI clinician | We are software; practitioners retain all clinical responsibility |
| Medical device (unless counsel approves) | Not cleared or registered as SaMD in our current positioning |
| HIPAA-certified / HIPAA-compliant (as a blanket badge) | We describe safeguards; clinics maintain their own compliance programs |
| GDPR-certified | We align with principles via DPA; we do not claim certification |
| Fully automated clinical documentation | All outputs are drafts requiring human approval |
| Replacement for licensed professionals | Explicitly disclaimed in Medical Disclaimer |

**Legal source:** [`SERVICE_DESCRIPTION`](src/lib/legal/clauses.ts), Terms of Service §2, Medical Disclaimer, FAQ on homepage.

---

## 2. The one approved AI phrase

### Use this exact framing in customer-facing copy

> **AI-assisted documentation and clinical decision-support**

### Do not use these (retired or never approved)

| Retired / prohibited | Notes |
|---------------------|-------|
| AI-assisted assessment support | Retired May 30, 2026 — replaced everywhere in legal and brand copy |
| AI assessment | Too close to clinical assessment |
| AI-powered diagnosis | Never approved |
| AI diagnostic assistant | Never approved |
| Intelligent diagnosis | Never approved |
| Automated clinical assessment | Implies autonomy |
| Autopilot documentation | Implies finalization without review |
| AI that thinks like a doctor | Never approved |

**Internal engineering terms** (e.g. `assessment_results`, `scorePatterns`, `pattern_key`) may exist in code. **They must not appear in marketing, sales decks, UI labels, tooltips, or patient-facing copy.**

---

## 3. Prohibited words and phrases (master list)

### Category A — Diagnostic language (highest risk)

Do not use in any customer-facing context:

- AI diagnosis / diagnose / diagnoses patients
- Diagnostic engine
- Diagnostic recommendation
- Diagnostic accuracy
- Predictive diagnosis / prediction
- Differential diagnosis (as something the product produces)
- Working impression (as product output language)
- Clinical impression (as automated output)
- Definitive diagnosis
- Rule out (as automated output)
- ICD coding / coding assistance (not a product feature)
- SaMD / FDA-cleared (unless formally true)
- Clinical decision **system** (use **decision-support** only)
- Triage / triage replacement
- Risk stratification (customer-facing; we use "review priority" internally in UI)
- Severity classification (removed from AI fallback text May 30, 2026)

### Category B — Pattern / scoring language (marketing and UI)

Do not use:

- Pattern scoring (removed from Growth plan pricing May 30, 2026)
- Pattern assessment (renamed to "Intake theme highlights" in dashboard)
- Confidence score / Confidence 0.86 / numeric confidence in UI
- Match confidence / model confidence
- Pattern suggests… (removed from AI prompts; do not reintroduce in marketing)
- Leading pattern / dominant pattern (as clinical conclusions)
- Diagnostic pattern
- Dysfunction pattern (old pattern-library labels — retired)
- Nonspecific clinical pattern (retired; now "Nonspecific intake theme" internally only)

### Category C — Treatment and care delivery

Do not use:

- Prescribe / prescription support / Rx suggestions
- Treatment plan automation
- Care plan generation (as finalized care)
- Medication recommendations
- Supplement recommendations
- Lab order suggestions (as product output)
- "Should order labs" / "lab follow-up should be reviewed" (removed from proof data May 30, 2026)
- Patient treatment pathway
- Clinical pathway automation

### Category D — Autonomy and finalization

Do not use:

- Automatically finalize notes
- Auto-approve documentation
- Silent charting
- Hands-free documentation
- Set-and-forget intake
- Autopilot / autopilot charting
- AI-approved / AI-signed
- Replace your clinician
- Replace your EHR

### Category E — Emergency and urgent care

Do not use:

- Urgent care intake
- Emergency triage
- 24/7 medical support from CliniqFlow
- Crisis support through the platform
- "We'll connect you to care" (CliniqFlow does not deliver care)

**Required patient disclaimer (already in product):** "Not for emergencies. Contact local emergency services."

### Category F — Performance and efficacy (unsubstantiated)

Do not use unless you have a validated, counsel-approved study:

- Saves X minutes per visit (specifically: **"~5.2 minutes" was removed** May 30, 2026)
- Proven to reduce errors
- Clinically proven
- Evidence-based outcomes from using CliniqFlow
- Better patient outcomes guaranteed
- Reduce malpractice risk
- Increase revenue by X%
- ROI guarantee
- 100% accuracy
- Zero hallucinations
- HIPAA-compliant guarantee (as absolute)

### Category G — Data and AI retention (do not overpromise)

Do not use:

- We never send data to AI providers (we do send minimized context)
- AI providers never retain your data (we **request** zero retention via OpenRouter header; we do **not** warrant compliance)
- Zero data leaves your clinic (subprocessors exist — see `/subprocessors`)
- End-to-end encrypted PHI at rest (describe only what Security Policy states)
- Anonymous AI processing (we send age, sex, symptoms, questionnaire content — de-identified/minimized, not anonymous)

**Accurate language:** "We request that our AI provider not retain request data; provider policies govern actual retention."

### Category H — Support and access (do not misstate)

Do not use:

- CliniqFlow Support can access your patient records to help you (Support has **no** PHI access as of May 30, 2026)
- Our team reads patient charts for troubleshooting
- White-glove chart review by CliniqFlow staff
- 24/7 live clinical support from CliniqFlow

**Accurate language:** Platform administrators may access systems for maintenance, security, and compliance; access is logged. CliniqFlow Support does not access patient records.

---

## 4. Product category mistakes (do not position as)

When writing homepage hero copy, pitch decks, LinkedIn posts, or sales emails, **do not** frame CliniqFlow as:

1. **"The AI EHR for wellness clinics"** — We are pre-visit intake + draft documentation, not an EHR.
2. **"Telehealth intake for virtual visits"** — No video, no visit delivery.
3. **"All-in-one practice management"** — No scheduling, billing to patients, inventory, or payroll.
4. **"Insurance-ready documentation automation"** — No claims, coding automation, or payer integration.
5. **"Patient-facing diagnosis chatbot"** — Patients submit intake; they do not receive clinical conclusions from CliniqFlow.
6. **"Clinical AI copilot that decides next steps"** — Decision-**support** only; practitioner decides.
7. **"Scheduling + intake in one"** — Appointment requests disabled in product; do not sell scheduling.
8. **"HIPAA hosting replacement"** — We are a processor/service provider on clinic instructions, not a compliance certification body.

### Acceptable elevator line (aligned with live brand)

> CliniqFlow helps clinics collect structured patient intake, reduce repetitive pre-visit discovery, and streamline practitioner documentation workflows — with AI-assisted documentation and clinical decision-support that stays review-first.

Source: [`src/lib/brand/site.ts`](../src/lib/brand/site.ts) positioning and hero subheadline pattern.

---

## 5. Clinical and medical claims — never make these

### Do not claim CliniqFlow provides medical services

- CliniqFlow is **not** a healthcare provider.
- CliniqFlow does **not** provide medical advice, diagnosis, or treatment.
- Use of CliniqFlow does **not** create a doctor-patient relationship with Prarthana Bhat / CliniqFlow.

### Do not claim outputs are clinically valid for direct use

- SOAP drafts are **not** clinical records until the practitioner edits, approves, and signs according to their workflow.
- Intake theme highlights are **not** diagnoses — they organize submitted intake for review.
- Red flags surfaced in intake are **not** triage decisions — they are items for practitioner review.

### Do not instruct patients to rely on the platform for health decisions

- Do not write: "Based on your intake, you may have…"
- Do not write: "Our AI recommends you…"
- Do not write: "You should get labs for…"
- Do not write: "Your condition is likely…"

### Do not claim regulatory clearance

- Do not use FDA, CE mark, or "clinical-grade AI" unless formally accurate and counsel-approved.
- Do not call rule-based intake structuring "FDA-exempt CDS" in marketing unless counsel approves that analysis.

---

## 6. AI marketing — what not to say or imply

### What the AI actually does (accurate — do not exceed this)

- Generates **draft** Subjective, Objective, Assessment, and Plan sections for practitioner editing
- Uses **minimized** intake context in production restricted mode: age, sex, symptoms, questionnaire responses, plus rule-based intake theme highlights passed as structured context
- Does **not** receive patient name, email, phone, or address in restricted mode
- Sends requests to **OpenRouter** with `X-OpenRouter-Data-Policy: deny` (a **request** for zero retention — not a guarantee)
- Falls back to local template drafts when OpenRouter is unavailable
- Requires practitioner approval via SOAP review workflow

### Do not claim about AI

| Prohibited claim | Why |
|------------------|-----|
| "Our AI analyzes your patient and determines…" | Implies autonomous clinical judgment |
| "HIPAA-compliant AI" (without BAA context) | Misleading simplification |
| "Zero-retention AI" | We request zero retention; we do not warrant provider behavior |
| "No PHI ever touches AI" | Minimized clinical context is sent |
| "GPT writes your final note" | Draft only; practitioner approves |
| "Eliminates documentation burden" | Overpromise; review still required |
| "Never hallucinates" | False; AI Disclaimer lists hallucination risk |
| "Same accuracy as a clinician" | Not substantiated; legally dangerous |
| "Trained on your patient data" | Not our positioning; retention request says otherwise |
| "Medical-grade language model" | Vague regulatory implication |

### Do not show in marketing creative

- Chat bubbles where AI "diagnoses" the patient
- Before/after charts showing "AI diagnosis" → "confirmed by doctor"
- Screenshots with **Confidence 0.86** or similar (removed from product UI May 30, 2026)
- Mock outputs containing "Pattern suggests thyroid dysfunction" or similar diagnostic phrasing
- Animations implying the note is **auto-submitted** to an EHR

### Demo / proof data rules

Marketing proof data ([`src/lib/marketing/proof-data.ts`](../src/lib/marketing/proof-data.ts)) was sanitized May 30, 2026. Do not reintroduce:

- "Thyroid-related history and lab follow-up should be reviewed"
- "Structured intake suggests…" followed by clinical follow-up instructions
- `thyroid_review_flag` naming in visible UI
- Appointment request examples in hero/dashboard previews

---

## 7. Performance, ROI, and outcome claims — do not use

### Removed claims — do not restore without evidence

| Removed phrase | Where it was | Replacement used |
|----------------|--------------|------------------|
| "Save ~5.2 minutes of physician discovery time" | Homepage hero bullet | "Designed to reduce repetitive pre-visit discovery" |
| "~5.2 min Physician discovery time saved" | Homepage stats panel | "Less repetition" (qualitative) |

### General prohibition

Do not publish **quantified time savings**, **error reduction percentages**, **revenue lift**, or **patient outcome improvements** unless:

1. You have reproducible internal data with methodology documented
2. Counsel has reviewed the claim
3. The claim includes scope limits (clinic type, sample size, workflow assumptions)

### Safer qualitative alternatives (approved direction)

- "Designed to reduce repetitive pre-visit discovery"
- "Less repetitive history gathering"
- "Calmer pre-visit workflow"
- "Review-first documentation"
- "Structured intake before the visit"

---

## 8. UI and dashboard language — do not use

These rules apply to **product UI**, **tooltips**, **empty states**, **onboarding**, and **marketing screenshots of the product**.

### Section labels — do not use

| Do not use | Use instead |
|------------|-------------|
| Pattern assessment | Intake theme highlights |
| Pattern scoring | Structured intake highlights |
| AI assessment | AI-assisted documentation and clinical decision-support |
| Diagnostic summary | Documentation draft summary |
| Risk level: medium (alone as clinical risk) | Review priority: routine / elevated (if needed) |
| Confidence: 0.86 | Do not show numeric confidence to users |

### SOAP / encounter views — required messaging (do not remove)

Product now shows disclaimer banners. Marketing screenshots **must include or not crop out**:

- "Draft documentation only — not a clinical record until you edit, approve, and sign"
- Link or reference to `/ai-disclaimer`

Do not create marketing mockups that omit these disclaimers while showing AI-generated text.

### Intake form — do not use

| Do not use | Use instead |
|------------|-------------|
| SOAP-ready output | Structured documentation draft |
| Stronger Assessment draft | Documentation-section draft |
| Assessment context before the visit | Documentation draft for practitioner review |

---

## 9. Features that exist in code but must not be marketed

The following exist in codebase or schema but are **out of scope** for marketing as of May 30, 2026:

| Feature | Status | Marketing rule |
|---------|--------|----------------|
| `appointment_requests` table + API | Code exists; UI disabled; `supportsAppointments: false` | **Do not** sell scheduling, booking, or appointment requests |
| `AppointmentRequestCard` in intake | Removed from post-submit flow | Do not demo or screenshot |
| Platform support PHI access | Removed via RLS migration | Do not sell "support views your chart" |
| Full AI payload (history, lifestyle, goals) | Stripped in `phi.ts` restricted mode | Do not claim AI sees full chart |
| Patient delete API | Not implemented | Do not claim instant self-service deletion; point to `/privacy-request` process |
| MFA for platform admin | Not implemented (stub) | Do not claim MFA-enforced admin access |
| Marketing analytics cookies | Not implemented | Do not claim analytics dashboard for ad tracking |
| `ai_jobs` queue | Stub only | Do not mention async AI job pipeline |
| BAA customer UI | DB table only | Do not claim in-app BAA signing unless built |

---

## 10. Security, privacy, and compliance — do not overclaim

### Do not use badge language without proof

- "SOC 2 certified" (unless true)
- "HIPAA certified"
- "GDPR certified"
- "Bank-grade encryption" (vague)
- "Military-grade encryption"
- "100% secure"
- "Zero breach history" (unless formally tracked and counsel-approved)
- "BAA included for all plans" (BAA/DPA — clarify execution; HIPAA BAA optional annex)

### Do not misstate subprocessors

We use: Supabase, OpenRouter, Razorpay, Zoho/SendGrid, Vercel, Upstash, Sentry.

Do not claim:

- "All data stays in your country" (international transfers occur — see Privacy Policy)
- "We never use third-party AI" (OpenRouter)
- "No cloud providers" (Supabase, Vercel)

### Do not misstate cookies

- We use **strictly necessary cookies only** (session, tenant context, admin impersonation cookie)
- Do not claim a full cookie consent platform for marketing trackers we do not run
- Do not install Google Analytics / Meta Pixel without updating Cookie Policy and banner first

### Do not misstate data retention

| Data type | Accurate retention (May 30, 2026) |
|-----------|-----------------------------------|
| Clinical records | While subscription active + until deletion request; backups may persist |
| Audit logs | ~6 years (`AUDIT_RETENTION_DAYS`) |
| Usage metrics | 90 days |
| Intake drafts | 7 days if not submitted |

Do not claim: "We delete everything instantly on request" — deletion SLA is **30 days** via privacy request process, subject to backups and legal holds.

---

## 11. Access roles — do not misrepresent

### Accurate role model for external communication

| Role | Say this | Do not say this |
|------|----------|-----------------|
| Practitioner / clinic staff | Access their clinic's records per role permissions | "Unlimited access to all patient data" |
| CliniqFlow Support | Handles billing and operational support; **does not access patient records** | "Support can pull up your chart" |
| Platform admin (Super Admin) | Maintenance, security, compliance; logged and auditable access | "We monitor your clinical decisions" |
| CliniqFlow as company | Software processor on clinic's instructions; not a medical provider | "CliniqFlow clinicians review your cases" |

Tenant roles (owner, admin, practitioner, staff, viewer) exist — do not collapse them into "everyone sees everything" in marketing.

---

## 12. Patient-facing copy — do not do

### Do not

- Promise patients that CliniqFlow will respond to their medical questions
- Tell patients to use intake forms for urgent symptoms
- Present AI-generated draft text to patients as clinical conclusions
- Omit link to Privacy Policy in consent flows (required pattern in intake form)
- Omit emergency disclaimer on intake completion
- Use consent version without tracking (`CURRENT_CONSENT_VERSION = 2026-05-30`)

### Do

- Direct clinical questions to the **clinic**
- Direct privacy requests about intake data to the **clinic** first; CliniqFlow `/privacy-request` for platform-level requests
- State that intake data is processed for the clinic's workflow

---

## 13. Sales calls and demos — do not do

### Do not say on calls

- "We diagnose based on intake" 
- "The AI will tell you what's wrong with the patient"
- "You can skip reviewing the note — it's accurate"
- "We're HIPAA certified so you're fully covered"
- "Our support team can log in and fix patient charts" (support has no PHI access)
- "We schedule appointments through intake" (disabled)
- "Replace your EHR with CliniqFlow"
- "We guarantee ROI in 30 days"

### Do not demo

- Appointment request step after intake submission
- Confidence scores or "Pattern assessment" panels (UI renamed — use live product labels)
- Outputs containing clinical recommendations ("order labs", "start treatment")
- A workflow where the note is marked final without practitioner approval click
- Fictional integrations (Epic, Cerner, Athena) unless actually built

### Do demo

- Niche questionnaire → encounter queue → draft SOAP → practitioner review → approve
- Intake theme highlights as **organization aid**, not diagnosis
- Compliance settings: audit export, links to DPA / Security Policy
- Footer and in-app disclaimers as trust signals

---

## 14. Website, ads, and social — do not do

### SEO / ads — avoid keyword targeting that misleads

Do not bid on or optimize for:

- "AI diagnosis software"
- "AI doctor for clinics"
- "Automated medical diagnosis"
- "Free EHR"
- "Telehealth platform"
- "Medical chatbot for patients"
- "HIPAA certified AI scribe" (unless counsel approves)

### Social posts — do not

- Share patient intake screenshots with real PHI
- Share AI outputs that read like diagnoses
- Claim FDA approval or clinical trial results without source
- Use before/after patient health narratives implying causation from CliniqFlow

### Email marketing — do not

- Subject lines: "AI diagnosed faster care" / "Automated treatment plans"
- Imply CliniqFlow provides medical services
- Omit link to Terms / Privacy where required for promotional email compliance

---

## 15. Competitive comparisons — avoid

### Do not say

- "Better than [EHR name] because we diagnose faster"
- "More accurate than human clinicians"
- "[Competitor] is unsafe; we are HIPAA certified"
- "The only AI that doesn't hallucinate"

### Safer comparison frame

- Compare on **workflow**: pre-visit intake structure, review-first drafts, operational visibility
- Compare on **scope**: intake layer vs full EHR — complementary, not replacement
- Compare on **control**: practitioner approval required

---

## 16. Visual and brand mistakes

### Do not use visual metaphors implying

- Robot doctor / stethoscope on AI logo implying autonomous care
- Red alarm UI suggesting CliniqFlow performs triage
- Green checkmarks on AI text implying "medically approved"
- Patient + AI chat as primary hero (suggests direct AI medical advice)

### Do not crop screenshots to hide

- "Draft documentation only" banners
- "Plan (review required)" labels
- Footer medical disclaimer
- Cookie notice (if capturing full-page EU-facing screenshots)

### Brand name

- **CliniqFlow** (capital F) in product/legal config
- Do not alternate spellings (Cliniqflow, Cliniq Flow) in new official copy without reason

---

## 17. Specific phrases we removed on May 30, 2026

**Do not restore these without counsel + evidence review.**

### Homepage

- ❌ "Save ~5.2 minutes of physician discovery time"
- ❌ "~5.2 min Physician discovery time saved"
- ❌ "Pattern scoring" (Growth plan feature bullet)
- ❌ "surfaces assessment patterns" (Clinical control section — now "organize intake into documentation themes")
- ❌ "appointment requests" in product demo description
- ❌ "Structured insights" panel title (now "Intake theme highlights")

### FAQ (homepage)

- ❌ "surfaces patterns" → ✅ "organizes responses into structured documentation themes for practitioner review"

### Dashboard

- ❌ "Pattern assessment"
- ❌ "Confidence 0.86 · medium"
- ❌ Appointment request panel in encounter shell

### Proof / demo data

- ❌ "Structured intake suggests sleep-stress dysregulation… Thyroid-related history and lab follow-up should be reviewed"
- ❌ `sleep_stress_axis`, `thyroid_review_flag`, `digestive_irritation` as visible pattern keys in marketing
- ❌ Appointment request on sample encounter

### AI system prompts and fallbacks (affects generated text — do not reintroduce in marketing samples)

- ❌ "Pattern suggests…"
- ❌ "Leading working impression suggests…"
- ❌ "Severity classification:"
- ❌ "Risk stratification:"
- ❌ "Findings are consistent with…" (as primary AI marketing framing — still may appear in restrained draft text but not in ads)
- ❌ "Track symptom severity, frequency, and response to initial recommendations" (monitoring plan language)

### Pattern library labels (internal — do not use old names in external copy)

- ❌ Digestive Dysfunction Pattern
- ❌ Fatigue and Recovery Pattern (as diagnostic label — internal key `fatigue_pattern` remains)
- ❌ Mechanical Pain Pattern (old marketing phrasing)

### Terms / legal (retired framings)

- ❌ Delaware governing law in customer-facing terms (now India)
- ❌ Terms of Use **$100 liability cap** (unified with ToS 12-month fees cap)
- ❌ "AI-assisted assessment support" in legal documents

---

## 18. Approved replacements quick reference

| Context | Preferred language |
|---------|-------------------|
| AI capability | AI-assisted documentation and clinical decision-support |
| Rule-based intake analysis (customer-facing) | Structured intake highlights / intake theme highlights |
| SOAP output | Draft documentation / draft SOAP-style sections |
| Practitioner action | Review, edit, approve, and sign |
| Pre-visit value | Reduce repetitive discovery; structured intake before the visit |
| Not an EHR | Intake and documentation workflow layer; works alongside your systems |
| AI data handling | Minimized clinical context; identifiers redacted in restricted mode |
| AI retention | We **request** zero retention from OpenRouter; provider terms apply |
| Support | CliniqFlow Support does not access patient records |
| Emergencies | Not for emergencies; contact local emergency services |
| Scheduling | Not offered — do not mention appointment booking |
| Confidence / scoring | Do not show numeric scores; optional "review priority" language |
| Clinical responsibility | Licensed practitioners remain solely responsible |

---

## 19. When in doubt — escalation checklist

Before publishing copy, ask:

1. **Category:** Are we accidentally describing an EHR, telehealth tool, scheduler, or diagnostic device?
2. **Autonomy:** Does this sentence imply the software — or AI — makes clinical decisions without a licensed practitioner?
3. **Diagnosis:** Does any verb or noun stack (`diagnose`, `predict`, `pattern scoring`, `confidence`, `working impression`) sound like diagnosis?
4. **Evidence:** Is there a number (minutes saved, % improvement) without a study?
5. **AI retention:** Are we claiming zero retention or zero PHI exposure beyond what Privacy Policy and AI Disclaimer state?
6. **Feature truth:** Is this feature enabled (`supportsAppointments`, support PHI access, delete API)?
7. **Legal sync:** Does this contradict `/terms`, `/privacy`, `/ai-disclaimer`, or `/medical-disclaimer`?
8. **UI sync:** Would a screenshot of the live product contradict this sentence?

If any answer is uncertain → **do not publish** until reviewed.

**Legal / product review contacts (from live config):**

- General / legal notices: support@cliniqflow.com
- Phone: (541) 730-3827
- Privacy: privacy@cliniqflow.com
- Security: security@cliniqflow.com

**Public policy index:** [cliniqflow.app/privacy](https://cliniqflow.app/privacy) and footer links to all 13 policy routes.

---

## Document control

| Field | Value |
|-------|-------|
| Version | legal-compliance-v1 |
| Created | May 30, 2026 |
| Aligns with git commit | `6a101a1` (Add legal and compliance package) |
| Deployed production | cliniqflow.app |
| Supersedes | Informal pre-May-30 marketing language including pattern scoring, ~5.2 min claims, assessment support phrasing |
| Next review | When adding features (scheduling, patient delete API, MFA, new AI providers, new roles, or new performance claims) |

---

*This manuscript is an internal marketing guardrail aligned to implemented product and legal behavior. It does not replace licensed legal counsel. When marketing requirements conflict with this document, update the product and legal policies first — do not publish the conflicting claim.*
