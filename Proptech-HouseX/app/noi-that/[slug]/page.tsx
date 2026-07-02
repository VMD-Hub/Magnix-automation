import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getShowcase, getVertical } from "@/lib/content/affiliate-verticals";
import { ShowcaseArticlePage } from "@/components/affiliate/showcase-article-page";

const VERTICAL_ID = "noi-that" as const;

type Props = { params: Promise<{ slug: string }> };

const LEGACY_REDIRECTS: Record<string, string> = {
  "thiet-ke-noi-that": "/noi-that/phong-cach-hien-dai",
  "thi-cong-noi-that": "/noi-that/can-ho-dep-y-tuong",
};

export function generateStaticParams() {
  const v = getVertical(VERTICAL_ID);
  return (v.showcases ?? []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getShowcase(VERTICAL_ID, slug);
  if (!article) return { title: "Không tìm thấy" };
  const vertical = getVertical(VERTICAL_ID);
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: `${vertical.path}/${slug}` },
  };
}

export default async function NoiThatShowcasePage({ params }: Props) {
  const { slug } = await params;
  const legacy = LEGACY_REDIRECTS[slug];
  if (legacy) redirect(legacy);

  const vertical = getVertical(VERTICAL_ID);
  const article = getShowcase(VERTICAL_ID, slug);
  if (!article) notFound();

  return <ShowcaseArticlePage vertical={vertical} article={article} />;
}
