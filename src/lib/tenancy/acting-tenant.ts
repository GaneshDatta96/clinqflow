import { cookies } from "next/headers";
import { ACTING_TENANT_COOKIE } from "@/lib/tenancy/platform-admin";

export async function getActingTenantIdFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ACTING_TENANT_COOKIE)?.value ?? null;
}

export function getActingTenantIdFromRequest(request: Request) {
  const header = request.headers.get("x-acting-tenant-id");
  if (header) return header;
  return null;
}
