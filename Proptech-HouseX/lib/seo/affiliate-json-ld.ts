import type { AffiliateFaq, AffiliateService, AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { getSiteUrl, getBrandName } from "@/lib/site-config";

const BASE = getSiteUrl();

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  };
}

export function buildFaqJsonLd(faqs: AffiliateFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function buildServiceJsonLd(
  vertical: AffiliateVertical,
  service: AffiliateService,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    description: service.metaDescription,
    url: `${BASE}${vertical.path}/${service.slug}`,
    provider: {
      "@type": "Organization",
      name: getBrandName(),
      url: BASE,
    },
    areaServed: { "@type": "Country", name: "Vietnam" },
    serviceType: vertical.title,
  };
}

export function buildVerticalCollectionJsonLd(vertical: AffiliateVertical) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: vertical.h1,
    description: vertical.metaDescription,
    url: `${BASE}${vertical.path}`,
    hasPart: vertical.services.map((s) => ({
      "@type": "WebPage",
      name: s.title,
      url: `${BASE}${vertical.path}/${s.slug}`,
    })),
  };
}
