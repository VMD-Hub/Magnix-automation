import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/articles/article-body";
import { ArticleHero } from "@/components/articles/article-hero";
import { ArticleCard } from "@/components/articles/article-card";
import {
  absoluteArticleImageUrl,
  applyEditorialMedia,
} from "@/lib/content/articles/article-editorial-media";
import {
  getPublishedArticleBySlug,
  listPublishedArticles,
} from "@/lib/data/article-public";
import { EditorialTrustPanel } from "@/components/content/editorial-trust-panel";
import {
  resolveExpertForTags,
  resolveSourcesForTags,
  formatEditorialDate,
} from "@/lib/content/editorial-trust";
import {
  NEWS_HUB_PATH,
  NEWS_HUB_TITLE,
  articlePath,
} from "@/lib/content/article-routes";
import { buildArticleJsonLd } from "@/lib/seo/article-json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/affiliate-json-ld";
import {
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
import { getSiteUrl } from "@/lib/site-config";
import {
  normalizeSeoDescription,
  normalizeSeoTitle,
} from "@/lib/seo/meta-text";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedArticleBySlug(slug);
  if (!result) return { title: "Không tìm thấy bài viết" };

  const { article: raw } = result;
  const article = applyEditorialMedia(raw);
  const siteUrl = getSiteUrl();
  const title = normalizeSeoTitle(article.seoTitle ?? article.title);
  const description = normalizeSeoDescription(
    article.seoDesc ?? article.excerpt ?? article.title.slice(0, 160),
  );
  const canonical = `${siteUrl}${articlePath(article.slug)}`;
  const ogImage = article.coverImageUrl
    ? absoluteArticleImageUrl(article.coverImageUrl, siteUrl)
    : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      images: ogImage ? [{ url: ogImage, alt: article.coverImageAlt ?? title }] : undefined,
    },
  };
}

export default async function NoxhArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublishedArticleBySlug(slug);
  if (!result) notFound();

  const { article: raw } = result;
  const article = applyEditorialMedia(raw);

  const related = await listPublishedArticles({
    tagSlug: article.tags[0]?.slug,
    pageSize: 4,
  });
  const relatedItems = related.items.filter((a) => a.slug !== article.slug).slice(0, 3);

  const tagSlugs = article.tags.map((t) => t.slug);
  const expert = resolveExpertForTags(tagSlugs);
  const sources = resolveSourcesForTags(tagSlugs);

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: NEWS_HUB_TITLE, path: NEWS_HUB_PATH },
    { name: NOXH_HANDBOOK_TITLE, path: NOXH_HANDBOOK_PATH },
    { name: article.title, path: articlePath(article.slug) },
  ]);
  const jsonLd = buildArticleJsonLd(article, { expert, sources });

  const publishedLabel = article.publishedAt
    ? formatEditorialDate(article.publishedAt)
    : null;
  const updatedLabel = formatEditorialDate(article.updatedAt);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-6 container-px">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-700">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link href={NEWS_HUB_PATH} className="hover:text-brand-700">
              {NEWS_HUB_TITLE}
            </Link>
            <span className="mx-2">/</span>
            <Link href={NOXH_HANDBOOK_PATH} className="hover:text-brand-700">
              {NOXH_HANDBOOK_TITLE}
            </Link>
          </nav>
        </div>

        <ArticleHero
          article={article}
          publishedLabel={publishedLabel}
          updatedLabel={updatedLabel}
          expert={expert}
        />

        <div className="mx-auto max-w-3xl px-4 py-10 container-px">
          <ArticleBody body={article.body} />

          <EditorialTrustPanel
            updatedAt={article.updatedAt}
            publishedAt={article.publishedAt}
            sources={sources}
            expert={expert}
          />

          {article.projects.length > 0 && (
            <div className="mt-10 rounded-xl border border-brand-100 bg-brand-50/50 p-5">
              <p className="text-sm font-semibold text-brand-900">Dự án liên quan</p>
              <ul className="mt-2 space-y-1">
                {article.projects.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/du-an/${p.slug}`}
                      className="text-sm font-medium text-brand-700 hover:underline"
                    >
                      {p.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedItems.length > 0 && (
            <section className="mt-12 border-t border-slate-200 pt-10">
              <h2 className="text-xl font-bold text-slate-900">Bài liên quan</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {relatedItems.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
