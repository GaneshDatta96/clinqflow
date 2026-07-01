import { EB_Garamond, Funnel_Display, Google_Sans } from "next/font/google";

/** UI sans — body, labels, buttons (Regular 400, Medium 500, Semi-Bold 600). */
export const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

/** Long-form serif — prose, citations, elegant emphasis (Regular + Italic). */
export const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Display headings — Bold / Extra-Bold for hierarchy (600–800). */
export const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

export const fontVariables = [
  googleSans.variable,
  ebGaramond.variable,
  funnelDisplay.variable,
].join(" ");
