import { authUrl } from "@/lib/routing/zones";

export function appAuthVerifyUrl(properties: Record<string, unknown> | undefined) {
  const token = properties?.hashed_token;
  const type = properties?.verification_type ?? "magiclink";

  if (typeof token !== "string" || token.length === 0) {
    return null;
  }

  const params = new URLSearchParams({
    token,
    type: String(type),
  });

  return authUrl(`/auth/verify?${params.toString()}`);
}
