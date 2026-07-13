import type { Metadata } from "next";
import { VuNguyenBrandStory } from "@/components/personal-brand/vu-nguyen/vu-nguyen-brand-story";
import { VU_NGUYEN_STORIES_LABEL } from "@/lib/personal-brand/vu-nguyen/profile-content";
import { VU_NGUYEN_PORTFOLIO_PATH } from "@/lib/personal-brand/vu-nguyen/nfc-mode";
import { getSiteUrl } from "@/lib/site-config";

export function generateMetadata(): Metadata {
  return {
    title: VU_NGUYEN_STORIES_LABEL,
    description:
      "DNA và định hướng House X — cổng Proptech minh bạch, đồng hành an cư.",
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${getSiteUrl()}${VU_NGUYEN_PORTFOLIO_PATH}`,
    },
  };
}

export default function VuNguyenBrandStoryPage() {
  return <VuNguyenBrandStory />;
}
