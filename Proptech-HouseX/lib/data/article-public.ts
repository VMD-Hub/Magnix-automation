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

/** Lấy toàn bộ catalog demo để merge với DB (bài editorial chưa seed). */
const DEMO_CATALOG_PAGE_SIZE = 200;

function sortArticleCards(items: ArticleCardData[]): ArticleCardData[] {
  return [...items].sort(
    (a, b) =>
      (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
  );
}

function paginateArticleCards(
  items: ArticleCardData[],
  page: number,
  pageSize: number,
): { items: ArticleCardData[]; total: number } {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total };
}

/** DB ưu tiên cùng slug; demo bổ sung bài chưa có trên Postgres. */
function mergeArticleCards(
  dbItems: ArticleCardData[],
  demoItems: ArticleCardData[],
): ArticleCardData[] {
  const bySlug = new Map(demoItems.map((a) => [a.slug, a]));
  for (const a of dbItems) bySlug.set(a.slug, a);
  return sortArticleCards([...bySlug.values()]);
}

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

    const [rows, demoAll] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleCardInclude,
        orderBy: { publishedAt: "desc" },
      }),
      Promise.resolve(
        listDemoArticleCards({
          ...params,
          page: 1,
          pageSize: DEMO_CATALOG_PAGE_SIZE,
        }),
      ),
    ]);

    const merged = mergeArticleCards(
      rows.map(mapToCard),
      demoAll.items,
    );
    if (merged.length > 0) {
      const paged = paginateArticleCards(merged, page, pageSize);
      return {
        ...paged,
        source: rows.length > 0 ? "db" : "demo",
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
    });
    const demoItems = getDemoArticlesForProject(
      projectSlug,
      DEMO_CATALOG_PAGE_SIZE,
    );
    const merged = mergeArticleCards(rows.map(mapToCard), demoItems);
    if (merged.length > 0) {
      return orderProjectRelatedArticles(projectSlug, merged, limit);
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
  const tags = await listPublishedTags();
  const found = tags.find((t) => t.slug === slug);
  if (found) return found;
  return getDemoTagBySlug(slug);
}

export async function listPublishedTags(): Promise<ArticleTagSummary[]> {
  try {
    const [rows, demoAll] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: articleCardInclude,
      }),
      Promise.resolve(
        listDemoArticleCards({ page: 1, pageSize: DEMO_CATALOG_PAGE_SIZE }),
      ),
    ]);
    const merged = mergeArticleCards(
      rows.map(mapToCard),
      demoAll.items,
    );
    if (merged.length === 0) return listDemoTags();

    const demoTagMeta = new Map(listDemoTags().map((t) => [t.slug, t]));
    const counts = new Map<string, ArticleTagSummary>();

    for (const article of merged) {
      for (const tag of article.tags) {
        const existing = counts.get(tag.slug);
        if (existing) {
          existing.articleCount += 1;
          continue;
        }
        const meta = demoTagMeta.get(tag.slug);
        counts.set(tag.slug, {
          slug: tag.slug,
          name: tag.name,
          description: meta?.description ?? null,
          articleCount: 1,
        });
      }
    }

    return [...counts.values()]
      .filter((t) => t.articleCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } catch {
    return listDemoTags();
  }
}
