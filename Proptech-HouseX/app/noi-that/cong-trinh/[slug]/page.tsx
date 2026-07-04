import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVertical } from "@/lib/content/affiliate-verticals";
import {
  INTERIOR_CASE_STUDIES,
  caseStudyPagePath,
  getCaseStudy,
} from "@/lib/content/noi-that-content";
import { InteriorCaseStudyPage } from "@/components/affiliate/interior-case-study-page";

const VERTICAL_ID = "noi-that" as const;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INTERIOR_CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Không tìm thấy" };
  return {
    title: `${study.title} | House X`,
    description: study.metaDescription,
    alternates: { canonical: caseStudyPagePath(slug) },
  };
}

export default async function CongTrinhPage({ params }: Props) {
  const { slug } = await params;
  const vertical = getVertical(VERTICAL_ID);
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return <InteriorCaseStudyPage vertical={vertical} study={study} />;
}
