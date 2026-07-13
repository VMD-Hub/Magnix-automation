import {
  getVuNguyenProfile,
  getVuNguyenProfileUrl,
  VU_NGUYEN_PROFILE_PATH,
} from "@/lib/personal-brand/vu-nguyen/profile-content";
import { getBrandName, getSiteUrl } from "@/lib/site-config";

export function buildVuNguyenPersonJsonLd() {
  const p = getVuNguyenProfile();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.jobTitle,
    description: p.tagline,
    knowsAbout: [...p.knowsAbout],
    url: getVuNguyenProfileUrl(),
    email: p.contact.email,
    telephone: p.contact.phoneTel,
    worksFor: {
      "@type": "Organization",
      name: getBrandName(),
      url: getSiteUrl(),
    },
  };
}

export function buildVuNguyenBreadcrumbJsonLd() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: base,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: getVuNguyenProfile().name,
        item: `${base}${VU_NGUYEN_PROFILE_PATH}`,
      },
    ],
  };
}
