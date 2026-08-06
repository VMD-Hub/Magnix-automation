import {
  Prisma,
  type ContentQueueChannel,
  type ContentQueueItem,
  type ContentQueueStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  assertContentQueueReadyForL3,
} from "@/lib/content/content-queue-gates";
import {
  buildArticleBodyFromQueue,
  slugifyArticleTitle,
} from "@/lib/content/content-queue-article";
import {
  EMPTY_L3_CHECKLIST,
  getNoxhCtaTool,
  type L3ContentChecklist,
  type NoxhCtaToolId,
} from "@/lib/content/noxh-cta-tools";
import { createArticleFromAdmin, suppressPublicArticleBySlug, upsertArticleTag } from "@/lib/data/article-admin";
import {
  resolveArticleTagDisplayName,
  resolveCanonicalArticleTag,
} from "@/lib/content/articles/noxh-handbook-tags";
import { revalidatePublicArticleBySlug } from "@/lib/content/revalidate-public-article";
import { randomUUID } from "node:crypto";

function checklistToJson(
  value: L3ContentChecklist | null,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

/** slug từ normalizedKey wiki-noxh:… / kien-thuc:… hoặc dòng opsNotes `slug:`. */
export function parseContentQueueCanonicalSlug(row: {
  normalizedKey: string;
  opsNotes?: string | null;
  article?: { slug: string } | null;
}): string | null {
  if (row.article?.slug) return row.article.slug;
  const fromKey = row.normalizedKey.match(
    /^(?:wiki-noxh|kien-thuc|re-knowledge):(.+)$/,
  );
  if (fromKey?.[1]) return fromKey[1].trim();
  const m = row.opsNotes?.match(/^slug:\s*(.+)$/m);
  return m?.[1]?.trim() || null;
}

function parseContentQueueTagSlugs(
  row: Pick<ContentQueueItem, "opsNotes">,
): string[] {
  const m = row.opsNotes?.match(/^tags:\s*(.+)$/m);
  if (!m?.[1]) return [];
  return m[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

async function ensureArticleTags(slugs: string[]) {
  for (const raw of slugs) {
    const canonical = resolveCanonicalArticleTag(raw);
    const slug = canonical?.slug ?? raw;
    const name = resolveArticleTagDisplayName(raw);
    await upsertArticleTag({ slug, name });
  }
}

export type ContentQueueWithArticle = ContentQueueItem & {
  article: { id: string; slug: string; title: string; status: string } | null;
};

const includeArticle = {
  article: { select: { id: true, slug: true, title: true, status: true } },
} as const;

export type ContentQueueWriteInput = {
  title?: string;
  painPoint?: string | null;
  bodyPreview?: string | null;
  segment?: string | null;
  score?: number | null;
  publishChannel?: ContentQueueChannel | null;
  ctaToolId?: NoxhCtaToolId | null;
  ctaLabel?: string | null;
  sourceUrl?: string | null;
  sheetKey?: string | null;
  articleId?: string | null;
  opsNotes?: string | null;
  l3Checklist?: L3ContentChecklist | null;
  scheduledAt?: string | null;
};

function parseScheduledAt(raw: string | null | undefined): Date | null {
  if (raw == null || raw === "") return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function resolveCtaFields(ctaToolId: string | null | undefined, ctaLabel?: string | null) {
  const tool = getNoxhCtaTool(ctaToolId);
  if (!tool) {
    return {
      ctaToolId: null as string | null,
      ctaHref: null as string | null,
      ctaLabel: ctaLabel ?? null,
    };
  }
  return {
    ctaToolId: tool.id,
    ctaHref: tool.href,
    ctaLabel: ctaLabel?.trim() || tool.defaultCtaLabel,
  };
}

export async function listContentQueueForAdmin(
  status: ContentQueueStatus | "ALL" | "SCHEDULED",
): Promise<ContentQueueWithArticle[]> {
  if (status === "SCHEDULED") {
    return prisma.contentQueueItem.findMany({
      where: {
        scheduledAt: { not: null },
        status: { not: "PUBLISHED" },
      },
      include: includeArticle,
      orderBy: [{ scheduledAt: "asc" }],
      take: 200,
    });
  }
  return prisma.contentQueueItem.findMany({
    where: status === "ALL" ? undefined : { status },
    include: includeArticle,
    orderBy: [{ createdAt: "desc" }],
    take: 200,
  });
}

export async function getContentQueueById(
  id: string,
): Promise<ContentQueueWithArticle | null> {
  return prisma.contentQueueItem.findUnique({
    where: { id },
    include: includeArticle,
  });
}

export async function createContentQueueItem(
  input: ContentQueueWriteInput & { title: string },
): Promise<ContentQueueWithArticle> {
  const cta = resolveCtaFields(input.ctaToolId, input.ctaLabel);
  const key = input.sheetKey
    ? `sheet:${input.sheetKey}`
    : `editorial:${randomUUID()}`;

  return prisma.contentQueueItem.create({
    data: {
      normalizedKey: key,
      title: input.title,
      painPoint: input.painPoint ?? null,
      bodyPreview: input.bodyPreview ?? null,
      segment: input.segment ?? null,
      score: input.score ?? null,
      publishChannel: input.publishChannel ?? null,
      ctaToolId: cta.ctaToolId,
      ctaHref: cta.ctaHref,
      ctaLabel: cta.ctaLabel,
      sourceUrl: input.sourceUrl ?? null,
      sheetKey: input.sheetKey ?? null,
      articleId: input.articleId ?? null,
      opsNotes: input.opsNotes ?? null,
      l3Checklist: checklistToJson(input.l3Checklist ?? EMPTY_L3_CHECKLIST),
      scheduledAt: parseScheduledAt(input.scheduledAt),
      status: "INTAKE",
    },
    include: includeArticle,
  });
}

export async function updateContentQueueItem(
  id: string,
  input: ContentQueueWriteInput,
): Promise<ContentQueueWithArticle> {
  const existing = await getContentQueueById(id);
  if (!existing) throw new Error("NOT_FOUND");
  // Super Admin được sửa cả item PUBLISHED rồi Đồng bộ lại web.

  const nextToolId =
    input.ctaToolId !== undefined ? input.ctaToolId : existing.ctaToolId;
  const nextLabel =
    input.ctaLabel !== undefined ? input.ctaLabel : existing.ctaLabel;
  const cta =
    input.ctaToolId !== undefined || input.ctaLabel !== undefined
      ? resolveCtaFields(nextToolId, nextLabel)
      : null;

  return prisma.contentQueueItem.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.painPoint !== undefined ? { painPoint: input.painPoint } : {}),
      ...(input.bodyPreview !== undefined
        ? { bodyPreview: input.bodyPreview }
        : {}),
      ...(input.segment !== undefined ? { segment: input.segment } : {}),
      ...(input.score !== undefined ? { score: input.score } : {}),
      ...(input.publishChannel !== undefined
        ? { publishChannel: input.publishChannel }
        : {}),
      ...(cta
        ? {
            ctaToolId: cta.ctaToolId,
            ctaHref: cta.ctaHref,
            ctaLabel: cta.ctaLabel,
          }
        : {}),
      ...(input.sourceUrl !== undefined ? { sourceUrl: input.sourceUrl } : {}),
      ...(input.sheetKey !== undefined ? { sheetKey: input.sheetKey } : {}),
      ...(input.articleId !== undefined ? { articleId: input.articleId } : {}),
      ...(input.opsNotes !== undefined ? { opsNotes: input.opsNotes } : {}),
      ...(input.l3Checklist !== undefined
        ? { l3Checklist: checklistToJson(input.l3Checklist) }
        : {}),
      ...(input.scheduledAt !== undefined
        ? { scheduledAt: parseScheduledAt(input.scheduledAt) }
        : {}),
    },
    include: includeArticle,
  });
}

