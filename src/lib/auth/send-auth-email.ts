import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { sendEmail } from "@/lib/email/client";
import {
  buildPasswordResetEmail,
  buildSignupVerifyEmail,
} from "@/lib/email/templates/auth-verify";
import { env } from "@/lib/env";
import { badRequest } from "@/lib/api/errors";

function authCallbackUrl() {
  return `${env.appUrl.replace(/\/$/, "")}/auth/callback`;
}

function readActionLink(properties: Record<string, unknown> | undefined) {
  const link = properties?.action_link;
  return typeof link === "string" && link.length > 0 ? link : null;
}

export async function sendSignupVerificationEmail(args: {
  email: string;
  password: string;
  fullName: string;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw badRequest("Authentication is not configured.");
  }

  if (!env.emailEnabled) {
    throw badRequest(
      "Email is not configured. Set ZOHO_ACCOUNTS_JSON on the server.",
    );
  }

  const email = args.email.trim().toLowerCase();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password: args.password,
    options: {
      data: { full_name: args.fullName.trim() },
      redirectTo: authCallbackUrl(),
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered")) {
      throw badRequest("An account with this email already exists. Try signing in.");
    }
    throw badRequest(error.message);
  }

  const verifyUrl = readActionLink(
    data.properties as Record<string, unknown> | undefined,
  );
  if (!verifyUrl) {
    throw badRequest("Could not generate a verification link.");
  }

  const template = buildSignupVerifyEmail({
    verifyUrl,
    fullName: args.fullName,
  });

  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return { emailSent: true as const };
}

export async function resendSignupVerificationEmail(args: { email: string }) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw badRequest("Authentication is not configured.");
  }

  if (!env.emailEnabled) {
    throw badRequest(
      "Email is not configured. Set ZOHO_ACCOUNTS_JSON on the server.",
    );
  }

  const email = args.email.trim().toLowerCase();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: authCallbackUrl(),
    },
  });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("not found") || message.includes("no user")) {
      throw badRequest("No account found for this email.");
    }
    if (message.includes("already") && message.includes("confirm")) {
      throw badRequest("This email is already verified. You can sign in.");
    }
    throw badRequest(error.message);
  }

  const verifyUrl = readActionLink(
    data.properties as Record<string, unknown> | undefined,
  );
  if (!verifyUrl) {
    throw badRequest("Could not generate a verification link.");
  }

  const fullName =
    typeof data.user?.user_metadata?.full_name === "string"
      ? data.user.user_metadata.full_name
      : undefined;

  const template = buildSignupVerifyEmail({ verifyUrl, fullName });

  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return { emailSent: true as const };
}

export async function sendPasswordResetEmail(args: { email: string }) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw badRequest("Authentication is not configured.");
  }

  if (!env.emailEnabled) {
    throw badRequest(
      "Email is not configured. Set ZOHO_ACCOUNTS_JSON on the server.",
    );
  }

  const email = args.email.trim().toLowerCase();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${authCallbackUrl()}?type=recovery`,
    },
  });

  if (error) {
    // Avoid leaking whether an account exists.
    return { emailSent: true as const };
  }

  const resetUrl = readActionLink(
    data.properties as Record<string, unknown> | undefined,
  );
  if (!resetUrl) {
    return { emailSent: true as const };
  }

  const template = buildPasswordResetEmail({ resetUrl });

  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return { emailSent: true as const };
}
