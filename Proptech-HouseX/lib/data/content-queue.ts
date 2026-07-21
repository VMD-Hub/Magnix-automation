import {
  Prisma,
  type ContentQueueChannel,
  type ContentQueueItem,
  type ContentQueueStatus,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertContentQueueReadyForL3 } from "@/lib/content/content-queue-gates";
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
import { createArticleFromAdmin } from "@/lib/data/article-admin";
import { randomUUID } from "node:crypto";

function checklistToJson(
  value: L3ContentChecklist | null,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
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
};

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
  status: ContentQueueStatus | "ALL",
): Promise<ContentQueueWithArticle[]> {
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
  if (existing.status === "PUBLISHED") throw new Error("LOCKED");

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

async function allocateUniqueArticleSlug(title: string): Promise<string> {
  const base = slugifyArticleTitle(title);
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

    if (!publishNow) {
      const refreshed = await getContentQueueById(id);
      if (!refreshed) throw new Error("NOT_FOUND");
      return refreshed;
    }

    return prisma.contentQueueItem.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: row.publishedAt ?? new Date(),
        publishChannel: row.publishChannel ?? "WEBSITE",
      },
      include: includeArticle,
    });
  }

  const slug = await allocateUniqueArticleSlug(row.title);
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
    tagSlugs: [],
    projectIds: [],
  });

  return prisma.contentQueueItem.update({
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
}
