export const LEGAL = {
  productName: "Cliniqflow",
  companyName: "Cliniqflow",
  website: "https://clinqflow.vercel.app",
  supportEmail: "support@cliniqflow.com",
  privacyEmail: "privacy@cliniqflow.com",
  lastUpdated: "May 23, 2026",
  trialDays: 14,
} as const;

export const LEGAL_PAGES = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/cancellation", label: "Cancellation Policy" },
] as const;
