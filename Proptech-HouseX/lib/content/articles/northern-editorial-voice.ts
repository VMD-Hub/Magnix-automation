/**
 * Giọng biên tập Vùng Thủ đô / miền Bắc — tách biệt tone HCMC.
 * Độc giả Hà Nội: quan tâm chính trị – quy hoạch – hạ tầng; cần chiều sâu chuyên gia, không nội dung hời hợt.
 */

/** Thuật ngữ ưu tiên (Bắc) — tránh từ miền Nam trong thân bài HN. */
export const NORTHERN_LEXICON_PREFERRED = [
  "ô đất",
  "thửa đất",
  "mặt đường",
  "lòng đường",
  "vỉa hè",
  "nhà chung cư",
  "căn hộ",
  "phòng khách ấm cúng",
  "phòng khách sang trọng",
  "sổ đỏ",
  "pháp lý an toàn",
  "đồ án quy hoạch",
  "đô thị vệ tinh",
  "đô thị đối trọng",
  "hành lang kinh tế",
  "phân kỳ đầu tư",
] as const;

/** Cụm từ miền Nam / sáo bán hàng / meta biên tập — không dùng trong series Vùng Thủ đô. */
export const NORTHERN_LEXICON_AVOID = [
  /\blộ giới\b/i,
  /\bnền đất\b/i,
  /\bmặt tiền\b/i,
  /\bofficetel\b/i,
  /\bcam kết lợi nhuận\b/i,
  /\bvị trí kim cương\b/i,
  /\bphễu\b/i,
  /\bgiọng điềm tĩnh\b/i,
  /\bphù hợp người mua miền Bắc\b/i,
  /\bbài toán tài chính trung thực\b/i,
  /\bmỏ vàng\b/i,
  /\bsóng đầu tư\b/i,
  /\bđón sóng\b/i,
] as const;

export const NORTHERN_VOICE_RULES = [
  "Tone chuyên gia đô thị / quy hoạch: trang trọng, chặt chẽ, không khẩu hiệu bán hàng.",
  "Ưu tiên chiều sâu: thể chế (Quyết định/QHC), cấu trúc không gian, tiến độ hạ tầng công bố, phân vai vệ tinh–đối trọng.",
  "Người Hà Nội đọc chính trị – quy hoạch – hạ tầng trước 'xu hướng thị trường'; lập luận theo nhân – quả quy hoạch, không checklist marketing.",
  "Không cam kết lợi nhuận / biên độ tăng giá %; không sáo 'kim cương', 'mỏ vàng', 'đón sóng'.",
  "Không lộ meta biên tập ra bài (phễu, giọng điềm tĩnh, phù hợp người mua miền Bắc).",
  "Ba lớp đọc nội bộ (không gọi là phễu trên bài): quy hoạch–thể chế → dịch chuyển nhu cầu/không gian → thẩm định dự án–pháp lý + CTA /lien-he.",
  "Phụ cận: sổ đỏ / pháp lý an toàn, thửa đất – nhà phố mặt đường; nội đô: cộng đồng cư dân, căn vuông, hướng ban công khi phù hợp.",
  "Interlink cùng hành lang; đối chiếu trục khác chỉ khi nêu rõ tên và lý do phân biệt.",
] as const;

export function getNorthernLexiconIssues(body: string): string[] {
  const issues: string[] = [];
  for (const pattern of NORTHERN_LEXICON_AVOID) {
    if (pattern.test(body)) issues.push(`SOUTH_LEXICON:${pattern.source}`);
  }
  return issues;
}

export function assertNorthernEditorialBody(body: string, slug: string): void {
  for (const pattern of NORTHERN_LEXICON_AVOID) {
    if (pattern.test(body)) {
      throw new Error(
        `${slug}: northern voice forbids pattern ${pattern.source}`,
      );
    }
  }
}

export const NORTHERN_SUPPORT_CLOSING = `House X hỗ trợ đối chiếu phương án an cư và hồ sơ nhà ở xã hội (nếu thuộc đối tượng) theo từng hành lang Vùng Thủ đô — trên cơ sở quy hoạch công bố, tiến độ hạ tầng và pháp lý từng dự án. Bạn có thể [để lại thông tin tại đây](/lien-he); chuyên gia sẽ phản hồi bằng khung phân tích, không ép tiến độ giao dịch.`;
