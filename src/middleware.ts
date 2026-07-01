import { NextRequest } from "next/server";
import {
  applyPrivateNoStoreHeaders,
  shouldApplyPrivateNoStore,
} from "@/lib/http/cache-control";
import {
  buildContentSecurityPolicy,
  CSP_NONCE_HEADER,
  generateCspNonce,
} from "@/lib/security/csp";
import { proxy } from "@/proxy";

export async function middleware(request: NextRequest) {
  const nonce = generateCspNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CSP_NONCE_HEADER, nonce);

  const nonceRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });

  const response = await proxy(nonceRequest);
  const production = process.env.NODE_ENV === "production";

  response.headers.set(
    "Content-Security-Policy",
    buildContentSecurityPolicy(nonce, production),
  );

  if (shouldApplyPrivateNoStore(request.nextUrl.pathname)) {
    applyPrivateNoStoreHeaders(response.headers);
  }

  return response;
}

export { config } from "@/proxy";
