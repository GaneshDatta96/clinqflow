/**
 * One-off: send a verification link via Zoho SMTP.
 * Usage: node --env-file-if-exists=.env scripts/send-test-verify-email.mjs user@example.com
 */
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/send-test-verify-email.mjs user@example.com");
  process.exit(1);
}

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appUrl = (process.env.APP_URL ?? "https://cliniqflow.app").replace(/\/$/, "");

if (!url || !serviceKey || !process.env.ZOHO_ACCOUNTS_JSON) {
  console.error("Missing SUPABASE_* or ZOHO_ACCOUNTS_JSON in env");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo: `${appUrl}/auth/callback` },
});

if (error) {
  console.error("generateLink failed:", error.message);
  process.exit(1);
}

const verifyUrl = data.properties?.hashed_token
  ? `${(process.env.APP_URL ?? "https://cliniqflow.app").replace(/\/$/, "")}/auth/verify?token=${encodeURIComponent(data.properties.hashed_token)}&type=${encodeURIComponent(data.properties.verification_type ?? "magiclink")}`
  : data.properties?.action_link;
if (!verifyUrl) {
  console.error("No verification link returned");
  process.exit(1);
}

const accounts = JSON.parse(process.env.ZOHO_ACCOUNTS_JSON);
const account = accounts[0];
const transporter = nodemailer.createTransport({
  host: account.smtp,
  port: account.port,
  secure: account.port === 465,
  auth: { user: account.email, pass: account.password },
});

await transporter.sendMail({
  from: `"CliniqFlow" <${account.email}>`,
  to: email,
  subject: "Verify your CliniqFlow email",
  html: `<p><a href="${verifyUrl}">Verify email and continue</a></p>`,
  text: verifyUrl,
});

console.log(`Sent verification email to ${email} from ${account.email}`);
