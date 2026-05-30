import { LEGAL } from "@/lib/legal/site";

export const SERVICE_DESCRIPTION =
  "CliniqFlow provides patient intake forms, demographic and symptom collection, intake questionnaires, rule-based intake structuring, and AI-assisted documentation and clinical decision-support. Outputs are draft documentation for licensed practitioner review. CliniqFlow is not an EHR, telehealth platform, insurance platform, prescription platform, treatment management platform, or appointment scheduling system.";

export const AI_DISCLAIMER_SHORT =
  "AI outputs are draft documentation and clinical decision-support only. Licensed practitioners must review and approve all outputs before clinical or operational use.";

export const LIABILITY_CAP_INTRO = `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ${LEGAL.legalName}'s total aggregate liability arising out of or relating to the service will not exceed the amounts paid by Customer to ${LEGAL.tradeName} for the service in the twelve (12) months immediately preceding the event giving rise to the claim.`;

export const EXCLUDED_DAMAGES =
  "IN NO EVENT WILL CLINIQFLOW BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.";

export const GOVERNING_LAW =
  "These terms are governed by the laws of India, without regard to conflict-of-law principles, except where mandatory law in the Customer's jurisdiction requires otherwise.";

export const ARBITRATION_CLAUSE = `Any dispute arising out of or relating to these terms or the service that cannot be resolved through good-faith negotiation within thirty (30) days will be finally settled by binding arbitration seated in ${LEGAL.arbitrationVenues}, under the rules of ${LEGAL.arbitrationInstitution}. The language of arbitration will be English. Either party may seek injunctive or equitable relief in a court of competent jurisdiction to protect intellectual property, confidentiality, or security interests pending arbitration.`;
