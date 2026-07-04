import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShowcase, getVertical, showcasePagePath } from "@/lib/content/affiliate-verticals";
import { INTERIOR_STYLE_SLUGS } from "@/lib/content/noi-that-content";
import { ShowcaseArticlePage } from "@/components/affiliate/showcase-article-page";

const VERTICAL_ID = "noi-that" as const;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INTERIOR_STYLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getShowcase(VERTICAL_ID, slug);
  if (!article) return { title: "Không tìm thấy" };
  const vertical = getVertical(VERTICAL_ID);
  const canonical = showcasePagePath(vertical.path, slug);
  return {
    title: `${article.title} | House X`,
    description: article.metaDescription,
    alternates: { canonical },
  };
}

export default async function PhongCachPage({ params }: Props) {
  const { slug } = await params;
  const vertical = getVertical(VERTICAL_ID);
  const article = getShowcase(VERTICAL_ID, slug);
  if (!article) notFound();

  return <ShowcaseArticlePage vertical={vertical} article={article} />;
}
