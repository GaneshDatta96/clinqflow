import { Resend } from "resend";
import { env } from "@/lib/env";

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

  return sendViaResend(input);
}

async function sendViaResend(input: SendEmailInput) {
  const resend = new Resend(env.resendApiKey!);

  const { error } = await resend.emails.send({
    from: env.emailFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true as const, skipped: false as const };
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
