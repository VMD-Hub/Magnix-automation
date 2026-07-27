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

export const BTR_LEGAL_DISCLAIMER = `*Thông tin mang tính tham khảo theo quy định và công bố chính sách tại thời điểm biên tập; quyết định thuê / đầu tư / nghĩa vụ thuế căn cứ văn bản có hiệu lực và hồ sơ thực tế — không thay thế tư vấn pháp lý hoặc thuế chuyên nghiệp.*`;

export const BTR_SUPPORT_CLOSING = `House X hỗ trợ đối chiếu phương án an cư — thuê dài hạn, mua thương mại hoặc nhà ở xã hội (nếu thuộc đối tượng) — trên cơ sở chính sách công bố và pháp lý từng dự án. Bạn có thể [để lại thông tin tại đây](/lien-he); chuyên gia phản hồi bằng khung phân tích, không ép tiến độ giao dịch.`;
