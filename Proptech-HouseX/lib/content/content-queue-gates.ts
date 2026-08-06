/**
 * Gate L3 content queue — bài không CTA trong allowlist = không approve.
 * Khối CTA trên bài (## Kiểm tra nhanh) phải nằm trong body để Super Admin duyệt đúng thứ người đọc thấy.
 */

import {
  getNoxhCtaTool,
  isL3ChecklistComplete,
  isNoxhCtaToolId,
  parseL3Checklist,
  type L3ContentChecklist,
} from "@/lib/content/noxh-cta-tools";
import { queueBodyHasCtaSection } from "@/lib/content/content-queue-article";

export type ContentQueueGateInput = {
  title?: string | null;
  painPoint?: string | null;
  bodyPreview?: string | null;
  ctaToolId?: string | null;
  ctaLabel?: string | null;
  l3Checklist?: unknown;
};

export type ContentQueueGateResult = {
  pass: boolean;
  errors: string[];
  checklist: L3ContentChecklist;
};

/** Gate trước approve / submit_l3 / publish. */
export function assertContentQueueReadyForL3(
  input: ContentQueueGateInput,
): ContentQueueGateResult {
  const errors: string[] = [];
  const checklist = parseL3Checklist(input.l3Checklist);

  if (!input.title?.trim()) {
    errors.push("Thiếu tiêu đề bài.");
  }
  if (!input.painPoint?.trim()) {
    errors.push("Thiếu nỗi đau / góc bài (painPoint) — 1 câu.");
  }
  if (!input.bodyPreview?.trim()) {
    errors.push(
      "Thiếu nội dung bài (body) — Super Admin phải duyệt đủ trước khi đăng.",
    );
  } else if (
    !queueBodyHasCtaSection(input.bodyPreview) &&
    !isNoxhCtaToolId(input.ctaToolId)
  ) {
    // Có ctaToolId: publish sẽ tự chèn ## Kiểm tra nhanh từ tool (upsert draft / sửa tay).
    errors.push(
      "Thiếu khối ## Kiểm tra nhanh trong nội dung — chọn CTA tool hoặc chèn khối Kiểm tra nhanh (tab Như người đọc).",
    );
  }
  if (!isNoxhCtaToolId(input.ctaToolId)) {
    errors.push(
      "Bắt buộc chọn CTA: noxh-check, noxh-loan-quick, hoặc legal-review (rà soát pháp lý).",
    );
  } else if (!getNoxhCtaTool(input.ctaToolId)) {
    errors.push("ctaToolId không thuộc allowlist CTA content queue.");
  }
  if (!input.ctaLabel?.trim()) {
    errors.push("Thiếu câu CTA trên bài (ctaLabel).");
  }
  if (!isL3ChecklistComplete(checklist)) {
    errors.push(
      "Checklist L3 chưa đủ 3 mục: nỗi đau · tool CTA · câu CTA hành động.",
    );
  }

  return { pass: errors.length === 0, errors, checklist };
}
