-- Platform support must not read patient/clinical records (architecture + legal requirement).
-- Support retains SELECT on operational tables: tenants, billing, memberships, clinics metadata, etc.

drop policy if exists platform_support_patients_select on public.patients;
drop policy if exists platform_support_encounters_select on public.encounters;
drop policy if exists platform_support_intake_submissions_select on public.intake_submissions;
drop policy if exists platform_support_assessment_results_select on public.assessment_results;
drop policy if exists platform_support_soap_notes_select on public.soap_notes;
drop policy if exists platform_support_appointment_requests_select on public.appointment_requests;
drop policy if exists platform_support_intake_links_select on public.intake_links;
drop policy if exists platform_support_intake_drafts_select on public.intake_drafts;
drop policy if exists platform_support_ai_generations_select on public.ai_generations;
drop policy if exists platform_support_consent_select on public.consent_records;
