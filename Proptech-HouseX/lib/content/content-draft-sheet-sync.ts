/**
 * P4.2 — map/merge Sheet content_drafts → Postgres ContentDraft.
 */

import type { ContentDraftStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getGoogleSheetsAccessToken,
  sheetsValuesGet,
} from "@/lib/google/sheets-client";
import { rowsFromSheetValues } from "@/lib/content/content-queue-sheet-sync";
import { slugifyArticleTitle } from "@/lib/content/content-queue-article";

export type SheetContentDraftRow = {
  source_normalized_key?: string;
  post_id?: string;
  segment?: string;
  title?: string;
  hook_line?: string;
  artifact_markdown?: string;
  cta_opt_in?: string;
  disclaimer?: string;
  export_hint?: string;
  status?: string;
  qa_tier?: string;
  created_at?: string;
  source?: string;
  meta?: string;
};

export type MappedDraftFields = {
  sheetKey: string;
  normalizedKey: string;
  sourceNormalizedKey: string | null;
  title: string;
  hookLine: string | null;
  artifactMarkdown: string | null;
  ctaOptIn: string | null;
  disclaimer: string | null;
  exportHint: string | null;
  segment: string | null;
  qaTier: string | null;
  source: string | null;
  sheetStatus: string | null;
  sheetCreatedAt: string | null;
  status: ContentDraftStatus;
  meta: Prisma.InputJsonValue | null;
};

export function mapSheetDraftStatus(
  sheetStatus: string | null | undefined,
): ContentDraftStatus {
  const s = (sheetStatus ?? "").trim().toLowerCase();
  if (s === "published") return "PUBLISHED";
  if (s === "rejected") return "REJECTED";
  if (s === "approved") return "APPROVED";
  if (s === "pending" || s === "pending_l3") return "PENDING_L3";
  return "DRAFT";
}

export function buildDraftSheetKey(row: SheetContentDraftRow): string | null {
  const source = String(row.source_normalized_key ?? "").trim();
  const title = String(row.title ?? "").trim();
  if (!source && !title) return null;
  const ymd = String(row.created_at ?? "")
    .trim()
    .slice(0, 10)
    .replace(/[^0-9-]/g, "");
  const slug = slugifyArticleTitle(title || source || "draft");
  return `${source || "unknown"}::${slug}::${ymd || "na"}`.slice(0, 220);
}

export function mapSheetRowToDraftFields(
  row: SheetContentDraftRow,
): MappedDraftFields | null {
  const sheetKey = buildDraftSheetKey(row);
  if (!sheetKey) return null;
  const title = String(row.title ?? "").trim() || `Draft ${sheetKey}`.slice(0, 240);
  let meta: Prisma.InputJsonValue | null = null;
  const rawMeta = String(row.meta ?? "").trim();
  if (rawMeta) {
    try {
      meta = JSON.parse(rawMeta) as Prisma.InputJsonValue;
    } catch {
      meta = { raw: rawMeta.slice(0, 2000) };
    }
  }

  return {
    sheetKey,
    normalizedKey: `sheet-draft:${sheetKey}`,
    sourceNormalizedKey: String(row.source_normalized_key ?? "").trim() || null,
    title: title.slice(0, 240),
    hookLine: String(row.hook_line ?? "").trim() || null,
    artifactMarkdown: String(row.artifact_markdown ?? "").trim() || null,
    ctaOptIn: String(row.cta_opt_in ?? "").trim() || null,
    disclaimer: String(row.disclaimer ?? "").trim() || null,
    exportHint: String(row.export_hint ?? "").trim() || null,
    segment: String(row.segment ?? "").trim() || null,
    qaTier: String(row.qa_tier ?? "").trim() || null,
    source: String(row.source ?? "").trim() || null,
    sheetStatus: String(row.status ?? "").trim() || null,
    sheetCreatedAt: String(row.created_at ?? "").trim() || null,
    status: mapSheetDraftStatus(row.status),
    meta,
  };
}

export function mergeDraftSheetIntoExisting(
  existing: {
    status: ContentDraftStatus;
    ctaToolId: string | null;
    scheduledAt: Date | null;
    articleId: string | null;
    hookLine: string | null;
    artifactMarkdown: string | null;
  },
  mapped: MappedDraftFields,
): {
  title: string;
  hookLine: string | null;
  artifactMarkdown: string | null;
  ctaOptIn: string | null;
  disclaimer: string | null;
  exportHint: string | null;
  segment: string | null;
  qaTier: string | null;
  source: string | null;
  sheetStatus: string | null;
  sheetCreatedAt: string | null;
  sourceNormalizedKey: string | null;
  status: ContentDraftStatus;
  meta: Prisma.InputJsonValue | null;
  sheetSyncedAt: Date;
} {
  const status = existing.status === "DRAFT" ? mapped.status : existing.status;
  const bodyFromSheet = existing.status === "DRAFT";

  return {
    title: mapped.title,
    hookLine: bodyFromSheet ? mapped.hookLine : existing.hookLine ?? mapped.hookLine,
    artifactMarkdown: bodyFromSheet
      ? mapped.artifactMarkdown
      : existing.artifactMarkdown ?? mapped.artifactMarkdown,
    ctaOptIn: mapped.ctaOptIn,
    disclaimer: mapped.disclaimer,
    exportHint: mapped.exportHint,
    segment: mapped.segment,
    qaTier: mapped.qaTier,
    source: mapped.source,
    sheetStatus: mapped.sheetStatus,
    sheetCreatedAt: mapped.sheetCreatedAt,
    sourceNormalizedKey: mapped.sourceNormalizedKey,
    status,
    meta: mapped.meta,
    sheetSyncedAt: new Date(),
  };
}

