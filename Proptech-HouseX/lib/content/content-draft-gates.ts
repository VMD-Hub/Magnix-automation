/**
 * L3 gate cho content drafts — cùng CTA NƠXH + checklist 3 câu.
 */

import {
  getNoxhCtaTool,
  isL3ChecklistComplete,
  isNoxhCtaToolId,
  parseL3Checklist,
  type L3ContentChecklist,
} from "@/lib/content/noxh-cta-tools";

export type ContentDraftGateInput = {
  title?: string | null;
  hookLine?: string | null;
  artifactMarkdown?: string | null;
  ctaToolId?: string | null;
  ctaLabel?: string | null;
  l3Checklist?: unknown;
};

export type ContentDraftGateResult = {
  pass: boolean;
  errors: string[];
  checklist: L3ContentChecklist;
};

export function assertContentDraftReadyForL3(
  input: ContentDraftGateInput,
): ContentDraftGateResult {
  const errors: string[] = [];
  const checklist = parseL3Checklist(input.l3Checklist);

  if (!input.title?.trim()) errors.push("Thiếu tiêu đề draft.");
  if (!input.hookLine?.trim() && !input.artifactMarkdown?.trim()) {
    errors.push("Thiếu hook_line hoặc artifact_markdown.");
  }
  if (!isNoxhCtaToolId(input.ctaToolId)) {
    errors.push(
      "Bắt buộc chọn CTA tool: noxh-check hoặc noxh-loan-quick trước L3.",
    );
  } else if (!getNoxhCtaTool(input.ctaToolId)) {
    errors.push("ctaToolId không thuộc allowlist NƠXH.");
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
