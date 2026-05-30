import { emailShell } from "@/lib/email/templates/shared";

export function buildSignupVerifyEmail(args: { verifyUrl: string; fullName?: string }) {
  const name = args.fullName?.trim();
  const subject = "Quick verify — then back to clinic life";

  const lines = name
    ? [
        `Hey ${name},`,
        "Welcome to CliniqFlow. One tap below confirms your email so we can get you into onboarding.",
        "No paperwork. No hold music. Just a button.",
      ]
    : [
        "Hey,",
        "Welcome to CliniqFlow. One tap below confirms your email so we can get you into onboarding.",
        "No paperwork. No hold music. Just a button.",
      ];

  const { html, text } = emailShell({
    title: "Confirm it's really you",
    lines,
    ctaLabel: "Verify email",
    ctaUrl: args.verifyUrl,
    footer: "Didn't sign up? Ignore this — we won't chase you.",
  });

  return { subject, html, text };
}

export function buildPasswordResetEmail(args: { resetUrl: string }) {
  const subject = "Password reset (happens to the best of us)";

  const { html, text } = emailShell({
    title: "Reset your password",
    lines: [
      "Someone asked to reset your CliniqFlow password.",
      "If that was you, hit the button. If not, carry on — this link will expire quietly.",
    ],
    ctaLabel: "Choose a new password",
    ctaUrl: args.resetUrl,
    footer: "Didn't request this? Safe to ignore.",
  });

  return { subject, html, text };
}

export function buildAlreadyRegisteredEmail(args: { loginUrl: string; fullName?: string }) {
  const name = args.fullName?.trim();
  const subject = "You're already on the list";

  const lines = name
    ? [
        `Hey ${name},`,
        "Good news: you already have a CliniqFlow account with this email.",
        "No need to sign up again — just sign in below.",
      ]
    : [
        "Hey,",
        "Good news: you already have a CliniqFlow account with this email.",
        "No need to sign up again — just sign in below.",
      ];

  const { html, text } = emailShell({
    title: "Already registered",
    lines,
    ctaLabel: "Sign in",
    ctaUrl: args.loginUrl,
    footer: "Forgot your password? Use reset on the login page.",
  });

  return { subject, html, text };
}

