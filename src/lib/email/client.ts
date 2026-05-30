import nodemailer from "nodemailer";
import { env } from "@/lib/env";
import {
  nextZohoSendSlot,
  parseZohoAccountsJson,
  zohoAccountsStartingAt,
  type ZohoAccount,
} from "@/lib/email/zoho-accounts";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput) {
  if (!env.emailEnabled) {
    console.info("[email] skipped (not configured)", {
      to: input.to,
      subject: input.subject,
    });
    return { ok: true as const, skipped: true as const };
  }

  if (env.emailProvider === "sendgrid") {
    return sendViaSendGrid(input);
  }

  if (env.emailProvider === "zoho") {
    return sendViaZoho(input);
  }

  return sendViaZoho(input);
}

async function sendViaZoho(input: SendEmailInput) {
  const accounts = parseZohoAccountsJson(env.zohoAccountsJson);
  if (accounts.length === 0) {
    throw new Error("ZOHO_ACCOUNTS_JSON is empty or invalid.");
  }

  const { startIndex } = nextZohoSendSlot(accounts);
  const candidates = zohoAccountsStartingAt(startIndex, accounts);

  let lastError: unknown;

  for (const account of candidates) {
    try {
      await sendWithZohoAccount(account, input);
      return { ok: true as const, skipped: false as const, from: account.email };
    } catch (error) {
      lastError = error;
      console.warn("[email] zoho account failed, trying next", {
        from: account.email,
        to: input.to,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All Zoho SMTP accounts failed.");
}

async function sendWithZohoAccount(account: ZohoAccount, input: SendEmailInput) {
  const transporter = nodemailer.createTransport({
    host: account.smtp,
    port: account.port,
    secure: account.port === 465,
    auth: {
      user: account.email,
      pass: account.password,
    },
  });

  await transporter.sendMail({
    from: formatFromAddress(account.email),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text ?? stripHtml(input.html),
  });
}

function formatFromAddress(accountEmail: string) {
  const configured = env.emailFrom?.trim();
  if (!configured) {
    return `"CliniqFlow" <${accountEmail}>`;
  }

  const match = configured.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return `"${match[1]!.trim()}" <${accountEmail}>`;
  }

  if (configured.includes("@")) {
    return configured;
  }

  return `"${configured}" <${accountEmail}>`;
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function sendViaSendGrid(input: SendEmailInput) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.sendgridApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: input.to }] }],
      from: { email: env.emailFrom },
      subject: input.subject,
      content: [
        { type: "text/plain", value: input.text ?? input.subject },
        { type: "text/html", value: input.html },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`SendGrid error: ${response.status} ${body}`);
  }

  return { ok: true as const, skipped: false as const };
}