function gateOrThrow(row: ContentQueueItem) {
  const gate = assertContentQueueReadyForL3(row);
  if (!gate.pass) {
    const err = new Error("GATE_FAILED");
    (err as Error & { details?: string[] }).details = gate.errors;
    throw err;
  }
}

export async function submitContentQueueL3(
  id: string,
): Promise<ContentQueueWithArticle> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "INTAKE" && row.status !== "REJECTED") {
    throw new Error("INVALID_STATUS");
  }
  gateOrThrow(row);
  return prisma.contentQueueItem.update({
    where: { id },
    data: {
      status: "PENDING_L3",
      rejectReason: null,
    },
    include: includeArticle,
  });
}

export async function approveContentQueue(
  id: string,
  reviewedBy: string,
): Promise<ContentQueueWithArticle> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PENDING_L3") throw new Error("NOT_PENDING");
  gateOrThrow(row);
  return prisma.contentQueueItem.update({
    where: { id },
    data: {
      status: "APPROVED",
      reviewedAt: new Date(),
      reviewedBy,
      rejectReason: null,
    },
    include: includeArticle,
  });
}

export async function rejectContentQueue(
  id: string,
  reviewedBy: string,
  rejectReason: string,
): Promise<ContentQueueWithArticle> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PENDING_L3") throw new Error("NOT_PENDING");
  return prisma.contentQueueItem.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy,
      rejectReason,
    },
    include: includeArticle,
  });
}

