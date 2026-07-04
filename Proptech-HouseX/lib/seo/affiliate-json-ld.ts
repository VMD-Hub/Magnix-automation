import type { AffiliateFaq, AffiliateService, AffiliateVertical } from "@/lib/content/affiliate-verticals";
import { showcasePagePath } from "@/lib/content/affiliate-verticals";
import type { InteriorCaseStudy } from "@/lib/content/noi-that-content";
import { caseStudyPagePath, NHA_DEP_PATH } from "@/lib/content/noi-that-content";
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
  pageUrl?: string,
) {
  const url =
    pageUrl ??
    (vertical.id === "noi-that"
      ? `${BASE}${showcasePagePath(vertical.path, service.slug)}`
      : `${BASE}${vertical.path}/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    description: service.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      name: getBrandName(),
      url: BASE,
    },
    areaServed: {
      "@type": "City",
      name: "Ho Chi Minh City",
    },
    serviceType: vertical.title,
  };
}

export function buildCaseStudyJsonLd(study: InteriorCaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.h1,
    description: study.metaDescription,
    url: `${BASE}${caseStudyPagePath(study.slug)}`,
    about: study.district,
    creator: {
      "@type": "Organization",
      name: getBrandName(),
      url: BASE,
    },
  };
}

export function buildVerticalCollectionJsonLd(vertical: AffiliateVertical) {
  const serviceParts = vertical.services.map((s) => ({
    "@type": "WebPage",
    name: s.title,
    url: `${BASE}${vertical.path}/${s.slug}`,
  }));
  const showcaseParts =
    vertical.showcases?.map((s) => ({
      "@type": "WebPage",
      name: s.title,
      url: `${BASE}${showcasePagePath(vertical.path, s.slug)}`,
    })) ?? [];

  const extraParts =
    vertical.id === "noi-that"
      ? [{ "@type": "WebPage", name: "Nhà đẹp", url: `${BASE}${NHA_DEP_PATH}` }]
      : [];

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: vertical.h1,
    description: vertical.metaDescription,
    url: `${BASE}${vertical.path}`,
    hasPart: [...serviceParts, ...showcaseParts, ...extraParts],
  };
}
