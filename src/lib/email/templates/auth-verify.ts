import { emailShell } from "@/lib/email/templates/shared";

type VerificationPurpose = "signup" | "resend";

export function buildSignupVerifyEmail(args: {
  verifyUrl: string;
  fullName?: string;
  purpose?: VerificationPurpose;
}) {
  const name = args.fullName?.trim();
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const isResend = args.purpose === "resend";

  const subject = isResend
    ? "Your fresh CliniqFlow verification link"
    : "Welcome to CliniqFlow — confirm your email";

  const lines = isResend
    ? [
        greeting,
        "Here is a new verification link for your CliniqFlow account.",
        "Once confirmed, you can finish setting up your clinic workspace, invite your team, and start sending structured intake before appointments begin.",
        "This link is personal to you. If it has expired, you can always request another from the sign-up page.",
      ]
    : [
        greeting,
        "Thank you for starting with CliniqFlow. You are one step away from a calmer pre-visit workflow for your clinic.",
        "Confirm your email to unlock onboarding, set up your workspace, and begin turning patient intake into review-ready documentation.",
        "We built CliniqFlow for teams who want less front-desk friction and clearer context before the first hello in the exam room.",
      ];

  const { html, text } = emailShell({
    title: isResend ? "Your new verification link" : "Confirm your email to get started",
    preheader: isResend
      ? "A fresh verification link is ready for your CliniqFlow account."
      : "One quick confirmation and your clinic workspace is ready to set up.",
    lines,
    ctaLabel: isResend ? "Verify my email" : "Confirm my email",
    ctaUrl: args.verifyUrl,
    footer: isResend
      ? "Didn't request this? You can safely ignore this message."
      : "Didn't create a CliniqFlow account? No action needed — this message can be ignored.",
  });

  return { subject, html, text };
}

export function buildPasswordResetEmail(args: { resetUrl: string }) {
  const subject = "Reset your CliniqFlow password";

  const { html, text } = emailShell({
    title: "Create a new password",
    preheader: "Use this secure link to choose a new password for your CliniqFlow account.",
    lines: [
      "We received a request to reset the password for your CliniqFlow account.",
      "If you made this request, use the button below to choose a new password and get back into your clinic workspace.",
      "For your security, this link will expire after a short time. If it no longer works, you can request a fresh reset link from the sign-in page.",
      "If you did not request a password reset, you can ignore this email. Your account remains secure.",
    ],
    ctaLabel: "Reset my password",
    ctaUrl: args.resetUrl,
    footer: "Need help? Reply to your clinic administrator or contact CliniqFlow support.",
  });

  return { subject, html, text };
}

export function buildAlreadyRegisteredEmail(args: { loginUrl: string; fullName?: string }) {
  const name = args.fullName?.trim();
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const subject = "You already have a CliniqFlow account";

  const lines = [
    greeting,
    "It looks like this email address is already connected to a CliniqFlow account.",
    "No need to sign up again — simply sign in to return to your clinic workspace, encounters, and intake queue.",
    "If you were trying to create a new organization, sign in first and start a separate workspace from your account settings.",
  ];

  const { html, text } = emailShell({
    title: "Welcome back",
    preheader: "Your email is already registered. Sign in to continue to your clinic workspace.",
    lines,
    ctaLabel: "Sign in to CliniqFlow",
    ctaUrl: args.loginUrl,
    footer: "Forgot your password? Choose \"Forgot password\" on the sign-in page to receive a secure reset link.",
  });

  return { subject, html, text };
}
