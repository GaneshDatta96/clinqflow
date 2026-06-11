/** Patient-facing intake URLs — no site navigation (header, footer, outbound links). */
export function isPatientIntakePath(pathname: string) {
  return pathname.startsWith("/c/");
}
