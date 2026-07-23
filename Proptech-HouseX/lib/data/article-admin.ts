import { prisma } from "@/lib/prisma";
import type { ArticleAdminSaveInput } from "@/lib/validation/article-admin";
import { articlePath } from "@/lib/content/article-routes";
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

function notifyArticleIfPublished(slug: string, status: string) {
  if (status !== "PUBLISHED") return;
  notifyIndexNowUrls([`${getSiteUrl()}${articlePath(slug)}`]);
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
  notifyArticleIfPublished(created.slug, created.status);
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
  notifyArticleIfPublished(updated.slug, updated.status);
  return updated;
}

export async function deleteArticleFromAdmin(id: string) {
  return prisma.article.delete({ where: { id } });
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
