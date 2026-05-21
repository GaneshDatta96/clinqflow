import { AuthForm } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        We will email you a secure link to reset your password.
      </p>
      <div className="mt-8">
        <AuthForm mode="forgot" />
      </div>
    </div>
  );
}
