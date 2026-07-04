/** Kiểu dữ liệu chung — Điều khoản & phụ lục song ngữ. */

export type BilingualLine = { vi: string; en: string };

export type BilingualSubsection = {
  id: string;
  headingVi: string;
  headingEn: string;
  paragraphs?: readonly BilingualLine[];
  /** Đoạn sau bullets/numbered — dùng khi cần intro + list + kết luận. */
  trailingParagraphs?: readonly BilingualLine[];
  bullets?: readonly BilingualLine[];
  numbered?: readonly BilingualLine[];
};

export type LegalAppendixDoc = {
  metaTitle: string;
  metaDescription: string;
  effectiveDate: string;
  effectiveDateEn: string;
  version: string;
  titleVi: string;
  titleEn: string;
  parentLabelVi: string;
  parentLabelEn: string;
  parentHref: string;
  subsections: readonly BilingualSubsection[];
};
