/**
 * Build markdown article body + slug từ content queue (P1 publish web).
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

/** Markdown body tối thiểu — luôn có CTA link tool NƠXH. */
export function buildArticleBodyFromQueue(item: QueueArticleSeed): string {
  const tool = getNoxhCtaTool(item.ctaToolId);
  const href = item.ctaHref?.trim() || tool?.href || "/cong-cu/dieu-kien-noxh";
  const label =
    item.ctaLabel?.trim() ||
    tool?.defaultCtaLabel ||
    "Kiểm tra miễn phí ngay";

  const core =
    item.bodyPreview?.trim() ||
    (item.painPoint?.trim()
      ? `Nhiều người đang hỏi: *${item.painPoint.trim()}*\n\nDưới đây là hướng xử lý thực tế — và bạn có thể tự kiểm tra nhanh bằng công cụ miễn phí.`
      : "Bài hướng dẫn NƠXH — dùng công cụ bên dưới để tự kiểm tra trước khi nộp hồ sơ.");

  const lines = [
    `## ${item.title.trim()}`,
    "",
    item.painPoint?.trim()
      ? `**Câu hỏi thường gặp:** ${item.painPoint.trim()}`
      : null,
    item.painPoint?.trim() ? "" : null,
    core,
    "",
    "## Kiểm tra nhanh (CTA)",
    "",
    `[${label}](${href})`,
    "",
    "Không cần để lại SĐT trước khi xem kết quả gợi ý.",
  ].filter((x): x is string => x !== null);

  return lines.join("\n");
}
