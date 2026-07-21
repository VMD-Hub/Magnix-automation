import {
  Prisma,
  type ContentDraft,
  type ContentDraftStatus,
  type ContentQueueChannel,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertContentDraftReadyForL3 } from "@/lib/content/content-draft-gates";
import {
  EMPTY_L3_CHECKLIST,
  getNoxhCtaTool,
  type L3ContentChecklist,
  type NoxhCtaToolId,
} from "@/lib/content/noxh-cta-tools";
import { randomUUID } from "node:crypto";

export type ContentDraftWithArticle = ContentDraft & {
  article: { id: string; slug: string; title: string; status: string } | null;
};

const includeArticle = {
  article: { select: { id: true, slug: true, title: true, status: true } },
} as const;

function checklistToJson(
  value: L3ContentChecklist | null,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function parseScheduledAt(raw: string | null | undefined): Date | null {
  if (raw == null || raw === "") return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function resolveCta(ctaToolId: string | null | undefined, ctaLabel?: string | null) {
  const tool = getNoxhCtaTool(ctaToolId);
  if (!tool) {
    return { ctaToolId: null as string | null, ctaHref: null as string | null, ctaLabel: ctaLabel ?? null };
  }
  return {
    ctaToolId: tool.id,
    ctaHref: tool.href,
    ctaLabel: ctaLabel?.trim() || tool.defaultCtaLabel,
  };
}

export type ContentDraftWriteInput = {
  title?: string;
  hookLine?: string | null;
  artifactMarkdown?: string | null;
  ctaOptIn?: string | null;
  disclaimer?: string | null;
  exportHint?: string | null;
  segment?: string | null;
  qaTier?: string | null;
  publishChannel?: ContentQueueChannel | null;
  ctaToolId?: NoxhCtaToolId | null;
  ctaLabel?: string | null;
  opsNotes?: string | null;
  scheduledAt?: string | null;
  l3Checklist?: L3ContentChecklist | null;
};

export async function listContentDraftsForAdmin(
  status: ContentDraftStatus | "ALL" | "SCHEDULED",
): Promise<ContentDraftWithArticle[]> {
  if (status === "SCHEDULED") {
    return prisma.contentDraft.findMany({
      where: {
        scheduledAt: { not: null },
        status: { not: "PUBLISHED" },
      },
      include: includeArticle,
      orderBy: [{ scheduledAt: "asc" }],
      take: 200,
    });
  }
  return prisma.contentDraft.findMany({
    where: status === "ALL" ? undefined : { status },
    include: includeArticle,
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
  });
}

export async function getContentDraftById(
  id: string,
): Promise<ContentDraftWithArticle | null> {
  return prisma.contentDraft.findUnique({
    where: { id },
    include: includeArticle,
  });
}

export async function createContentDraft(
  input: ContentDraftWriteInput & { title: string },
): Promise<ContentDraftWithArticle> {
  const cta = resolveCta(input.ctaToolId, input.ctaLabel);
  return prisma.contentDraft.create({
    data: {
      normalizedKey: `editorial-draft:${randomUUID()}`,
      title: input.title,
      hookLine: input.hookLine ?? null,
      artifactMarkdown: input.artifactMarkdown ?? null,
      ctaOptIn: input.ctaOptIn ?? null,
      disclaimer: input.disclaimer ?? null,
      exportHint: input.exportHint ?? null,
      segment: input.segment ?? null,
      qaTier: input.qaTier ?? null,
      publishChannel: input.publishChannel ?? null,
      ctaToolId: cta.ctaToolId,
      ctaHref: cta.ctaHref,
      ctaLabel: cta.ctaLabel,
      opsNotes: input.opsNotes ?? null,
      scheduledAt: parseScheduledAt(input.scheduledAt),
      l3Checklist: checklistToJson(input.l3Checklist ?? EMPTY_L3_CHECKLIST),
      status: "DRAFT",
    },
    include: includeArticle,
  });
}

export async function updateContentDraft(
  id: string,
  input: ContentDraftWriteInput,
): Promise<ContentDraftWithArticle> {
  const existing = await getContentDraftById(id);
  if (!existing) throw new Error("NOT_FOUND");
  if (existing.status === "PUBLISHED") throw new Error("LOCKED");

  const cta =
    input.ctaToolId !== undefined || input.ctaLabel !== undefined
      ? resolveCta(
          input.ctaToolId !== undefined ? input.ctaToolId : existing.ctaToolId,
          input.ctaLabel !== undefined ? input.ctaLabel : existing.ctaLabel,
        )
      : null;

  return prisma.contentDraft.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.hookLine !== undefined ? { hookLine: input.hookLine } : {}),
      ...(input.artifactMarkdown !== undefined
        ? { artifactMarkdown: input.artifactMarkdown }
        : {}),
      ...(input.ctaOptIn !== undefined ? { ctaOptIn: input.ctaOptIn } : {}),
      ...(input.disclaimer !== undefined ? { disclaimer: input.disclaimer } : {}),
      ...(input.exportHint !== undefined ? { exportHint: input.exportHint } : {}),
      ...(input.segment !== undefined ? { segment: input.segment } : {}),
      ...(input.qaTier !== undefined ? { qaTier: input.qaTier } : {}),
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
      ...(input.opsNotes !== undefined ? { opsNotes: input.opsNotes } : {}),
      ...(input.scheduledAt !== undefined
        ? { scheduledAt: parseScheduledAt(input.scheduledAt) }
        : {}),
      ...(input.l3Checklist !== undefined
        ? { l3Checklist: checklistToJson(input.l3Checklist) }
        : {}),
    },
    include: includeArticle,
  });
}

function gateOrThrow(row: ContentDraft) {
  const gate = assertContentDraftReadyForL3(row);
  if (!gate.pass) {
    const err = new Error("GATE_FAILED");
    (err as Error & { details?: string[] }).details = gate.errors;
    throw err;
  }
}

export async function submitContentDraftL3(
  id: string,
): Promise<ContentDraftWithArticle> {
  const row = await getContentDraftById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "DRAFT" && row.status !== "REJECTED") {
    throw new Error("INVALID_STATUS");
  }
  gateOrThrow(row);
  return prisma.contentDraft.update({
    where: { id },
    data: { status: "PENDING_L3", rejectReason: null },
    include: includeArticle,
  });
}

export async function approveContentDraft(
  id: string,
  reviewedBy: string,
): Promise<ContentDraftWithArticle> {
  const row = await getContentDraftById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PENDING_L3") throw new Error("NOT_PENDING");
  gateOrThrow(row);
  return prisma.contentDraft.update({
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

export async function rejectContentDraft(
  id: string,
  reviewedBy: string,
  rejectReason: string,
): Promise<ContentDraftWithArticle> {
  const row = await getContentDraftById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "PENDING_L3") throw new Error("NOT_PENDING");
  return prisma.contentDraft.update({
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

export async function markContentDraftPublished(
  id: string,
): Promise<ContentDraftWithArticle> {
  const row = await getContentDraftById(id);
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "APPROVED" && row.status !== "PUBLISHED") {
    throw new Error("INVALID_STATUS");
  }
  gateOrThrow(row);
  return prisma.contentDraft.update({
    where: { id },
    data: {
      status: "PUBLISHED",
      publishedAt: row.publishedAt ?? new Date(),
    },
    include: includeArticle,
  });
}
