/**
 * Helper seed catalog demo → content_queue (+ Article CMS khi bài đã live trên web).
 */
import type { PrismaClient } from "@prisma/client";
import { upsertArticleTag } from "../../lib/data/article-admin";
import { resolveCanonicalArticleTag } from "../../lib/content/articles/noxh-handbook-tags";

export type CatalogSeedArticle = {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  tags: readonly { slug: string; name: string }[];
  seoTitle?: string | null;
  seoDesc?: string | null;
  authorName?: string | null;
  coverImageUrl?: string | null;
};

export type CatalogQueueShared = {
  title: string;
  painPoint: string | null;
  bodyPreview: string;
  segment: string;
  score: number;
  publishChannel: "WEBSITE";
  ctaToolId: string;
  ctaLabel: string;
  ctaHref: string;
  opsNotes: string;
};

async function ensureTags(
  prisma: PrismaClient,
  tags: readonly { slug: string; name: string }[],
) {
  for (const t of tags) {
    const canonical = resolveCanonicalArticleTag(t.slug);
    await upsertArticleTag({
      slug: canonical?.slug ?? t.slug,
      name: canonical?.name ?? t.name,
    });
  }
}

/** Tạo/cập nhật Article CMS PUBLISHED từ catalog nếu chưa có hoặc còn DRAFT. */
export async function ensurePublishedCatalogArticle(
  prisma: PrismaClient,
  article: CatalogSeedArticle,
): Promise<{ id: string; created: boolean }> {
  await ensureTags(prisma, article.tags);

  const existing = await prisma.article.findUnique({
    where: { slug: article.slug },
    select: { id: true, status: true },
  });

  if (existing?.status === "PUBLISHED") {
    return { id: existing.id, created: false };
  }

  if (existing) {
    const row = await prisma.article.update({
      where: { id: existing.id },
      data: {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        status: "PUBLISHED",
        publishedAt: new Date(),
        seoTitle: article.seoTitle ?? article.title.slice(0, 200),
        seoDesc: article.seoDesc ?? article.excerpt?.slice(0, 320) ?? null,
        authorName: article.authorName ?? "Ban biên tập House X",
        coverImageUrl: article.coverImageUrl ?? undefined,
      },
      select: { id: true },
    });
    await linkArticleTags(prisma, row.id, article.tags);
    return { id: row.id, created: false };
  }

  const row = await prisma.article.create({
    data: {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      status: "PUBLISHED",
      publishedAt: new Date(),
      seoTitle: article.seoTitle ?? article.title.slice(0, 200),
      seoDesc: article.seoDesc ?? article.excerpt?.slice(0, 320) ?? null,
      authorName: article.authorName ?? "Ban biên tập House X",
      coverImageUrl: article.coverImageUrl ?? null,
    },
    select: { id: true },
  });
  await linkArticleTags(prisma, row.id, article.tags);
  return { id: row.id, created: true };
}

async function linkArticleTags(
  prisma: PrismaClient,
  articleId: string,
  tags: readonly { slug: string; name: string }[],
) {
  const slugs = tags.map((t) => resolveCanonicalArticleTag(t.slug)?.slug ?? t.slug);
  const rows = await prisma.articleTag.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  await prisma.articleTagLink.deleteMany({ where: { articleId } });
  for (const tag of rows) {
    await prisma.articleTagLink.create({
      data: { articleId, tagId: tag.id },
    });
  }
}

export async function upsertCatalogQueueItem(
  prisma: PrismaClient,
  opts: {
    key: string;
    article: CatalogSeedArticle;
    shared: CatalogQueueShared;
    /** true = đồng bộ Article CMS PUBLISHED + queue Đã đăng */
    syncLiveCms: boolean;
  },
): Promise<"created" | "updated" | "skipped"> {
  const existing = await prisma.contentQueueItem.findUnique({
    where: { normalizedKey: opts.key },
    select: { id: true, status: true, articleId: true },
  });

  if (existing?.status === "PUBLISHED") {
    return "skipped";
  }

  let articleId: string | null = existing?.articleId ?? null;
  if (opts.syncLiveCms) {
    const cms = await ensurePublishedCatalogArticle(prisma, opts.article);
    articleId = cms.id;
  } else {
    const hit = await prisma.article.findUnique({
      where: { slug: opts.article.slug },
      select: { id: true, status: true },
    });
    if (hit?.status === "PUBLISHED") articleId = hit.id;
  }

  const live = Boolean(articleId);
  const payload = {
    ...opts.shared,
    articleId,
    l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    ...(live
      ? { status: "PUBLISHED" as const, publishedAt: new Date(), rejectReason: null }
      : {}),
  };

  if (existing) {
    await prisma.contentQueueItem.update({
      where: { id: existing.id },
      data: payload,
    });
    return "updated";
  }

  await prisma.contentQueueItem.create({
    data: {
      normalizedKey: opts.key,
      status: live ? "PUBLISHED" : "INTAKE",
      publishedAt: live ? new Date() : null,
      ...opts.shared,
      articleId,
      l3Checklist: { pain: true, ctaTool: true, ctaCopy: true },
    },
  });
  return "created";
}
