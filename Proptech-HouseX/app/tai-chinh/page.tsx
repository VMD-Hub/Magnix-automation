import type { Metadata } from "next";
import { getVertical } from "@/lib/content/affiliate-verticals";
import { ServiceVerticalLanding } from "@/components/affiliate/service-vertical-landing";
import { withOpenGraph } from "@/lib/seo/open-graph";

const vertical = getVertical("tai-chinh");

export const metadata: Metadata = {
  title: vertical.title,
  description: vertical.metaDescription,
  alternates: { canonical: vertical.path },
  openGraph: withOpenGraph({
    title: vertical.title,
    description: vertical.metaDescription,
    url: vertical.path,
  }),
};

export default function TaiChinhPage() {
  return <ServiceVerticalLanding vertical={vertical} />;
}
