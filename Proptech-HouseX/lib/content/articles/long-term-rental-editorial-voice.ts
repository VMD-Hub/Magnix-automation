/**
 * Giọng biên tập silo Nhà ở cho thuê dài hạn (BTR) — Empathetic Expert.
 * GENERAL_POLICY: tách tone marketing NOXH / corridor hype.
 */

export const BTR_LEXICON_PREFERRED = [
  "an cư lạc nghiệp",
  "tích sản dài hạn",
  "giá trị thực",
  "bảo toàn dòng vốn",
  "pháp lý minh bạch",
  "nhà ở cho thuê dài hạn",
  "hợp đồng thuê bền vững",
  "Build-to-Rent",
] as const;

export const BTR_LEXICON_AVOID = [
  /\bmỏ vàng\b/i,
  /\bđón sóng\b/i,
  /\bsóng đầu tư\b/i,
  /\bcam kết lợi nhuận\b/i,
  /\bsinh lời vô hạn\b/i,
  /\bvị trí kim cương\b/i,
  /\bvị trí độc tôn\b/i,
  /\bphễu\b/i,
  /\bsiêu hot\b/i,
  /\bX2\b/,
  /\bX3\b/,
  /\bcơ hội ngàn năm\b/i,
  /\bđừng mơ mua nhà\b/i,
] as const;

export const BTR_VOICE_RULES = [
  "Empathetic Expert: uy tín thể chế + đứng về phía độc giả.",
  "Nhóm policy-macro (1–3, 7): khách quan, trích dẫn luật/chỉ đạo; phân biệt dự thảo vs hiệu lực.",
  "Nhóm mindset (4–6): đồng cảm pain point — không sỉ nhục người muốn mua nhà.",
  "Nhóm cashflow (8–12): số liệu định tính; không bịa yield % / cam kết lợi nhuận.",
  "Không lộ meta 'phễu' trên bài; interlink cluster → pillar chính sách.",
  "Soft-link NOXH chỉ khi so sánh khả năng chi trả — không đổi silo sang hồ sơ NOXH.",
] as const;

export function getBtrLexiconIssues(body: string): string[] {
  const issues: string[] = [];
  for (const pattern of BTR_LEXICON_AVOID) {
    if (pattern.test(body)) issues.push(`BTR_LEXICON:${pattern.source}`);
  }
  return issues;
}

export function assertBtrEditorialBody(body: string, slug: string): void {
  for (const pattern of BTR_LEXICON_AVOID) {
    if (pattern.test(body)) {
      throw new Error(`${slug}: BTR voice forbids pattern ${pattern.source}`);
    }
  }
}

export const BTR_LEGAL_DISCLAIMER = `*Bài mang tính định hướng theo quy định công bố tại thời điểm biên tập. Mức thuế / cách kê khai cụ thể phụ thuộc hồ sơ của bạn — nên đối chiếu văn bản hiệu lực hoặc hỏi Chi cục Thuế / kế toán trước khi nộp.*`;

export const BTR_SUPPORT_CLOSING = `## Bạn muốn ước tính dòng tiền trước khi hỏi kế toán?

Dùng [công cụ dòng tiền cho thuê](/cong-cu/dong-tien-cho-thue) để tự điền số thuê, phí và thuế ước tính. Nếu cần người hỗ trợ thủ tục, để lại liên hệ tại [trang Liên hệ](/lien-he) hoặc form trên [hub cho thuê](/cho-thue) — Minh An / House X nối bạn với đối tác khi bạn đồng ý, không ép giao dịch.`;

