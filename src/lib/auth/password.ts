import { z } from "zod";

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

/** Top breached / trivial passwords — keep list small; extend as needed. */
const COMMON_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "letmein1",
  "welcome1",
  "admin123",
  "clinic123",
  "health123",
  "iloveyou",
  "sunshine1",
  "football1",
  "baseball1",
  "monkey123",
  "dragon123",
  "master123",
  "trustno1",
  "changeme",
  "changeme1",
  "passw0rd",
  "passw0rd!",
]);

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "weak" | "fair" | "good" | "strong";
  feedback: string[];
  valid: boolean;
};

export type PasswordValidationOptions = {
  email?: string;
};

function strengthLabel(score: PasswordStrength["score"]): PasswordStrength["label"] {
  if (score <= 1) return "weak";
  if (score === 2) return "fair";
  if (score === 3) return "good";
  return "strong";
}

export function assessPasswordStrength(
  password: string,
  options?: PasswordValidationOptions,
): PasswordStrength {
  const feedback: string[] = [];
  let points = 0;

  if (password.length < MIN_LENGTH) {
    feedback.push(`Use at least ${MIN_LENGTH} characters`);
  } else {
    points += 1;
  }

  if (password.length >= 12) {
    points += 1;
  }

  if (!/[a-z]/.test(password)) {
    feedback.push("Add a lowercase letter");
  } else {
    points += 1;
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push("Add an uppercase letter");
  } else {
    points += 1;
  }

  if (!/[0-9]/.test(password)) {
    feedback.push("Add a number");
  } else {
    points += 1;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push("Add a symbol (e.g. ! @ #)");
  } else {
    points += 1;
  }

  const normalized = password.trim().toLowerCase();
  if (COMMON_PASSWORDS.has(normalized)) {
    feedback.push("This password is too common — choose something unique");
    points = 0;
  }

  const email = options?.email?.trim().toLowerCase();
  if (email) {
    const local = email.split("@")[0];
    if (local && local.length >= 3 && normalized.includes(local)) {
      feedback.push("Avoid using your email in the password");
      points = Math.max(0, points - 2);
    }
  }

  const score = Math.min(4, Math.max(0, points - 1)) as PasswordStrength["score"];

  const meetsRules =
    password.length >= MIN_LENGTH &&
    password.length <= MAX_LENGTH &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    !COMMON_PASSWORDS.has(normalized) &&
    score >= 3;

  return {
    score,
    label: strengthLabel(score),
    feedback: feedback.length > 0 ? feedback : ["Password meets requirements"],
    valid: meetsRules,
  };
}

export function validatePassword(
  password: string,
  options?: PasswordValidationOptions,
): { valid: boolean; errors: string[]; strength: PasswordStrength } {
  const strength = assessPasswordStrength(password, options);
  const errors: string[] = [];

  if (password.length > MAX_LENGTH) {
    errors.push(`Password must be at most ${MAX_LENGTH} characters`);
  }

  if (!strength.valid) {
    errors.push(...strength.feedback.filter((f) => f !== "Password meets requirements"));
  }

  return {
    valid: errors.length === 0 && strength.valid,
    errors: errors.length > 0 ? errors : strength.valid ? [] : strength.feedback,
    strength,
  };
}

export function passwordSchema(options?: PasswordValidationOptions) {
  return z
    .string()
    .min(MIN_LENGTH, `Password must be at least ${MIN_LENGTH} characters`)
    .max(MAX_LENGTH, `Password must be at most ${MAX_LENGTH} characters`)
    .superRefine((value, ctx) => {
      const result = validatePassword(value, options);
      if (!result.valid) {
        ctx.addIssue({
          code: "custom",
          message: result.errors[0] ?? "Password does not meet strength requirements",
        });
      }
    });
}

export function passwordSchemaForEmail(email: string) {
  return z
    .string()
    .min(MIN_LENGTH)
    .max(MAX_LENGTH)
    .superRefine((value, ctx) => {
      const result = validatePassword(value, { email });
      if (!result.valid) {
        ctx.addIssue({
          code: "custom",
          message: result.errors[0] ?? "Password does not meet strength requirements",
        });
      }
    });
}
