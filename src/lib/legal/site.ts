export const LEGAL = {
  productName: "CliniqFlow",
  tradeName: "CliniqFlow",
  legalName: "Ganesh Datta",
  entityDescription:
    "an individual sole proprietor operating under the trade name CliniqFlow",
  jurisdiction: "India",
  registrationPlaceholder: "[Registration Number]",
  addressPlaceholder: "[Registered Business Address, City, State, India]",
  website: "https://cliniqflow.app",
  supportEmail: "support@cliniqflow.com",
  privacyEmail: "privacy@cliniqflow.com",
  securityEmail: "security@cliniqflow.com",
  legalEmail: "support@cliniqflow.com",
  lastUpdated: "May 30, 2026",
  trialDays: 14,
  arbitrationVenues: "India or Singapore",
  arbitrationInstitution: "[Arbitration institution — e.g., SIAC or DIAC]",
  dataDeletionSlaDays: 30,
} as const;

export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/medical-disclaimer", label: "Medical Disclaimer" },
  { href: "/ai-disclaimer", label: "AI Disclaimer" },
  { href: "/acceptable-use", label: "Acceptable Use Policy" },
  { href: "/dpa", label: "Data Processing Addendum" },
  { href: "/security-policy", label: "Security Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/subprocessors", label: "Subprocessors" },
  { href: "/legal-liability", label: "Liability & Indemnification" },
  { href: "/cancellation", label: "Cancellation Policy" },
  { href: "/privacy-request", label: "Privacy Requests" },
] as const;

export function legalEntityBlock() {
  return `${LEGAL.legalName}, ${LEGAL.entityDescription} (${LEGAL.jurisdiction}). Registered details: ${LEGAL.registrationPlaceholder}, ${LEGAL.addressPlaceholder}.`;
}
