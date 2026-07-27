/**
 * Giọng biên tập Vùng Thủ đô / miền Bắc — tách biệt tone HCMC.
 * Dùng khi viết series growth corridors Hà Nội.
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
] as const;

/** Cụm từ miền Nam — không dùng trong series Vùng Thủ đô. */
export const NORTHERN_LEXICON_AVOID = [
  /\blộ giới\b/i,
  /\bnền đất\b/i,
  /\bmặt tiền\b/i,
  /\bofficetel\b/i,
  /\bcam kết lợi nhuận\b/i,
  /\bvị trí kim cương\b/i,
] as const;

export const NORTHERN_VOICE_RULES = [
  "Tone điềm tĩnh, lập luận logic; số liệu phút di chuyển và tiến độ theo tháng khi có nguồn.",
  "Không cam kết lợi nhuận / biên độ tăng giá %; không sáo 'kim cương'.",
  "Bài thực tế: ~40% vị trí–kết nối–không gian sống; ~30% giá/so sánh định tính; ~30% tài chính + CTA /lien-he.",
  "Phụ cận: nhấn sổ đỏ / pháp lý an toàn, thửa đất – nhà phố mặt đường.",
  "Nội đô / cao cấp: cộng đồng cư dân, căn vuông vức, hướng ban công (Đông Nam/Nam) khi phù hợp.",
  "Interlink phễu trong cùng trục: Vĩ mô → Tiềm năng → Thực tế.",
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

export const NORTHERN_SUPPORT_CLOSING = `House X hỗ trợ rà soát phương án an cư và hồ sơ nhà ở xã hội (nếu thuộc đối tượng) theo từng khu vực Vùng Thủ đô — bạn [để lại thông tin tại đây](/lien-he), chuyên gia sẽ đồng hành với số liệu thực tế, không ép tiến độ.`;
