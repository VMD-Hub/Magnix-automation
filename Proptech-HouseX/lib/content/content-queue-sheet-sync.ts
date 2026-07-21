/**
 * P4 slice 1 — map + merge Sheet content_queue → Admin ContentQueueItem.
 * Pure helpers (testable) + sync runner.
 */

import type { ContentQueueStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getGoogleSheetsAccessToken,
  sheetsValuesGet,
} from "@/lib/google/sheets-client";

export type SheetContentQueueRow = {
  normalized_key: string;
  post_id?: string;
  platform?: string;
  post_url?: string;
  text?: string;
  segment?: string;
  score?: string | number;
  status?: string;
  captured_at?: string;
  source?: string;
  tags?: string;
  meta?: string;
  interest_key?: string;
  claude_verdict?: string;
};

export type MappedQueueFields = {
  sheetKey: string;
  normalizedKey: string;
  title: string;
  bodyPreview: string | null;
  painPoint: string | null;
  segment: string | null;
  score: number | null;
  sourceUrl: string | null;
  platform: string | null;
  sheetStatus: string | null;
  status: ContentQueueStatus;
};

/** Sheet status → Admin enum. */
export function mapSheetStatusToQueue(
  sheetStatus: string | null | undefined,
): ContentQueueStatus {
  const s = (sheetStatus ?? "").trim().toLowerCase();
  if (s === "published") return "PUBLISHED";
  if (s === "rejected") return "REJECTED";
  if (s === "approved") return "APPROVED";
  if (s === "pending_l3" || s === "pending") return "PENDING_L3";
  return "INTAKE";
}

