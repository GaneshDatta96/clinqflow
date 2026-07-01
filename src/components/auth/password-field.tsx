"use client";

import { assessPasswordStrength } from "@/lib/auth/password";

const STRENGTH_COLORS: Record<ReturnType<typeof assessPasswordStrength>["label"], string> = {
  weak: "bg-red-500",
  fair: "bg-orange-400",
  good: "bg-yellow-400",
  strong: "bg-green-500",
};

export function PasswordField(props: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  email?: string;
  showStrength?: boolean;
  hint?: string;
}) {
  const strength =
    props.showStrength && props.value.length > 0
      ? assessPasswordStrength(props.value, { email: props.email })
      : null;

  return (
    <label className="block">
      <span className="text-sm font-semibold">{props.label}</span>
      <input
        id={props.id}
        type="password"
        className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/15"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete={props.autoComplete}
        required={props.required ?? true}
        minLength={8}
      />
      {props.hint && !strength && (
        <p className="mt-1.5 text-xs text-[color:var(--muted)]">{props.hint}</p>
      )}
      {strength && (
        <div className="mt-2 space-y-1.5" aria-live="polite">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((segment) => (
              <div
                key={segment}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  segment < strength.score
                    ? STRENGTH_COLORS[strength.label]
                    : "bg-[color:var(--line)]"
                }`}
              />
            ))}
          </div>
          <p
            className={`text-xs ${
              strength.valid ? "text-green-700" : "text-[color:var(--muted)]"
            }`}
          >
            {strength.valid
              ? "Strong enough to use"
              : strength.feedback.slice(0, 2).join(" · ")}
          </p>
        </div>
      )}
    </label>
  );
}
