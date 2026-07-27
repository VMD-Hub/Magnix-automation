import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { CtvCashflowInfographic } from "@/components/ctv/ctv-cashflow-infographic";
import { renderAffiliateServiceMarkdown } from "@/lib/content/affiliate-body-render";
import {
  CTV_AFFILIATE_ARTICLE_SLUGS,
  ctvAffiliateArticlePath,
  getCtvAffiliateArticle,
} from "@/lib/content/ctv-affiliate-articles";
import {
  CTV_AFFILIATE_CTAS,
  CTV_AFFILIATE_PATH,
  CTV_AFFILIATE_TITLE,
} from "@/lib/content/ctv-affiliate-landing";
import { buildBreadcrumbJsonLd } from "@/lib/seo/affiliate-json-ld";
import { withOpenGraph } from "@/lib/seo/open-graph";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 3600;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CTV_AFFILIATE_ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getCtvAffiliateArticle(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  const canonical = `${getSiteUrl()}${ctvAffiliateArticlePath(slug)}`;
  return {
    title: article.seoTitle,
    description: article.seoDesc,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: withOpenGraph({
      title: article.seoTitle,
      description: article.seoDesc,
      url: canonical,
    }),
  };
}

export default async function CtvAffiliateArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getCtvAffiliateArticle(slug);
  if (!article) notFound();

  const path = ctvAffiliateArticlePath(slug);
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: CTV_AFFILIATE_TITLE, path: CTV_AFFILIATE_PATH },
    { name: article.title, path },
  ]);
  const html = renderAffiliateServiceMarkdown(article.body);
  const showInfographic = slug === CTV_AFFILIATE_ARTICLE_SLUGS[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <article className="bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-10 container-px">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-brand-700">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link href={CTV_AFFILIATE_PATH} className="hover:text-brand-700">
                Cộng tác viên
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">Bài viết</span>
            </nav>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {article.excerpt}
            </p>
            <time
              dateTime={article.publishedAt}
              className="mt-3 block text-sm text-slate-500"
            >
              {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-10 container-px">
          {showInfographic ? <CtvCashflowInfographic /> : null}
          <div
            className="ctv-article-prose space-y-2 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:my-3 [&_p]:leading-relaxed [&_p]:text-slate-600"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-8 sm:flex-row sm:flex-wrap">
            <ButtonLink href={CTV_AFFILIATE_CTAS.primary.href} size="lg">
              {CTV_AFFILIATE_CTAS.primary.label}
            </ButtonLink>
            <ButtonLink
              href={CTV_AFFILIATE_PATH}
              variant="outline"
              size="lg"
            >
              Về hub cộng tác viên
            </ButtonLink>
          </div>
        </div>
      </article>
    </>
  );
}
