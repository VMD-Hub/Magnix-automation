/**
 * Build markdown article body + slug từ content queue (P1 publish web).
 * Body đưa lên web / preview L2 phải là copy người đọc — không nhãn ops.
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
 */
export function normalizeQueueBodyForReader(md: string): string {
  let s = md.replace(/^\uFEFF/, "").trim();
  if (s.startsWith("---")) {
    s = s.replace(FRONTMATTER_RE, "").trim();
  }
  s = s.replace(CTA_HEADING_OPS_RE, READER_CTA_HEADING);
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  return s.replace(/\n{3,}/g, "\n\n").trim();
}

/** Draft/seed đã có khối chốt (có hoặc không `(CTA)`). */
export function queueBodyHasCtaSection(md: string): boolean {
  return CTA_HEADING_LINE_RE.test(md);
}

/** Seed/gate: chấp nhận H2 reader hoặc H2 ops cũ. */
export function queueBodyHasSeedCtaMarker(md: string): boolean {
  return queueBodyHasCtaSection(md);
}

/** Markdown body tối thiểu — luôn có CTA link tool; không lộ nhãn `(CTA)`. */
export function buildArticleBodyFromQueue(item: QueueArticleSeed): string {
  const tool = getNoxhCtaTool(item.ctaToolId);
  const href = item.ctaHref?.trim() || tool?.href || "/cong-cu/dieu-kien-noxh";
  const label =
    item.ctaLabel?.trim() ||
    tool?.defaultCtaLabel ||
    "Kiểm tra miễn phí ngay";

  const coreRaw =
    item.bodyPreview?.trim() ||
    (item.painPoint?.trim()
      ? `Nhiều người đang hỏi: *${item.painPoint.trim()}*\n\nDưới đây là hướng xử lý thực tế — và bạn có thể tự kiểm tra nhanh bằng công cụ miễn phí.`
      : "Bài hướng dẫn NƠXH — dùng công cụ bên dưới để tự kiểm tra trước khi nộp hồ sơ.");

  const core = normalizeQueueBodyForReader(coreRaw);

  const ctaNote = tool?.requiresContact
    ? "House X hỗ trợ định hướng hồ sơ — không thay cơ quan nhà nước cấp sổ / quyết định hồ sơ."
    : "Không cần để lại SĐT trước khi xem kết quả gợi ý.";

  const lines: Array<string | null> = [
    `## ${item.title.trim()}`,
    "",
    item.painPoint?.trim()
      ? `**Câu hỏi thường gặp:** ${item.painPoint.trim()}`
      : null,
    item.painPoint?.trim() ? "" : null,
    core,
  ];

  if (!queueBodyHasCtaSection(core)) {
    lines.push("", READER_CTA_HEADING, "", `[${label}](${href})`, "", ctaNote);
  }

  return lines.filter((x): x is string => x !== null).join("\n");
}
