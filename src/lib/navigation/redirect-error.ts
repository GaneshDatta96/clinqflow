/** Detect Next.js `redirect()` throws without importing client-only modules. */
export function isRedirectError(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("digest" in error) ||
    typeof (error as { digest: unknown }).digest !== "string"
  ) {
    return false;
  }

  const digest = (error as { digest: string }).digest;
  return digest.startsWith("NEXT_REDIRECT;");
}
