import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import {
  getPublishedTagBySlug,
  listPublishedArticles,
} from "@/lib/data/article-public";
import { getSiteUrl } from "@/lib/site-config";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ tagSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tagSlug } = await params;
  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) return { title: "Không tìm thấy chủ đề" };

  const title = `${tag.name} — Tin tức & kiến thức`;
  const description =
    tag.description ??
    `Bài viết về ${tag.name.toLowerCase()} — HouseX tin tức bất động sản.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${getSiteUrl()}/tin-tuc/chu-de/${tagSlug}`,
    },
    ...(tag.articleCount < 3
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function TopicHubPage({ params, searchParams }: PageProps) {
  const { tagSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) notFound();

  const { items, total } = await listPublishedArticles({
    tagSlug,
    page,
    pageSize: 12,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 container-px">
          <nav className="text-sm text-slate-500">
            <Link href="/tin-tuc" className="hover:text-brand-700">
              Tin tức
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{tag.name}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            {tag.name}
          </h1>
          {tag.description && (
            <p className="mt-3 max-w-2xl text-slate-600">{tag.description}</p>
          )}
          <p className="mt-2 text-sm text-slate-500">{total} bài viết</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 container-px">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/tin-tuc/chu-de/${tagSlug}?page=${page - 1}`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                ← Trước
              </Link>
            )}
            <span className="flex items-center px-3 text-sm text-slate-600">
              Trang {page}/{totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/tin-tuc/chu-de/${tagSlug}?page=${page + 1}`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm"
              >
                Sau →
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
