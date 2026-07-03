import type { EditorialExpert } from "@/lib/content/editorial-trust";
import { expertProfilePath } from "@/lib/content/editorial-trust";
import { getBrandName, getSiteUrl } from "@/lib/site-config";

const BASE = getSiteUrl();

export function buildPersonJsonLd(expert: EditorialExpert) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.name,
    jobTitle: expert.jobTitle,
    knowsAbout: expert.knowsAbout,
    url: `${BASE}${expertProfilePath(expert.slug)}`,
    worksFor: {
      "@type": "Organization",
      name: getBrandName(),
      url: BASE,
    },
  };
}
