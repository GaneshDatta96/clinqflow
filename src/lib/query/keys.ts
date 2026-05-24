export const queryKeys = {
  clinics: ["clinics"] as const,
  invites: ["invites"] as const,
  encounters: (params?: { q?: string; offset?: number }) =>
    ["encounters", params] as const,
  sessionRole: ["session-role"] as const,
};
