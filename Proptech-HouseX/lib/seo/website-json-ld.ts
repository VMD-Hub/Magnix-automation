import { getSiteUrl, getBrandName } from "@/lib/site-config";

/** WebSite + SearchAction — trang chủ portal BĐS (Sitelinks search box). */
export function buildWebSiteJsonLd() {
  const base = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: getBrandName(),
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/mua-ban?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}