export type ContentDraftSyncResult = {
  skipped: boolean;
  reason?: string;
  scanned: number;
  created: number;
  updated: number;
  skippedNoKey: number;
  sheetId?: string;
  tab?: string;
};

function resolveSheetConfig(): { sheetId: string; tab: string } | null {
  const sheetId =
    process.env.MAGNIX_CONTENT_SHEET_ID?.trim() ||
    process.env.MAGNIX_GOOGLE_SHEET_ID?.trim() ||
    process.env.GOOGLE_SHEET_MIRROR_ID?.trim() ||
    "";
  if (!sheetId) return null;
  const tab =
    process.env.MAGNIX_CONTENT_DRAFTS_TAB?.trim() || "content_drafts";
  return { sheetId, tab };
}

export async function syncContentDraftsFromSheet(opts?: {
  limit?: number;
}): Promise<ContentDraftSyncResult> {
  const cfg = resolveSheetConfig();
  if (!cfg) {
    return {
      skipped: true,
      reason:
        "Thiếu MAGNIX_CONTENT_SHEET_ID / MAGNIX_GOOGLE_SHEET_ID / GOOGLE_SHEET_MIRROR_ID",
      scanned: 0,
      created: 0,
      updated: 0,
      skippedNoKey: 0,
    };
  }
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()) {
    return {
      skipped: true,
      reason: "Thiếu GOOGLE_SERVICE_ACCOUNT_JSON",
      scanned: 0,
      created: 0,
      updated: 0,
      skippedNoKey: 0,
      sheetId: cfg.sheetId,
      tab: cfg.tab,
    };
  }

  const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 500);
  const token = await getGoogleSheetsAccessToken();
  const values = await sheetsValuesGet(cfg.sheetId, `${cfg.tab}!A:N`, token);
  const rows = rowsFromSheetValues(values) as SheetContentDraftRow[];

  let created = 0;
  let updated = 0;
  let skippedNoKey = 0;
  let processed = 0;

  for (const row of [...rows].reverse()) {
    if (processed >= limit) break;
    const mapped = mapSheetRowToDraftFields(row);
    if (!mapped) {
      skippedNoKey += 1;
      continue;
    }
    processed += 1;

    const existing = await prisma.contentDraft.findUnique({
      where: { normalizedKey: mapped.normalizedKey },
    });

    if (!existing) {
      await prisma.contentDraft.create({
        data: {
          normalizedKey: mapped.normalizedKey,
          sheetKey: mapped.sheetKey,
          sourceNormalizedKey: mapped.sourceNormalizedKey,
          title: mapped.title,
          hookLine: mapped.hookLine,
          artifactMarkdown: mapped.artifactMarkdown,
          ctaOptIn: mapped.ctaOptIn,
          disclaimer: mapped.disclaimer,
          exportHint: mapped.exportHint,
          segment: mapped.segment,
          qaTier: mapped.qaTier,
          source: mapped.source,
          sheetStatus: mapped.sheetStatus,
          sheetCreatedAt: mapped.sheetCreatedAt,
          status: mapped.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
          meta: mapped.meta ?? undefined,
          sheetSyncedAt: new Date(),
          publishedAt: mapped.status === "PUBLISHED" ? new Date() : null,
        },
      });
      created += 1;
      continue;
    }

    const merged = mergeDraftSheetIntoExisting(existing, mapped);
    await prisma.contentDraft.update({
      where: { id: existing.id },
      data: {
        title: merged.title,
        hookLine: merged.hookLine,
        artifactMarkdown: merged.artifactMarkdown,
        ctaOptIn: merged.ctaOptIn,
        disclaimer: merged.disclaimer,
        exportHint: merged.exportHint,
        segment: merged.segment,
        qaTier: merged.qaTier,
        source: merged.source,
        sheetStatus: merged.sheetStatus,
        sheetCreatedAt: merged.sheetCreatedAt,
        sourceNormalizedKey: merged.sourceNormalizedKey,
        status: merged.status,
        meta: merged.meta ?? undefined,
        sheetSyncedAt: merged.sheetSyncedAt,
        sheetKey: existing.sheetKey ?? mapped.sheetKey,
      },
    });
    updated += 1;
  }

  return {
    skipped: false,
    scanned: rows.length,
    created,
    updated,
    skippedNoKey,
    sheetId: cfg.sheetId,
    tab: cfg.tab,
  };
}
