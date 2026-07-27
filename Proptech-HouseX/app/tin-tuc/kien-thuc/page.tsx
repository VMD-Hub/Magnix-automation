import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import { listPublishedArticles } from "@/lib/data/article-public";
import {
  NEWS_HUB_PATH,
  NEWS_HUB_TITLE,
  RE_KNOWLEDGE_INTRO,
  RE_KNOWLEDGE_PATH,
  RE_KNOWLEDGE_SEO_DESCRIPTION,
  RE_KNOWLEDGE_SEO_TITLE,
  RE_KNOWLEDGE_TITLE,
  topicPath,
} from "@/lib/content/article-routes";
import { GENERAL_RE_KNOWLEDGE_CLUSTERS } from "@/lib/content/articles/noxh-handbook-tags";
import { getSiteUrl } from "@/lib/site-config";
import { withOpenGraph } from "@/lib/seo/open-graph";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const canonical = `${getSiteUrl()}${RE_KNOWLEDGE_PATH}`;
  return {
    title: RE_KNOWLEDGE_SEO_TITLE,
    description: RE_KNOWLEDGE_SEO_DESCRIPTION,
    alternates: { canonical },
    openGraph: withOpenGraph({
      title: RE_KNOWLEDGE_SEO_TITLE,
      description: RE_KNOWLEDGE_SEO_DESCRIPTION,
      url: canonical,
    }),
  };
}

export default async function ReKnowledgeHubPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const { items, total } = await listPublishedArticles({
    page,
    pageSize: 12,
    knowledgeOnly: true,
    handbookOnly: false,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
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
            <span className="text-slate-800">{RE_KNOWLEDGE_TITLE}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {RE_KNOWLEDGE_TITLE}
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
            {RE_KNOWLEDGE_INTRO}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 container-px">
        <section className="mb-10" aria-label="Chủ đề kiến thức bất động sản">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GENERAL_RE_KNOWLEDGE_CLUSTERS.slice(0, 6).map((cluster) => (
              <Link
                key={cluster.slug}
                href={topicPath(cluster.slug)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md"
              >
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-800">
                  {cluster.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {cluster.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-700">
                  Xem bài viết →
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {GENERAL_RE_KNOWLEDGE_CLUSTERS.slice(6).map((cluster) => (
              <Link
                key={cluster.slug}
                href={topicPath(cluster.slug)}
                className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-brand-700"
              >
                {cluster.name}
              </Link>
            ))}
          </div>
        </section>

        {items.length === 0 ? (
          <p className="text-slate-600">Chưa có bài viết trong chuyên mục này.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? RE_KNOWLEDGE_PATH : `${RE_KNOWLEDGE_PATH}?page=${p}`}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  p === page
                    ? "bg-brand-700 text-white"
                    : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
