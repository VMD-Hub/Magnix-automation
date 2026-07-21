/**
 * P4.3 — list due + mark published cho n8n content-page-publish (Postgres SoR).
 */

import { Prisma, type ContentDraft } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  evaluateContentDraftPagePublishDue,
  parsePagePublishMeta,
  type PagePublishBlocker,
  type PagePublishMeta,
} from "@/lib/content/content-page-publish-due";

export type ContentPagePublishDueItem = {
  id: string;
  normalized_key: string;
  title: string;
  hook_line: string | null;
  artifact_markdown: string | null;
  cta_opt_in: string | null;
  disclaimer: string | null;
  segment: string | null;
  export_hint: string | null;
  status: string;
  publish_channel: string | null;
  cta_tool_id: string | null;
  cta_label: string | null;
  cta_href: string | null;
  scheduled_at: string | null;
  sheet_key: string | null;
  meta_parsed: PagePublishMeta;
  /** Alias snake_case cho node Build Facebook Message. */
  product_type: string;
};

export type ContentPagePublishDueResult = {
  items: ContentPagePublishDueItem[];
  scanned: number;
  due: number;
  blockers: Record<PagePublishBlocker, number>;
  asOf: string;
};

function emptyBlockers(): Record<PagePublishBlocker, number> {
  return {
    not_approved: 0,
    already_published: 0,
    wrong_channel: 0,
    wrong_format: 0,
    not_due: 0,
    empty_body: 0,
  };
}

function toDueItem(
  row: ContentDraft,
  meta: PagePublishMeta,
  scheduledAtIso: string | null,
): ContentPagePublishDueItem {
  const productType = String(
    meta.content_format ?? meta.product_type ?? "fb_page_post",
  )
    .trim()
    .toLowerCase() || "fb_page_post";

  return {
    id: row.id,
    normalized_key: row.normalizedKey,
    title: row.title,
    hook_line: row.hookLine,
    artifact_markdown: row.artifactMarkdown,
    cta_opt_in: row.ctaOptIn,
    disclaimer: row.disclaimer,
    segment: row.segment,
    export_hint: row.exportHint,
    status: row.status,
    publish_channel: row.publishChannel,
    cta_tool_id: row.ctaToolId,
    cta_label: row.ctaLabel,
    cta_href: row.ctaHref,
    scheduled_at: scheduledAtIso ?? row.scheduledAt?.toISOString() ?? null,
    sheet_key: row.sheetKey,
    meta_parsed: meta,
    product_type: productType,
  };
}

/**
 * Candidate: APPROVED + (FB_PAGE channel hoặc meta page) + scheduled <= now.
 * Quét tối đa 200 APPROVED gần nhất, trả về `limit` bài due.
 */
export async function listDueContentDraftsForPagePublish(opts?: {
  limit?: number;
  now?: Date;
}): Promise<ContentPagePublishDueResult> {
  const limit = Math.min(Math.max(opts?.limit ?? 3, 1), 20);
  const now = opts?.now ?? new Date();
  const nowMs = now.getTime();
  const blockers = emptyBlockers();

  const rows = await prisma.contentDraft.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ scheduledAt: "asc" }, { updatedAt: "asc" }],
    take: 200,
  });

  const items: ContentPagePublishDueItem[] = [];
  for (const row of rows) {
    const evalResult = evaluateContentDraftPagePublishDue(
      {
        status: row.status,
        publishChannel: row.publishChannel,
        scheduledAt: row.scheduledAt,
        hookLine: row.hookLine,
        artifactMarkdown: row.artifactMarkdown,
        ctaOptIn: row.ctaOptIn,
        meta: row.meta,
      },
      nowMs,
    );
    if (!evalResult.due) {
      blockers[evalResult.reason] += 1;
      continue;
    }
    items.push(toDueItem(row, evalResult.meta, evalResult.scheduledAtIso));
    if (items.length >= limit) break;
  }

  return {
    items,
    scanned: rows.length,
    due: items.length,
    blockers,
    asOf: now.toISOString(),
  };
}

export type MarkPagePublishInput = {
  id: string;
  publishOk: boolean;
  fbPostId?: string | null;
  fbPermalink?: string | null;
  publishError?: string | null;
  publishMode?: string | null;
  pinAfterPublish?: boolean;
};

export async function markContentDraftPagePublishResult(
  input: MarkPagePublishInput,
): Promise<ContentDraft> {
  const row = await prisma.contentDraft.findUnique({ where: { id: input.id } });
  if (!row) throw new Error("NOT_FOUND");
  if (row.status !== "APPROVED" && row.status !== "PUBLISHED") {
    throw new Error("INVALID_STATUS");
  }

  const existingMeta = parsePagePublishMeta(row.meta);
  const metaPatch: PagePublishMeta = {
    ...existingMeta,
    page_published: input.publishOk === true,
    published_at: new Date().toISOString(),
    fb_post_id: input.fbPostId ?? existingMeta.fb_post_id ?? null,
    fb_permalink: input.fbPermalink ?? existingMeta.fb_permalink ?? null,
    publish_error: input.publishOk ? null : input.publishError ?? null,
    publish_agent: "content-page-publish",
    publish_mode: input.publishMode ?? null,
    pin_after_publish: input.pinAfterPublish === true,
  };

  return prisma.contentDraft.update({
    where: { id: input.id },
    data: {
      status: input.publishOk ? "PUBLISHED" : row.status,
      publishedAt: input.publishOk
        ? (row.publishedAt ?? new Date())
        : row.publishedAt,
      meta: metaPatch as Prisma.InputJsonValue,
    },
  });
}
