import { prisma } from "@/lib/prisma";
import type { ArticleAdminSaveInput } from "@/lib/validation/article-admin";
import { canonicalArticlePath } from "@/lib/content/article-routes";
import { revalidatePublicArticleBySlug } from "@/lib/content/revalidate-public-article";
import { notifyIndexNowUrls } from "@/lib/seo/indexnow";
import { getSiteUrl } from "@/lib/site-config";

export async function listArticlesForAdmin() {
  return prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      tags: { include: { tag: true } },
      projects: {
        include: { project: { select: { id: true, name: true, slug: true } } },
      },
    },
  });
}

export async function listTagsForAdmin() {
  return prisma.articleTag.findMany({ orderBy: { name: "asc" } });
}

export async function getArticleForAdmin(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      projects: { include: { project: true } },
    },
  });
}

async function resolveTagIds(slugs: string[]) {
  if (slugs.length === 0) return [];
  const tags = await prisma.articleTag.findMany({
    where: { slug: { in: slugs } },
  });
  return tags.map((t) => t.id);
}

function normalizeOptionalUrl(v: string | null | undefined) {
  if (v == null || v === "") return null;
  return v;
}

function articleData(input: ArticleAdminSaveInput) {
  const publishedAt =
    input.status === "PUBLISHED"
      ? input.publishedAt
        ? new Date(input.publishedAt)
        : new Date()
      : input.publishedAt
        ? new Date(input.publishedAt)
        : null;

  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt ?? null,
    body: input.body,
    status: input.status,
    publishedAt,
    coverImageUrl: normalizeOptionalUrl(input.coverImageUrl),
    authorName: input.authorName ?? null,
    seoTitle: input.seoTitle ?? null,
    seoDesc: input.seoDesc ?? null,
  };
}

function notifyArticleIfPublished(
  slug: string,
  status: string,
  tagSlugs: string[] = [],
) {
  if (status !== "PUBLISHED") return;
  const path = canonicalArticlePath({
    slug,
    tags: tagSlugs.map((s) => ({ slug: s })),
  });
  notifyIndexNowUrls([`${getSiteUrl()}${path}`]);
}

export async function createArticleFromAdmin(input: ArticleAdminSaveInput) {
  const tagIds = await resolveTagIds(input.tagSlugs);

  const created = await prisma.article.create({
    data: {
      ...articleData(input),
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
      projects: {
        create: input.projectIds.map((projectId) => ({ projectId })),
      },
    },
    include: {
      tags: { include: { tag: true } },
      projects: { include: { project: true } },
    },
  });
  notifyArticleIfPublished(created.slug, created.status, input.tagSlugs);
  if (created.status === "PUBLISHED") {
    revalidatePublicArticleBySlug(created.slug);
  }
  return created;
}

export async function updateArticleFromAdmin(
  id: string,
  input: ArticleAdminSaveInput,
) {
  const tagIds = await resolveTagIds(input.tagSlugs);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.articleTagLink.deleteMany({ where: { articleId: id } });
    await tx.articleProject.deleteMany({ where: { articleId: id } });

    return tx.article.update({
      where: { id },
      data: {
        ...articleData(input),
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
        projects: {
          create: input.projectIds.map((projectId) => ({ projectId })),
        },
      },
      include: {
        tags: { include: { tag: true } },
        projects: { include: { project: true } },
      },
    });
  });
  notifyArticleIfPublished(updated.slug, updated.status, input.tagSlugs);
  revalidatePublicArticleBySlug(updated.slug);
  return updated;
}

export async function deleteArticleFromAdmin(id: string) {
  const row = await prisma.article.findUnique({ where: { id } });
  if (!row) throw new Error("NOT_FOUND");

  await prisma.article.delete({ where: { id } });

  // Giữ slug ARCHIVED để catalog demo không "sống lại" trên public / sitemap.
  return prisma.article.create({
    data: {
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: "Bài đã gỡ khỏi site bởi Super Admin — không phục hồi từ catalog demo.",
      status: "ARCHIVED",
      publishedAt: null,
      authorName: "House X",
      seoTitle: null,
      seoDesc: null,
    },
  });
}

/** Ẩn khỏi public + sitemap; chặn fallback demo cùng slug. */
export async function archiveArticleFromAdmin(id: string) {
  return prisma.article.update({
    where: { id },
    data: { status: "ARCHIVED", publishedAt: null },
  });
}

/**
 * Upsert bản ARCHIVED theo slug — dùng khi ẩn bài vẫn còn trên catalog demo
 * (chưa có hàng CMS) hoặc sau khi gỡ queue.
 */
export async function suppressPublicArticleBySlug(
  slug: string,
  title: string,
): Promise<{ id: string; slug: string; status: string }> {
  const existing = await prisma.article.findUnique({
    where: { slug },
    select: { id: true, slug: true, status: true },
  });
  if (existing) {
    if (existing.status === "ARCHIVED") return existing;
    return prisma.article.update({
      where: { id: existing.id },
      data: { status: "ARCHIVED", publishedAt: null },
      select: { id: true, slug: true, status: true },
    });
  }
  return prisma.article.create({
    data: {
      slug,
      title: title.slice(0, 240) || slug,
      body: "Bài đã ẩn khỏi site bởi Super Admin.",
      status: "ARCHIVED",
      authorName: "House X",
    },
    select: { id: true, slug: true, status: true },
  });
}

export async function upsertArticleTag(data: {
  slug: string;
  name: string;
  description?: string | null;
}) {
  return prisma.articleTag.upsert({
    where: { slug: data.slug },
    update: {
      name: data.name,
      description: data.description ?? null,
    },
    create: {
      slug: data.slug,
      name: data.name,
      description: data.description ?? null,
    },
  });
}

export async function listProjectsForArticlePicker() {
  return prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, slug: true, name: true, projectType: true },
  });
}