export function parseSheetScore(raw: string | number | null | undefined): number | null {
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function titleFromSheetText(text: string | null | undefined, key: string): string {
  const t = (text ?? "").trim().replace(/\s+/g, " ");
  if (t.length >= 3) return t.slice(0, 240);
  return `Sheet ${key}`.slice(0, 240);
}

export function mapSheetRowToQueueFields(row: SheetContentQueueRow): MappedQueueFields | null {
  const sheetKey = String(row.normalized_key ?? "").trim();
  if (!sheetKey) return null;
  const text = String(row.text ?? "").trim();
  const interest = String(row.interest_key ?? "").trim();
  return {
    sheetKey,
    normalizedKey: `sheet:${sheetKey}`,
    title: titleFromSheetText(text || interest, sheetKey),
    bodyPreview: text || null,
    painPoint: interest && interest !== "unknown" ? interest : null,
    segment: String(row.segment ?? "").trim() || null,
    score: parseSheetScore(row.score),
    sourceUrl: String(row.post_url ?? "").trim() || null,
    platform: String(row.platform ?? "").trim() || null,
    sheetStatus: String(row.status ?? "").trim() || null,
    status: mapSheetStatusToQueue(row.status),
  };
}

/**
 * Merge sync → existing: không đè CTA / L3 / schedule / article;
 * không hạ status khi đã qua INTAKE.
 */
export function mergeSheetIntoExisting(
  existing: {
    status: ContentQueueStatus;
    ctaToolId: string | null;
    ctaLabel: string | null;
    ctaHref: string | null;
    l3Checklist: unknown;
    articleId: string | null;
    scheduledAt: Date | null;
    painPoint: string | null;
  },
  mapped: MappedQueueFields,
): {
  title: string;
  bodyPreview: string | null;
  painPoint: string | null;
  segment: string | null;
  score: number | null;
  sourceUrl: string | null;
  platform: string | null;
  sheetStatus: string | null;
  status: ContentQueueStatus;
  sheetSyncedAt: Date;
} {
  const status =
    existing.status === "INTAKE" ? mapped.status : existing.status;

  return {
    title: mapped.title,
    bodyPreview: mapped.bodyPreview,
    painPoint: existing.painPoint?.trim()
      ? existing.painPoint
      : mapped.painPoint,
    segment: mapped.segment,
    score: mapped.score,
    sourceUrl: mapped.sourceUrl,
    platform: mapped.platform,
    sheetStatus: mapped.sheetStatus,
    status,
    sheetSyncedAt: new Date(),
  };
}

export function rowsFromSheetValues(values: string[][]): SheetContentQueueRow[] {
  if (values.length < 2) return [];
  const headers = values[0]!.map((h) => String(h ?? "").trim().toLowerCase());
  const out: SheetContentQueueRow[] = [];
  for (let i = 1; i < values.length; i += 1) {
    const cells = values[i]!;
    if (!cells.some((c) => String(c ?? "").trim())) continue;
    const row: Record<string, string> = {};
    headers.forEach((key, j) => {
      if (key) row[key] = String(cells[j] ?? "");
    });
    out.push(row as SheetContentQueueRow);
  }
  return out;
}

export type ContentQueueSyncResult = {
  skipped: boolean;
  reason?: string;
  scanned: number;
  created: number;
  updated: number;
  skippedLowScore: number;
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
    process.env.MAGNIX_CONTENT_QUEUE_TAB?.trim() || "content_queue";
  return { sheetId, tab };
}

export async function syncContentQueueFromSheet(opts?: {
  limit?: number;
  minScore?: number;
}): Promise<ContentQueueSyncResult> {
  const cfg = resolveSheetConfig();
  if (!cfg) {
    return {
      skipped: true,
      reason:
        "Thiếu MAGNIX_CONTENT_SHEET_ID / MAGNIX_GOOGLE_SHEET_ID / GOOGLE_SHEET_MIRROR_ID",
      scanned: 0,
      created: 0,
      updated: 0,
      skippedLowScore: 0,
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
      skippedLowScore: 0,
      skippedNoKey: 0,
      sheetId: cfg.sheetId,
      tab: cfg.tab,
    };
  }

  const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 500);
  const minScore = opts?.minScore ?? 70;

  const token = await getGoogleSheetsAccessToken();
  const values = await sheetsValuesGet(
    cfg.sheetId,
    `${cfg.tab}!A:O`,
    token,
  );
  const rows = rowsFromSheetValues(values);

  let created = 0;
  let updated = 0;
  let skippedLowScore = 0;
  let skippedNoKey = 0;
  let processed = 0;

  // Ưu tiên score cao
  const ranked = [...rows].sort((a, b) => {
    const sa = parseSheetScore(a.score) ?? -1;
    const sb = parseSheetScore(b.score) ?? -1;
    return sb - sa;
  });

  for (const row of ranked) {
    if (processed >= limit) break;
    const mapped = mapSheetRowToQueueFields(row);
    if (!mapped) {
      skippedNoKey += 1;
      continue;
    }
    const score = mapped.score ?? 0;
    const verdict = String(row.claude_verdict ?? "").toLowerCase();
    const allow =
      score >= minScore ||
      verdict === "qualified" ||
      ["classified", "queued", "approved", "published"].includes(
        (mapped.sheetStatus ?? "").toLowerCase(),
      );
    if (!allow) {
      skippedLowScore += 1;
      continue;
    }

    processed += 1;
    const existing = await prisma.contentQueueItem.findUnique({
      where: { normalizedKey: mapped.normalizedKey },
    });

    if (!existing) {
      await prisma.contentQueueItem.create({
        data: {
          normalizedKey: mapped.normalizedKey,
          sheetKey: mapped.sheetKey,
          title: mapped.title,
          bodyPreview: mapped.bodyPreview,
          painPoint: mapped.painPoint,
          segment: mapped.segment,
          score: mapped.score,
          sourceUrl: mapped.sourceUrl,
          platform: mapped.platform,
          sheetStatus: mapped.sheetStatus,
          status: mapped.status === "PUBLISHED" ? "PUBLISHED" : "INTAKE",
          sheetSyncedAt: new Date(),
          publishedAt:
            mapped.status === "PUBLISHED" ? new Date() : null,
        },
      });
      created += 1;
      continue;
    }

    const merged = mergeSheetIntoExisting(existing, mapped);
    await prisma.contentQueueItem.update({
      where: { id: existing.id },
      data: {
        title: merged.title,
        bodyPreview: merged.bodyPreview,
        painPoint: merged.painPoint,
        segment: merged.segment,
        score: merged.score,
        sourceUrl: merged.sourceUrl,
        platform: merged.platform,
        sheetStatus: merged.sheetStatus,
        status: merged.status,
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
    skippedLowScore,
    skippedNoKey,
    sheetId: cfg.sheetId,
    tab: cfg.tab,
  };
}
