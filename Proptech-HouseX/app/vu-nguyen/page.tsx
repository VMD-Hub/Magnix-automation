import type { Metadata } from "next";
import { VuNguyenProfile } from "@/components/personal-brand/vu-nguyen/vu-nguyen-profile";
import {
  getVuNguyenProfile,
  getVuNguyenProfileUrl,
} from "@/lib/personal-brand/vu-nguyen/profile-content";
import {
  buildVuNguyenBreadcrumbJsonLd,
  buildVuNguyenPersonJsonLd,
} from "@/lib/personal-brand/vu-nguyen/person-json-ld";

export function generateMetadata(): Metadata {
  const { seo } = getVuNguyenProfile();
  return {
    title: seo.title,
    description: seo.description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: getVuNguyenProfileUrl(),
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: getVuNguyenProfileUrl(),
      type: "profile",
    },
  };
}

export default function VuNguyenProfilePage() {
  const personLd = buildVuNguyenPersonJsonLd();
  const breadcrumbLd = buildVuNguyenBreadcrumbJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <VuNguyenProfile />
    </>
  );
}
