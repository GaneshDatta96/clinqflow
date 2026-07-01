import { after } from "next/server";
import {
  findAuthUserByEmail,
  isAuthDuplicateEmailError,
  isEmailConfirmed,
} from "@/lib/auth/auth-users";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { sendEmail } from "@/lib/email/client";
import {
  buildAlreadyRegisteredEmail,
  buildPasswordResetEmail,
  buildSignupVerifyEmail,
} from "@/lib/email/templates/auth-verify";
import { env } from "@/lib/env";
import { badRequest } from "@/lib/api/errors";
import { appAuthVerifyUrl } from "@/lib/auth/verification-link";

function loginUrl() {
  return `${env.appUrl.replace(/\/$/, "")}/login`;
}

function readVerificationUrl(properties: Record<string, unknown> | undefined) {
  return appAuthVerifyUrl(properties);
}

async function sendVerificationEmail(args: {
  email: string;
  fullName?: string;
  properties: Record<string, unknown> | undefined;
  purpose?: "signup" | "resend";
}) {
  const verifyUrl = readVerificationUrl(args.properties);
  if (!verifyUrl) {
    throw badRequest("Could not generate a verification link.");
  }

  const template = buildSignupVerifyEmail({
    verifyUrl,
    fullName: args.fullName,
    purpose: args.purpose,
  });

  await sendEmail({
    to: args.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

function scheduleVerificationEmail(args: {
  email: string;
  fullName?: string;
  properties: Record<string, unknown> | undefined;
  purpose?: "signup" | "resend";
}) {
  after(async () => {
    try {
      await sendVerificationEmail(args);
    } catch (error) {
      console.error("[auth] verification email failed", {
        email: args.email,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

async function sendAlreadyRegisteredNotice(args: {
  email: string;
  fullName?: string;
}) {
  const template = buildAlreadyRegisteredEmail({
    loginUrl: loginUrl(),
    fullName: args.fullName,
  });

  await sendEmail({
    to: args.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

function scheduleAlreadyRegisteredNotice(args: {
  email: string;
  fullName?: string;
}) {
  after(async () => {
    try {
      await sendAlreadyRegisteredNotice(args);
    } catch (error) {
      console.error("[auth] already-registered notice failed", {
        email: args.email,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
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
  const fullName = args.fullName.trim();

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password: args.password,
    email_confirm: false,
    user_metadata: { full_name: fullName },
  });

  if (!createError) {
    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      password: args.password,
    });

    if (error) {
      throw badRequest(error.message);
    }

    scheduleVerificationEmail({
      email,
      fullName,
      properties: data.properties as Record<string, unknown> | undefined,
    });

    return { emailSent: true, existingAccount: false as const };
  }

  if (!isAuthDuplicateEmailError(createError)) {
    throw badRequest(createError.message);
  }

  const existing = await findAuthUserByEmail(email);

  if (!existing) {
    throw badRequest(createError.message);
  }

  if (isEmailConfirmed(existing)) {
    scheduleAlreadyRegisteredNotice({
      email,
      fullName:
        fullName ||
        (typeof existing.user_metadata?.full_name === "string"
          ? existing.user_metadata.full_name
          : undefined),
    });
    return { emailSent: true, existingAccount: true as const };
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(
    existing.id,
    {
      password: args.password,
      user_metadata: { full_name: fullName },
    },
  );
  if (updateError) {
    throw badRequest(updateError.message);
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password: args.password,
  });

  if (error) {
    throw badRequest(error.message);
  }

  scheduleVerificationEmail({
    email,
    fullName,
    properties: data.properties as Record<string, unknown> | undefined,
  });

  return { emailSent: true, existingAccount: false as const };
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
  const existing = await findAuthUserByEmail(email);

  if (!existing) {
    throw badRequest("No account found for this email.");
  }

  if (isEmailConfirmed(existing)) {
    scheduleAlreadyRegisteredNotice({
      email,
      fullName:
        typeof existing.user_metadata?.full_name === "string"
          ? existing.user_metadata.full_name
          : undefined,
    });
    return { emailSent: true, existingAccount: true as const };
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error) {
    throw badRequest(error.message);
  }

  const fullName =
    typeof existing.user_metadata?.full_name === "string"
      ? existing.user_metadata.full_name
      : undefined;

  scheduleVerificationEmail({
    email,
    fullName,
    properties: data.properties as Record<string, unknown> | undefined,
    purpose: "resend",
  });

  return { emailSent: true, existingAccount: false as const };
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
  });

  if (error) {
    // Avoid leaking whether an account exists.
    return { emailSent: true as const };
  }

  const resetUrl = readVerificationUrl(
    data.properties as Record<string, unknown> | undefined,
  );
  if (!resetUrl) {
    return { emailSent: true as const };
  }

  const template = buildPasswordResetEmail({ resetUrl });

  after(async () => {
    try {
      await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
    } catch (sendError) {
      console.error("[auth] password reset email failed", {
        email,
        error: sendError instanceof Error ? sendError.message : String(sendError),
      });
    }
  });

  return { emailSent: true as const };
}
