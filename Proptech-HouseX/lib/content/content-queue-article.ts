/**
 * Build markdown article body + slug từ content queue (P1 publish web).
 * Body đưa lên web / preview L2 phải là copy người đọc — không nhãn ops / SoR.
 */

import { getNoxhCtaTool } from "@/lib/content/noxh-cta-tools";

export type QueueArticleSeed = {
  title: string;
  painPoint?: string | null;
  bodyPreview?: string | null;
  ctaToolId?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

/** H2 chốt bài — người đọc thấy; không kèm nhãn ops `(CTA)`. */
export const READER_CTA_HEADING = "## Kiểm tra nhanh";

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;
const CTA_HEADING_LINE_RE = /^##\s+Kiểm tra nhanh(?:\s*\(CTA\))?\s*$/im;
const CTA_HEADING_OPS_RE = /^##\s+Kiểm tra nhanh\s*\(CTA\)\s*$/gim;

/** Đoạn mở khung biên tập (GHI_CHU / DNA) — không đăng lên web. */
const EDITORIAL_SCOPE_OPENER_RE =
  /^Bài này quan sát và trình bày[\s\S]*?(?=\n\n|\n##|$)/;

/** Mục ghi chú nội bộ nếu lỡ dính vào body. */
const EDITORIAL_NOTE_SECTION_RE =
  /^##\s*(?:Lưu ý biên tập|Ghi chú biên tập|Ops notes?)[\s\S]*?(?=\n##\s+|\n*$)/gim;

/** H2 checklist SoR — không phải tiêu đề tin báo. */
const SOR_WHO_AFFECTED_H2_RE =
  /^##\s+Ai (?:đang chịu tác động|bị ảnh hưởng)[^\n]*\n+/gim;

/**
 * Ghi chú hệ thống soft-CTA — CẤM đưa lên web / queue body cho người đọc.
 * Không append lại trong seed/publish.
 */
export const SYSTEM_NO_PHONE_CTA_NOTE =
  "Không cần để lại SĐT trước khi xem kết quả gợi ý";

export const SYSTEM_NO_PHONE_CTA_NOTE_RE =
  /Không cần để lại SĐT trước khi xem kết quả gợi ý\.?/gi;

/** Gỡ mọi biến thể câu hệ thống SĐT khỏi markdown (web + admin normalize). */
export function stripSystemReaderForbiddenNotes(md: string): string {
  return md
    .replace(SYSTEM_NO_PHONE_CTA_NOTE_RE, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Slug ASCII từ tiêu đề tiếng Việt. */
export function slugifyArticleTitle(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
  return base.length >= 2 ? base : `noxh-bai-${Date.now().toString(36)}`;
}

/**
 * Làm sạch body queue → bản người đọc:
 * - bỏ YAML frontmatter nếu lỡ dính
 * - đổi `## Kiểm tra nhanh (CTA)` → `## Kiểm tra nhanh`
 * - bỏ HTML comment ops
 * - bỏ đoạn mở “Bài này quan sát và trình bày…” (SoR)
 * - bỏ H2 “Ai đang chịu tác động / Ai bị ảnh hưởng…”
 * - bỏ mục Lưu ý biên tập nếu lỡ dính
 * - bỏ câu hệ thống “Không cần để lại SĐT…” (cấm đăng web)
 */
export function normalizeQueueBodyForReader(md: string): string {
  let s = md.replace(/^\uFEFF/, "").trim();
  if (s.startsWith("---")) {
    s = s.replace(FRONTMATTER_RE, "").trim();
  }
  s = s.replace(CTA_HEADING_OPS_RE, READER_CTA_HEADING);
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(EDITORIAL_SCOPE_OPENER_RE, "").trim();
  s = s.replace(SOR_WHO_AFFECTED_H2_RE, "");
  s = s.replace(EDITORIAL_NOTE_SECTION_RE, "").trim();
  return stripSystemReaderForbiddenNotes(s);
}

/** Draft/seed đã có khối chốt (có hoặc không `(CTA)`). */
export function queueBodyHasCtaSection(md: string): boolean {
  return CTA_HEADING_LINE_RE.test(md);
}

/** Seed/gate: chấp nhận H2 reader hoặc H2 ops cũ. */
export function queueBodyHasSeedCtaMarker(md: string): boolean {
  return queueBodyHasCtaSection(md);
}

function appendCtaIfMissing(
  core: string,
  label: string,
  href: string,
): string {
  if (queueBodyHasCtaSection(core)) return core;
  return [core, "", READER_CTA_HEADING, "", `[${label}](${href})`]
    .join("\n")
    .trim();
}

/**
 * Markdown body tối thiểu cho CMS.
 * - Có `bodyPreview` đầy đủ (draft seed): dùng nguyên bản đã normalize.
 *   Không nhân đôi `## title` / “Câu hỏi thường gặp” — trang web đã có title/excerpt.
 * - Không preview: fallback ngắn + H2 title + painPoint + CTA.
 */
export function buildArticleBodyFromQueue(item: QueueArticleSeed): string {
  const tool = getNoxhCtaTool(item.ctaToolId);
  const href = item.ctaHref?.trim() || tool?.href || "/cong-cu/dieu-kien-noxh";
  const label =
    item.ctaLabel?.trim() ||
    tool?.defaultCtaLabel ||
    "Kiểm tra miễn phí ngay";

  const preview = item.bodyPreview?.trim();
  if (preview) {
    return appendCtaIfMissing(
      normalizeQueueBodyForReader(preview),
      label,
      href,
    );
  }

  const coreRaw = item.painPoint?.trim()
    ? `Nhiều người đang hỏi: *${item.painPoint.trim()}*\n\nDưới đây là hướng xử lý thực tế — và bạn có thể tự kiểm tra nhanh bằng công cụ miễn phí.`
    : "Bài hướng dẫn NƠXH — dùng công cụ bên dưới để tự kiểm tra trước khi nộp hồ sơ.";

  const core = normalizeQueueBodyForReader(coreRaw);

  const lines: Array<string | null> = [
    `## ${item.title.trim()}`,
    "",
    item.painPoint?.trim()
      ? `**Câu hỏi thường gặp:** ${item.painPoint.trim()}`
      : null,
    item.painPoint?.trim() ? "" : null,
    core,
  ];

  const wrapped = lines.filter((x): x is string => x !== null).join("\n");
  return appendCtaIfMissing(wrapped, label, href);
}
