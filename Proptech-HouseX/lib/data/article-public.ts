import {
  isGeneralReKnowledgeArticle,
  isNoxhHandbookArticle,
  GENERAL_RE_TAG_SLUGS,
  NOXH_HANDBOOK_TAG_DESCRIPTIONS,
  NOXH_HANDBOOK_TAG_SLUGS,
  PHONG_THUY_ARTICLE_TAG,
} from "@/lib/content/articles/noxh-handbook-tags";
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
import { resolveLegacyArticleCanonicalSlug } from "@/lib/content/legacy-article-slug-redirects";
import { applyEditorialMedia } from "@/lib/content/articles/article-editorial-media";
import { stripSystemReaderForbiddenNotes } from "@/lib/content/content-queue-article";
import { orderProjectRelatedArticles } from "@/lib/content/project-related-articles";
import { prisma } from "@/lib/prisma";

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

/** DB PUBLISHED ưu tiên hơn demo cùng slug; demo chỉ bổ sung slug chưa có trong DB. */
function mergeArticleCards(
  dbItems: ArticleCardData[],
  demoItems: ArticleCardData[],
): ArticleCardData[] {
  const bySlug = new Map(dbItems.map((a) => [a.slug, a]));
  for (const a of demoItems) {
    if (!bySlug.has(a.slug)) bySlug.set(a.slug, a);
  }
  return sortArticleCards([...bySlug.values()]);
}

const QUEUE_SILO_KEY_RE = /^(?:wiki-noxh|kien-thuc|re-knowledge):(.+)$/;

/**
 * Slug không được phục hồi từ catalog demo:
 * - Article CMS tồn tại nhưng không PUBLISHED (Ẩn / Xóa stub / nháp)
 * - Queue wiki/kien-thuc ở REJECTED (Super Admin Ẩn / từ chối)
 *
 * INTAKE / PENDING_L3 / APPROVED: vẫn cho demo live tạm — Super Admin sửa rồi
 * Publish web để thay bản catalog. Tránh seed là mất cả silo trên web.
 */
async function listDemoBlockedSlugs(): Promise<Set<string>> {
  const [nonPublished, rejectedQueue] = await Promise.all([
    prisma.article.findMany({
      where: { status: { not: "PUBLISHED" } },
      select: { slug: true },
    }),
    prisma.contentQueueItem.findMany({
      where: {
        status: "REJECTED",
        OR: [
          { normalizedKey: { startsWith: "wiki-noxh:" } },
          { normalizedKey: { startsWith: "kien-thuc:" } },
          { normalizedKey: { startsWith: "re-knowledge:" } },
        ],
      },
      select: {
        normalizedKey: true,
        opsNotes: true,
        article: { select: { slug: true } },
      },
    }),
  ]);

  const blocked = new Set(nonPublished.map((r) => r.slug));

  for (const q of rejectedQueue) {
    const fromKey = q.normalizedKey.match(QUEUE_SILO_KEY_RE)?.[1]?.trim();
    const fromNotes = q.opsNotes?.match(/^slug:\s*(.+)$/m)?.[1]?.trim();
    const slug = fromKey || fromNotes || q.article?.slug;
    if (slug) blocked.add(slug);
  }

  return blocked;
}

