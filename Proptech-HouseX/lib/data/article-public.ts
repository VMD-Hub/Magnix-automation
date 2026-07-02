import { prisma } from "@/lib/prisma";
import type {
  ArticleCardData,
  ArticleDetail,
  ArticleTagSummary,
} from "@/lib/data/article-types";
import {
  getDemoArticleBySlug,
  getDemoArticlesForProject,
  getDemoTagBySlug,
  listDemoArticleCards,
  listDemoTags,
} from "@/lib/preview/demo-articles";
import { applyEditorialMedia } from "@/lib/content/articles/article-editorial-media";
import { orderProjectRelatedArticles } from "@/lib/content/project-related-articles";

const articleCardInclude = {
  tags: { include: { tag: true } },
  projects: {
    include: { project: { select: { slug: true, name: true } } },
  },
} as const;

function mapToCard(row: {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  authorName: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  tags: { tag: { slug: string; name: string } }[];
  projects: { project: { slug: string; name: string } }[];
}): ArticleCardData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.coverImageUrl,
    authorName: row.authorName,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    tags: row.tags.map((t) => ({ slug: t.tag.slug, name: t.tag.name })),
    projects: row.projects.map((p) => ({
      slug: p.project.slug,
      name: p.project.name,
    })),
  };
}

function mapToDetail(row: Awaited<
  ReturnType<typeof fetchPublishedArticleFromDb>
>): ArticleDetail | null {
  if (!row) return null;
  return {
    ...mapToCard(row),
    body: row.body,
    seoTitle: row.seoTitle,
    seoDesc: row.seoDesc,
    status: row.status,
  };
}

async function fetchPublishedArticleFromDb(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: articleCardInclude,
  });
}

export async function listPublishedArticles(params: {
  page?: number;
  pageSize?: number;
  tagSlug?: string;
  projectSlug?: string;
} = {}): Promise<{ items: ArticleCardData[]; total: number; source: "db" | "demo" }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, params.pageSize ?? 12);

  try {
    const where = {
      status: "PUBLISHED" as const,
      ...(params.tagSlug
        ? { tags: { some: { tag: { slug: params.tagSlug } } } }
        : {}),
      ...(params.projectSlug
        ? { projects: { some: { project: { slug: params.projectSlug } } } }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        include: articleCardInclude,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    if (total > 0) {
      return {
        items: rows.map(mapToCard),
        total,
        source: "db",
      };
    }
  } catch {
    // Postgres offline — demo below.
  }

  const demo = listDemoArticleCards({ ...params, page, pageSize });
  return { ...demo, source: "demo" };
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<{ article: ArticleDetail; source: "db" | "demo" } | null> {
  try {
    const row = await fetchPublishedArticleFromDb(slug);
    const article = mapToDetail(row);
    if (article) return { article, source: "db" };
  } catch {
    // demo fallback
  }

  const demo = getDemoArticleBySlug(slug);
  if (!demo) return null;
  return { article: applyEditorialMedia(demo), source: "demo" };
}

export async function getArticlesForProjectSlug(
  projectSlug: string,
  limit = 6,
): Promise<ArticleCardData[]> {
  try {
    const rows = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        projects: { some: { project: { slug: projectSlug } } },
      },
      include: articleCardInclude,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    if (rows.length > 0) {
      return orderProjectRelatedArticles(
        projectSlug,
        rows.map(mapToCard),
        limit,
      );
    }
  } catch {
    // demo
  }
  return orderProjectRelatedArticles(
    projectSlug,
    getDemoArticlesForProject(projectSlug, limit),
    limit,
  );
}

export async function getPublishedTagBySlug(
  slug: string,
): Promise<ArticleTagSummary | null> {
  try {
    const tag = await prisma.articleTag.findUnique({ where: { slug } });
    if (tag) {
      const articleCount = await prisma.article.count({
        where: {
          status: "PUBLISHED",
          tags: { some: { tagId: tag.id } },
        },
      });
      return {
        slug: tag.slug,
        name: tag.name,
        description: tag.description,
        articleCount,
      };
    }
  } catch {
    // demo
  }
  return getDemoTagBySlug(slug);
}

export async function listPublishedTags(): Promise<ArticleTagSummary[]> {
  try {
    const tags = await prisma.articleTag.findMany({
      orderBy: { name: "asc" },
    });
    if (tags.length === 0) return listDemoTags();

    const counts = await Promise.all(
      tags.map(async (t) => ({
        ...t,
        articleCount: await prisma.article.count({
          where: {
            status: "PUBLISHED",
            tags: { some: { tagId: t.id } },
          },
        }),
      })),
    );
    return counts
      .filter((t) => t.articleCount > 0)
      .map((t) => ({
        slug: t.slug,
        name: t.name,
        description: t.description,
        articleCount: t.articleCount,
      }));
  } catch {
    return listDemoTags();
  }
}
