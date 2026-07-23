import { getSiteUrl, getBrandName, getSocialChannels, getSupportEmail } from "@/lib/site-config";

const BASE = getSiteUrl();

/** Organization site-wide — sameAs từ env mạng xã hội. */
export function buildOrganizationJsonLd() {
  const sameAs = getSocialChannels()
    .map((c) => c.href)
    .filter((href): href is string => Boolean(href));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: getBrandName(),
    url: BASE,
    email: getSupportEmail(),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    logo: `${BASE}/brand/housex-lockup-mark.png`,
  };
}
