import type { Metadata } from "next";
import { getVertical } from "@/lib/content/affiliate-verticals";
import { InteriorServiceLanding } from "@/components/affiliate/interior-service-landing";

const vertical = getVertical("noi-that");

export const metadata: Metadata = {
  title: vertical.title,
  description: vertical.metaDescription,
  alternates: { canonical: vertical.path },
};

export default function NoiThatPage() {
  return <InteriorServiceLanding vertical={vertical} />;
}
