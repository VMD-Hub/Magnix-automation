import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, ArticleTagList } from "@/components/articles/article-body";
import { ArticleCard } from "@/components/articles/article-card";
import {
  getPublishedArticleBySlug,
  listPublishedArticles,
} from "@/lib/data/article-public";
import { buildArticleJsonLd } from "@/lib/seo/article-json-ld";
import { buildBreadcrumbJsonLd } from "@/lib/seo/affiliate-json-ld";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedArticleBySlug(slug);
  if (!result) return { title: "Không tìm thấy bài viết" };

  const { article } = result;
  const title = article.seoTitle ?? article.title;
  const description =
    article.seoDesc ?? article.excerpt ?? article.title.slice(0, 160);
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/tin-tuc/${article.slug}`;

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
      images: article.coverImageUrl
        ? [{ url: article.coverImageUrl }]
        : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublishedArticleBySlug(slug);
  if (!result) notFound();

  const { article } = result;

  const related = await listPublishedArticles({
    tagSlug: article.tags[0]?.slug,
    pageSize: 4,
  });
  const relatedItems = related.items.filter((a) => a.slug !== article.slug).slice(0, 3);

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: "Tin tức", path: "/tin-tuc" },
    { name: article.title, path: `/tin-tuc/${article.slug}` },
  ]);
  const jsonLd = buildArticleJsonLd(article);

  const publishedLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

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
        {article.coverImageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="mx-auto max-w-3xl px-4 py-10 container-px">
          <nav className="text-sm text-slate-500">
            <Link href="/tin-tuc" className="hover:text-brand-700">
              Tin tức
            </Link>
            <span className="mx-2">/</span>
            <span className="line-clamp-1 text-slate-800">{article.title}</span>
          </nav>

          <ArticleTagList tags={article.tags} className="mt-4" />

          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {publishedLabel}
            {article.authorName ? ` · ${article.authorName}` : ""}
          </p>

          {article.excerpt && (
            <p className="mt-6 text-lg font-medium text-slate-700">
              {article.excerpt}
            </p>
          )}

          <div className="mt-8">
            <ArticleBody body={article.body} />
          </div>

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
