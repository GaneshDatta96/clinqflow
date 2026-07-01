import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics/site";
import { COOKIE_NOTICE_STORAGE_KEY } from "@/lib/analytics/consent";

export function GoogleTag({ nonce }: { nonce?: string }) {
  return (
    <>
      <Script id="google-consent-default" strategy="beforeInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });
          try {
            if (localStorage.getItem('${COOKIE_NOTICE_STORAGE_KEY}')) {
              gtag('consent', 'update', { 'analytics_storage': 'granted' });
            }
          } catch (e) {}
        `}
      </Script>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="google-tag" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
