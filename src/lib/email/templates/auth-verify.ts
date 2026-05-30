export function buildSignupVerifyEmail(args: { verifyUrl: string; fullName?: string }) {
  const greeting = args.fullName?.trim() ? `Hi ${args.fullName.trim()},` : "Hi,";
  const subject = "Verify your CliniqFlow email";

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #0e7c7b;">Confirm your email</h1>
      <p>${greeting}</p>
      <p>Thanks for signing up for CliniqFlow. Verify your email to continue to clinic onboarding.</p>
      <p>
        <a href="${args.verifyUrl}" style="display: inline-block; background: #0e7c7b; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">
          Verify email address
        </a>
      </p>
      <p style="color: #61777d; font-size: 14px;">If you did not create an account, you can ignore this email.</p>
    </div>
  `;

  const text = `${greeting}\n\nVerify your CliniqFlow email:\n${args.verifyUrl}\n\nIf you did not create an account, ignore this message.`;

  return { subject, html, text };
}

export function buildPasswordResetEmail(args: { resetUrl: string }) {
  const subject = "Reset your CliniqFlow password";

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #0e7c7b;">Reset your password</h1>
      <p>We received a request to reset your CliniqFlow password.</p>
      <p>
        <a href="${args.resetUrl}" style="display: inline-block; background: #0e7c7b; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">
          Reset password
        </a>
      </p>
      <p style="color: #61777d; font-size: 14px;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  const text = `Reset your CliniqFlow password:\n${args.resetUrl}\n\nIf you did not request this, ignore this message.`;

  return { subject, html, text };
}