export async function markContentQueuePublished(
  id: string,
): Promise<ContentQueueWithArticle> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "APPROVED" && row.status !== "PUBLISHED") {
    throw new Error("INVALID_STATUS");
  }
  gateOrThrow(row);
  return prisma.contentQueueItem.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: row.publishedAt ?? new Date(),
    },
    include: includeArticle,
  });
}

async function allocateUniqueArticleSlug(
  title: string,
  preferredSlug?: string | null,
  allowExistingId?: string | null,
): Promise<string> {
  if (preferredSlug) {
    const hit = await prisma.article.findUnique({
      where: { slug: preferredSlug },
      select: { id: true },
    });
    if (!hit || (allowExistingId && hit.id === allowExistingId)) {
      return preferredSlug;
    }
  }
  const base = preferredSlug || slugifyArticleTitle(title);
  for (let i = 0; i < 20; i += 1) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const hit = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!hit) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/**
 * P1 — tạo/publish bài CMS từ queue, luôn nhúng CTA tool NƠXH.
 * - publishNow=false: article DRAFT, queue vẫn APPROVED (gắn articleId)
 * - publishNow=true: article PUBLISHED, queue → PUBLISHED
 */
export async function publishContentQueueToWeb(
  id: string,
  opts: { publishNow?: boolean } = {},
): Promise<ContentQueueWithArticle> {
  const publishNow = opts.publishNow !== false;
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "APPROVED" && row.status !== "PUBLISHED") {
    throw new Error("INVALID_STATUS");
  }
  gateOrThrow(row);

  const tool = getNoxhCtaTool(row.ctaToolId);
  if (!tool) throw new Error("GATE_FAILED");

  const body = buildArticleBodyFromQueue(row);
  const excerpt =
    row.painPoint?.trim().slice(0, 500) ||
    `Kiểm tra nhanh: ${tool.title}`;
  const tagSlugs = parseContentQueueTagSlugs(row);
  if (tagSlugs.length > 0) await ensureArticleTags(tagSlugs);

  if (row.articleId) {
    const existing = await prisma.article.findUnique({
      where: { id: row.articleId },
    });
    if (!existing) throw new Error("ARTICLE_MISSING");

    await prisma.article.update({
      where: { id: existing.id },
      data: {
        title: row.title,
        excerpt,
        body,
        ...(publishNow
          ? {
              status: "PUBLISHED" as const,
              publishedAt: existing.publishedAt ?? new Date(),
            }
          : {}),
        seoTitle: row.title.slice(0, 200),
        seoDesc: excerpt.slice(0, 320),
      },
    });

    if (tagSlugs.length > 0) {
      const tagIds = await prisma.articleTag.findMany({
        where: { slug: { in: tagSlugs } },
        select: { id: true },
      });
      await prisma.$transaction([
        prisma.articleTagLink.deleteMany({ where: { articleId: existing.id } }),
        prisma.articleTagLink.createMany({
          data: tagIds.map((t) => ({
            articleId: existing.id,
            tagId: t.id,
          })),
          skipDuplicates: true,
        }),
      ]);
    }

    if (!publishNow) {
      const refreshed = await getContentQueueById(id);
      if (!refreshed) throw new Error("NOT_FOUND");
      return refreshed;
    }

    const published = await prisma.contentQueueItem.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: row.publishedAt ?? new Date(),
        publishChannel: row.publishChannel ?? "WEBSITE",
      },
      include: includeArticle,
    });
    revalidatePublicArticleBySlug(existing.slug);
    return published;
  }

  const preferred = parseContentQueueCanonicalSlug(row);
  if (preferred && !row.articleId) {
    const existingBySlug = await prisma.article.findUnique({
      where: { slug: preferred },
      select: { id: true, status: true },
    });
    if (existingBySlug) {
      await prisma.article.update({
        where: { id: existingBySlug.id },
        data: {
          title: row.title,
          excerpt,
          body,
          status: publishNow ? "PUBLISHED" : "DRAFT",
          publishedAt: publishNow ? new Date() : null,
          seoTitle: row.title.slice(0, 200),
          seoDesc: excerpt.slice(0, 320),
        },
      });
      if (tagSlugs.length > 0) {
        const tagIds = await prisma.articleTag.findMany({
          where: { slug: { in: tagSlugs } },
          select: { id: true },
        });
        await prisma.$transaction([
          prisma.articleTagLink.deleteMany({
            where: { articleId: existingBySlug.id },
          }),
          prisma.articleTagLink.createMany({
            data: tagIds.map((t) => ({
              articleId: existingBySlug.id,
              tagId: t.id,
            })),
            skipDuplicates: true,
          }),
        ]);
      }
      const linked = await prisma.contentQueueItem.update({
        where: { id },
        data: {
          articleId: existingBySlug.id,
          publishChannel: row.publishChannel ?? "WEBSITE",
          ...(publishNow
            ? {
                status: "PUBLISHED" as const,
                publishedAt: new Date(),
                rejectReason: null,
              }
            : {}),
        },
        include: includeArticle,
      });
      if (publishNow) revalidatePublicArticleBySlug(preferred);
      return linked;
    }
  }

  const slug = await allocateUniqueArticleSlug(row.title, preferred, null);
  const article = await createArticleFromAdmin({
    slug,
    title: row.title,
    excerpt,
    body,
    status: publishNow ? "PUBLISHED" : "DRAFT",
    publishedAt: publishNow ? new Date().toISOString() : null,
    coverImageUrl: null,
    authorName: "House X",
    seoTitle: row.title.slice(0, 200),
    seoDesc: excerpt.slice(0, 320),
    tagSlugs,
    projectIds: [],
  });

  const created = await prisma.contentQueueItem.update({
    where: { id },
    data: {
      articleId: article.id,
      publishChannel: row.publishChannel ?? "WEBSITE",
      ...(publishNow
        ? {
            status: "PUBLISHED" as const,
            publishedAt: new Date(),
          }
        : {}),
    },
    include: includeArticle,
  });
  if (publishNow) revalidatePublicArticleBySlug(slug);
  return created;
}