async function isDemoBlockedSlug(slug: string): Promise<boolean> {
  const any = await prisma.article.findUnique({
    where: { slug },
    select: { status: true },
  });
  if (any && any.status !== "PUBLISHED") return true;

  const rejected = await prisma.contentQueueItem.findFirst({
    where: {
      status: "REJECTED",
      OR: [
        { normalizedKey: `wiki-noxh:${slug}` },
        { normalizedKey: `kien-thuc:${slug}` },
        { normalizedKey: `re-knowledge:${slug}` },
        { opsNotes: { contains: `slug: ${slug}` } },
      ],
    },
    select: { id: true },
  });
  return Boolean(rejected);
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
    body: stripSystemReaderForbiddenNotes(row.body),
    seoTitle: row.seoTitle,
    seoDesc: row.seoDesc
      ? stripSystemReaderForbiddenNotes(row.seoDesc)
      : row.seoDesc,
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
  /** Chỉ bài thuộc cẩm nang NOXH (loại bài phong thủy-only / kiến thức BĐS). */
  handbookOnly?: boolean;
  /** Chỉ bài kiến thức BĐS (BTR, hành lang, hạ tầng). */
  knowledgeOnly?: boolean;
} = {}): Promise<{ items: ArticleCardData[]; total: number; source: "db" | "demo" }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, params.pageSize ?? 12);
  const knowledgeOnly = params.knowledgeOnly === true;
  const handbookOnly =
    params.handbookOnly ??
    (!knowledgeOnly &&
      !params.projectSlug &&
      params.tagSlug !== PHONG_THUY_ARTICLE_TAG.slug &&
      !(params.tagSlug && GENERAL_RE_TAG_SLUGS.has(params.tagSlug)));

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

    const [rows, demoAll, blocked] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleCardInclude,
        orderBy: { publishedAt: "desc" },
      }),
      Promise.resolve(
        listDemoArticleCards({
          ...params,
          handbookOnly,
          knowledgeOnly,
          page: 1,
          pageSize: DEMO_CATALOG_PAGE_SIZE,
        }),
      ),
      listDemoBlockedSlugs(),
    ]);

    const demoVisible = demoAll.items.filter((a) => !blocked.has(a.slug));
    const merged = mergeArticleCards(rows.map(mapToCard), demoVisible);
    const scoped = knowledgeOnly
      ? merged.filter(isGeneralReKnowledgeArticle)
      : handbookOnly
        ? merged.filter(isNoxhHandbookArticle)
        : merged;
    if (scoped.length > 0) {
      const paged = paginateArticleCards(scoped, page, pageSize);
      return {
        ...paged,
        source: rows.length > 0 ? "db" : "demo",
      };
    }
  } catch {
    // Postgres offline — demo below.
  }

  const demo = listDemoArticleCards({
    ...params,
    handbookOnly,
    knowledgeOnly,
    page,
    pageSize,
  });
  return { ...demo, source: "demo" };
}

export async function getPublishedArticleBySlug(
  slug: string,
): Promise<{ article: ArticleDetail; source: "db" | "demo" } | null> {
  const canonicalSlug = resolveLegacyArticleCanonicalSlug(slug) ?? slug;
  try {
    const row = await fetchPublishedArticleFromDb(canonicalSlug);
    const article = mapToDetail(row);
    if (article) return { article, source: "db" };

    // Đã vào Super Admin / CMS nhưng chưa (hoặc không còn) PUBLISHED → không demo.
    if (await isDemoBlockedSlug(canonicalSlug)) {
      return null;
    }
  } catch {
    // fall through to demo
  }

  const demo = getDemoArticleBySlug(canonicalSlug);
  if (demo) {
    const cleaned = applyEditorialMedia(demo);
    return {
      article: {
        ...cleaned,
        body: stripSystemReaderForbiddenNotes(cleaned.body),
        excerpt: cleaned.excerpt
          ? stripSystemReaderForbiddenNotes(cleaned.excerpt)
          : cleaned.excerpt,
        seoDesc: cleaned.seoDesc
          ? stripSystemReaderForbiddenNotes(cleaned.seoDesc)
          : cleaned.seoDesc,
      },
      source: "demo",
    };
  }

  return null;
}

export async function getArticlesForProjectSlug(
  projectSlug: string,
  limit = 6,
): Promise<ArticleCardData[]> {
  try {
    const [rows, demoItems, blocked] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          projects: { some: { project: { slug: projectSlug } } },
        },
        include: articleCardInclude,
        orderBy: { publishedAt: "desc" },
      }),
      Promise.resolve(
        getDemoArticlesForProject(projectSlug, DEMO_CATALOG_PAGE_SIZE),
      ),
      listDemoBlockedSlugs(),
    ]);
    const demoVisible = demoItems.filter((a) => !blocked.has(a.slug));
    const merged = mergeArticleCards(rows.map(mapToCard), demoVisible);
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
    const [rows, demoAll, blocked] = await Promise.all([
      prisma.article.findMany({
        where: { status: "PUBLISHED" },
        include: articleCardInclude,
      }),
      Promise.resolve(
        listDemoArticleCards({
          page: 1,
          pageSize: DEMO_CATALOG_PAGE_SIZE,
          handbookOnly: false,
        }),
      ),
      listDemoBlockedSlugs(),
    ]);
    const demoVisible = demoAll.items.filter((a) => !blocked.has(a.slug));
    const merged = mergeArticleCards(rows.map(mapToCard), demoVisible);
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
          description:
            NOXH_HANDBOOK_TAG_DESCRIPTIONS[
              tag.slug as keyof typeof NOXH_HANDBOOK_TAG_DESCRIPTIONS
            ] ??
            meta?.description ??
            null,
          articleCount: 1,
        });
      }
    }

    return [...counts.values()]
      .filter((t) => t.articleCount > 0 && NOXH_HANDBOOK_TAG_SLUGS.has(t.slug))
      .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  } catch {
    return listDemoTags();
  }
}
