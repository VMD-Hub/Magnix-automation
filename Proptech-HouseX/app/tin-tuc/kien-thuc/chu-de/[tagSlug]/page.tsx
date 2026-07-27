import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import {
  getPublishedTagBySlug,
  listPublishedArticles,
} from "@/lib/data/article-public";
import {
  GENERAL_RE_TAG_SLUGS,
  LEGACY_NOXH_TOPIC_REDIRECTS,
  NOXH_HANDBOOK_TAG_SLUGS,
} from "@/lib/content/articles/noxh-handbook-tags";
import {
  NEWS_HUB_PATH,
  NEWS_HUB_TITLE,
  RE_KNOWLEDGE_PATH,
  RE_KNOWLEDGE_TITLE,
  topicPath,
} from "@/lib/content/article-routes";
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
  if (legacy) return { title: RE_KNOWLEDGE_TITLE };

  if (NOXH_HANDBOOK_TAG_SLUGS.has(tagSlug)) {
    return { title: RE_KNOWLEDGE_TITLE };
  }

  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) return { title: "Không tìm thấy chủ đề" };

  const title = `${tag.name} — ${RE_KNOWLEDGE_TITLE}`;
  const description =
    tag.description ??
    `Bài viết về ${tag.name.toLowerCase()} — ${RE_KNOWLEDGE_TITLE} HouseX.`;

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

export default async function ReKnowledgeTopicPage({
  params,
  searchParams,
}: PageProps) {
  const { tagSlug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const legacy = LEGACY_NOXH_TOPIC_REDIRECTS[tagSlug];
  if (legacy) permanentRedirect(legacy);

  if (NOXH_HANDBOOK_TAG_SLUGS.has(tagSlug)) {
    permanentRedirect(`/wiki-nha-o-xa-hoi/chu-de/${tagSlug}`);
  }
  if (!GENERAL_RE_TAG_SLUGS.has(tagSlug)) notFound();

  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) notFound();

  const { items, total } = await listPublishedArticles({
    tagSlug,
    page,
    pageSize: 12,
    knowledgeOnly: true,
    handbookOnly: false,
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
            <Link href={RE_KNOWLEDGE_PATH} className="hover:text-brand-700">
              {RE_KNOWLEDGE_TITLE}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? topicBase : `${topicBase}?page=${p}`}
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
