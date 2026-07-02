import type { Metadata } from "next";
import { getVertical } from "@/lib/content/affiliate-verticals";
import { ServiceVerticalLanding } from "@/components/affiliate/service-vertical-landing";

const vertical = getVertical("tai-chinh");

export const metadata: Metadata = {
  title: vertical.title,
  description: vertical.metaDescription,
  alternates: { canonical: vertical.path },
};

export default function TaiChinhPage() {
  return <ServiceVerticalLanding vertical={vertical} />;
}
