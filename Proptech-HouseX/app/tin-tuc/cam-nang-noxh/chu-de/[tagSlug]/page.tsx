import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import {
  getPublishedTagBySlug,
  listPublishedArticles,
} from "@/lib/data/article-public";
import { EditorialTrustPanel } from "@/components/content/editorial-trust-panel";
import { getNoxhEditorialTrust } from "@/lib/content/editorial-trust";
import { NOXH_ELIGIBILITY_FAQ } from "@/lib/content/noxh-eligibility-faq";
import {
  NEWS_HUB_PATH,
  NEWS_HUB_TITLE,
  topicPath,
} from "@/lib/content/article-routes";
import {
  NOXH_CATALOG_FAQ_HEADING,
  NOXH_HANDBOOK_INTRO,
  NOXH_HANDBOOK_PATH,
  NOXH_HANDBOOK_TITLE,
  NOXH_TOPIC_HUB_INTRO,
  NOXH_TOPIC_PILLAR_LINKS,
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
  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) return { title: "Không tìm thấy chủ đề" };

  const title = `${tag.name} — ${NOXH_HANDBOOK_TITLE}`;
  const description =
    tagSlug === "noxh"
      ? NOXH_TOPIC_HUB_INTRO
      : tag.description ??
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

  const tag = await getPublishedTagBySlug(tagSlug);
  if (!tag) notFound();

  const { items, total } = await listPublishedArticles({
    tagSlug,
    page,
    pageSize: 12,
  });

  const totalPages = Math.max(1, Math.ceil(total / 12));
  const isNoxhHub = tagSlug === "noxh" && page === 1;
  const noxhTrust = isNoxhHub ? getNoxhEditorialTrust() : null;
  const topicBase = topicPath(tagSlug);

  return (
    <div className="bg-slate-50">
      {isNoxhHub ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildRichFaqJsonLd(NOXH_ELIGIBILITY_FAQ)),
          }}
        />
      ) : null}
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
          <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
            {isNoxhHub ? NOXH_TOPIC_HUB_INTRO : tag.description}
          </p>
          <p className="mt-2 text-sm text-slate-500">{total} bài viết</p>
          {isNoxhHub ? (
            <nav
              aria-label="Bài nền tảng NOXH"
              className="mt-6 flex flex-wrap gap-2"
            >
              {NOXH_TOPIC_PILLAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
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

        {isNoxhHub ? (
          <>
            <ToolsFaqSection
              className="mt-14 max-w-4xl"
              heading={NOXH_CATALOG_FAQ_HEADING}
              items={NOXH_ELIGIBILITY_FAQ}
            />
            {noxhTrust ? (
              <EditorialTrustPanel
                className="max-w-4xl"
                updatedAt={noxhTrust.updatedAt}
                sources={noxhTrust.sources}
                expert={noxhTrust.expert}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
