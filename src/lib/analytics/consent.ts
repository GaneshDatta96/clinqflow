/** localStorage key set when the visitor dismisses the cookie notice. */
export const COOKIE_NOTICE_STORAGE_KEY = "cliniqflow_cookie_notice_ack";

export const ANALYTICS_CONSENT_DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

export const ANALYTICS_CONSENT_GRANTED = {
  analytics_storage: "granted",
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function grantAnalyticsConsent() {
  window.gtag?.("consent", "update", { ...ANALYTICS_CONSENT_GRANTED });
}

export function hasAnalyticsConsentAck(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
