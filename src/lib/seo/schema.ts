import { BRAND } from "@/lib/brand/site";
import { LEGAL } from "@/lib/legal/site";
import type { HomeFaq } from "@/lib/seo/home-faqs";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: new URL("/brand/cliniqflow-logo.png", SITE_URL).toString(),
    description: BRAND.positioning,
    email: LEGAL.supportEmail,
    telephone: LEGAL.supportPhoneTel,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: LEGAL.supportPhoneTel,
      contactType: "customer support",
      email: LEGAL.supportEmail,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: BRAND.positioning,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: BRAND.positioning,
    offers: {
      "@type": "Offer",
      price: "399",
      priceCurrency: "USD",
      description: "Clinic intake and documentation workflow subscription plans",
    },
  };
}

export function faqPageSchema(faqs: HomeFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}
