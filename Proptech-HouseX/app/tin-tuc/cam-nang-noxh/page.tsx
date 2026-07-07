import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import {
  listPublishedArticles,
  listPublishedTags,
} from "@/lib/data/article-public";
import { topicPath } from "@/lib/content/article-routes";
import { buildNoxhHandbookHubJsonLd } from "@/lib/seo/article-json-ld";
import {
  NEWS_HUB_PATH,
  NEWS_HUB_TITLE,
} from "@/lib/content/article-routes";
import {
  NOXH_HANDBOOK_INTRO,
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_SEO_TITLE,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: NOXH_HANDBOOK_SEO_TITLE,
    description: NOXH_HANDBOOK_INTRO,
    alternates: {
      canonical: `${getSiteUrl()}${NOXH_HANDBOOK_PATH}`,
    },
  };
}

export default async function CamNangNoxhHubPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ items, total }, tags] = await Promise.all([
    listPublishedArticles({ page, pageSize: 12 }),
    listPublishedTags(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / 12));
  const jsonLd = buildNoxhHandbookHubJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10 container-px">
            <nav className="text-sm text-slate-500">
              <Link href="/" className="hover:text-brand-700">
                Trang chủ
              </Link>
              <span className="mx-2">/</span>
              <Link href={NEWS_HUB_PATH} className="hover:text-brand-700">
                {NEWS_HUB_TITLE}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-800">{NOXH_HANDBOOK_TITLE}</span>
            </nav>
            <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {NOXH_HANDBOOK_TITLE}
            </h1>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
              {NOXH_HANDBOOK_INTRO}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 container-px">
          {tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Link
                  key={t.slug}
                  href={topicPath(t.slug)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-brand-200 hover:text-brand-700"
                >
                  {t.name}
                  <span className="ml-1.5 text-slate-400">({t.articleCount})</span>
                </Link>
              ))}
            </div>
          )}

          {items.length === 0 ? (
            <p className="text-slate-600">Chưa có bài viết nào.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-10 flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`${NOXH_HANDBOOK_PATH}?page=${page - 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  ← Trước
                </Link>
              )}
              <span className="flex items-center px-3 text-sm text-slate-600">
                Trang {page}/{totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`${NOXH_HANDBOOK_PATH}?page=${page + 1}`}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Sau →
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