/**
 * Ẩn bài khỏi public + sitemap (ARCHIVED stub) — queue → REJECTED để sửa lại nếu cần.
 */
export async function hideContentQueuePublic(
  id: string,
  reviewedBy: string,
  reason?: string,
): Promise<ContentQueueWithArticle> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");

  const slug = parseContentQueueCanonicalSlug(row);
  if (!slug) throw new Error("SLUG_MISSING");

  const suppressed = await suppressPublicArticleBySlug(slug, row.title);

  const hidden = await prisma.contentQueueItem.update({
    where: { id },
    data: {
      status: "REJECTED",
      articleId: row.articleId ?? suppressed.id,
      reviewedAt: new Date(),
      reviewedBy,
      rejectReason:
        reason?.trim() ||
        "Ẩn khỏi site bởi Super Admin (không đạt / bảo vệ uy tín).",
      opsNotes: [
        row.opsNotes?.trim() || "",
        `hidden_at: ${new Date().toISOString()}`,
        `hidden_slug: ${slug}`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    include: includeArticle,
  });
  revalidatePublicArticleBySlug(slug);
  return hidden;
}

/**
 * Xóa item khỏi queue + giữ ARCHIVED stub theo slug (demo không sống lại).
 */
export async function deleteContentQueueItem(
  id: string,
): Promise<{ deleted: true; suppressedSlug: string | null }> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");

  const slug = parseContentQueueCanonicalSlug(row);
  if (slug) {
    await suppressPublicArticleBySlug(slug, row.title);
    revalidatePublicArticleBySlug(slug);
  }

  await prisma.contentQueueItem.delete({ where: { id } });
  return { deleted: true, suppressedSlug: slug };
}

/**
 * Đồng bộ chiều CMS → queue: kéo title/excerpt/body đang live vào Super Admin để sửa tiếp.
 */
export async function pullContentQueueFromWeb(
  id: string,
): Promise<ContentQueueWithArticle> {
  const row = await getContentQueueById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (!row.articleId) throw new Error("ARTICLE_MISSING");

  const article = await prisma.article.findUnique({
    where: { id: row.articleId },
  });
  if (!article) throw new Error("ARTICLE_MISSING");

  return prisma.contentQueueItem.update({
    where: { id },
    data: {
      title: article.title,
      painPoint: article.excerpt,
      bodyPreview: article.body,
      opsNotes: [
        row.opsNotes?.trim() || "",
        `pulled_from_cms_at: ${new Date().toISOString()}`,
        `cms_slug: ${article.slug}`,
        `cms_status: ${article.status}`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
    include: includeArticle,
  });
}
