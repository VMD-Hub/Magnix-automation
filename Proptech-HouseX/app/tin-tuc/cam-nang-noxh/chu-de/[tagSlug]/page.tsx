import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import {
  getPublishedTagBySlug,
  listPublishedArticles,
} from "@/lib/data/article-public";
import {
  LEGACY_NOXH_TOPIC_REDIRECTS,
  NOXH_HANDBOOK_TAG_SLUGS,
} from "@/lib/content/articles/noxh-handbook-tags";
import {
  NEWS_HUB_PATH,
  NEWS_HUB_TITLE,
  topicPath,
} from "@/lib/content/article-routes";
import {
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_TITLE,
} from "@/lib/content/messaging/noxh-public";
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
  const legacy = LEGACY_NOXH_TOPIC_REDIRECTS[tagSlug];
  if (legacy) return { title: NOXH_HANDBOOK_TITLE };

  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) return { title: "Không tìm thấy chủ đề" };

  const title = `${tag.name} — ${NOXH_HANDBOOK_TITLE}`;
  const description =
    tag.description ??
    `Bài viết về ${tag.name.toLowerCase()} — ${NOXH_HANDBOOK_TITLE} HouseX.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${getSiteUrl()}${topicPath(tagSlug)}`,
    },
    ...(tag.articleCount < 3
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function NoxhTopicHubPage({ params, searchParams }: PageProps) {
  const { tagSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const legacy = LEGACY_NOXH_TOPIC_REDIRECTS[tagSlug];
  if (legacy) redirect(legacy);

  if (!NOXH_HANDBOOK_TAG_SLUGS.has(tagSlug)) notFound();

  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) notFound();

  const { items, total } = await listPublishedArticles({
    tagSlug,
    page,
    pageSize: 12,
    handbookOnly: true,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));
  const topicBase = topicPath(tagSlug);

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 container-px">
          <nav className="text-sm text-slate-500">
            <Link href={NEWS_HUB_PATH} className="hover:text-brand-700">
              {NEWS_HUB_TITLE}
            </Link>
            <span className="mx-2">/</span>
            <Link href={NOXH_HANDBOOK_PATH} className="hover:text-brand-700">
              {NOXH_HANDBOOK_TITLE}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{tag.name}</span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            {tag.name}
          </h1>
          {tag.description ? (
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
              {tag.description}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-slate-500">{total} bài viết</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 container-px">
        {items.length === 0 ? (
          <p className="text-slate-600">Chưa có bài viết trong chủ đề này.</p>
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
                href={`${topicBase}?page=${page - 1}`}
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
                href={`${topicBase}?page=${page + 1}`}
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
