"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (options: { hostedButtonId: string }) => {
        render: (selector: string) => Promise<void>;
      };
    };
  }
}

type PayPalHostedButtonProps = {
  clientId: string;
  hostedButtonId: string;
  className?: string;
};

export function PayPalHostedButton({
  clientId,
  hostedButtonId,
  className = "",
}: PayPalHostedButtonProps) {
  const containerId = useId().replace(/:/g, "");
  const [sdkReady, setSdkReady] = useState(false);
  const renderedRef = useRef(false);

  const sdkUrl = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&components=hosted-buttons&disable-funding=venmo&currency=USD`;

  useEffect(() => {
    if (!sdkReady || !window.paypal || renderedRef.current) {
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    container.innerHTML = "";
    renderedRef.current = true;

    void window.paypal
      .HostedButtons({ hostedButtonId })
      .render(`#${containerId}`)
      .catch(() => {
        renderedRef.current = false;
      });
  }, [sdkReady, hostedButtonId, containerId]);

  return (
    <div className={className}>
      <Script
        src={sdkUrl}
        strategy="afterInteractive"
        onLoad={() => setSdkReady(true)}
      />
      <div id={containerId} className="min-h-[45px]" />
    </div>
  );
}
