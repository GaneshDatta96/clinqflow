import { cookies, headers } from "next/headers";
import { cookieDomainForHost } from "@/lib/routing/zones";

export const ACTIVE_TENANT_COOKIE = "cliniqflow_active_tenant_id";

async function cookieDomain() {
  return cookieDomainForHost((await headers()).get("host"));
}

export async function getActiveTenantIdFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ACTIVE_TENANT_COOKIE)?.value ?? null;
}

export async function setActiveTenantCookie(tenantId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_TENANT_COOKIE, tenantId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
    domain: await cookieDomain(),
  });
}

export async function clearActiveTenantCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_TENANT_COOKIE, "", {
    path: "/",
    maxAge: 0,
    domain: await cookieDomain(),
  });
}
