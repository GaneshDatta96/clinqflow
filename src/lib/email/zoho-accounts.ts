import { z } from "zod";

const zohoAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  smtp: z.string().min(1),
  imap: z.string().optional(),
  port: z.coerce.number().int().positive().default(587),
});

export type ZohoAccount = z.infer<typeof zohoAccountSchema>;

let accountIndex = 0;
let cachedAccountsRaw: string | null | undefined;
let cachedAccounts: ZohoAccount[] | null = null;

export function parseZohoAccountsJson(raw: string | null | undefined): ZohoAccount[] {
  const normalized = raw?.trim() ?? "";
  if (cachedAccounts && cachedAccountsRaw === normalized) {
    return cachedAccounts;
  }

  if (!normalized) {
    cachedAccountsRaw = normalized;
    cachedAccounts = [];
    return cachedAccounts;
  }

  const parsed = JSON.parse(normalized) as unknown;
  const accounts = z.array(zohoAccountSchema).parse(parsed);
  cachedAccountsRaw = normalized;
  cachedAccounts = accounts;
  return accounts;
}

/** Round-robin pick; returns start index for retry rotation. */
export function nextZohoSendSlot(accounts: ZohoAccount[]) {
  if (accounts.length === 0) {
    throw new Error("No Zoho SMTP accounts configured.");
  }

  const startIndex = accountIndex % accounts.length;
  accountIndex = (accountIndex + 1) % accounts.length;
  return { startIndex };
}

export function zohoAccountsStartingAt(startIndex: number, accounts: ZohoAccount[]) {
  if (accounts.length === 0) {
    return [];
  }

  const ordered: ZohoAccount[] = [];
  for (let offset = 0; offset < accounts.length; offset += 1) {
    ordered.push(accounts[(startIndex + offset) % accounts.length]!);
  }
  return ordered;
}
