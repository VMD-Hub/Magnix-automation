/**
 * Ngũ hành / Nạp âm theo năm sinh — dùng chọn màu sơn, phong thủy nội thất.
 */

export type NguHanh = "KIM" | "MOC" | "THUY" | "HOA" | "THO";

export type NguHanhInfo = {
  key: NguHanh;
  name: string;
  ownColors: string[];
  sinhColors: string[];
  avoidColors: string[];
  tips: string;
};

const NAP_AM_HANH: NguHanh[] = [
  "KIM", "KIM", "HOA", "HOA", "MOC", "MOC", "THUY", "THUY", "THO", "THO",
  "KIM", "KIM", "HOA", "HOA", "MOC", "MOC", "THUY", "THUY", "THO", "THO",
  "KIM", "KIM", "HOA", "HOA", "MOC", "MOC", "THUY", "THUY", "THO", "THO",
  "KIM", "KIM", "HOA", "HOA", "MOC", "MOC", "THUY", "THUY", "THO", "THO",
  "KIM", "KIM", "HOA", "HOA", "MOC", "MOC", "THUY", "THUY", "THO", "THO",
  "KIM", "KIM", "HOA", "HOA", "MOC", "MOC", "THUY", "THUY", "THO", "THO",
];

export const NGU_HANH: Record<NguHanh, NguHanhInfo> = {
  KIM: {
    key: "KIM",
    name: "Kim",
    ownColors: ["Trắng", "Xám", "Bạc", "Vàng kim nhạt"],
    sinhColors: ["Vàng đất", "Nâu", "Be", "Kem"],
    avoidColors: ["Đỏ", "Cam", "Hồng đậm", "Tím"],
    tips: "Ngoại thất: trắng xám hoặc vàng nhạt. Nội thất: điểm nhấn vàng kim, tránh đỏ chiếm ưu thế.",
  },
  MOC: {
    key: "MOC",
    name: "Mộc",
    ownColors: ["Xanh lá", "Xanh lục"],
    sinhColors: ["Xanh dương", "Xanh navy", "Đen"],
    avoidColors: ["Trắng", "Xám quá sáng", "Vàng kim đậm"],
    tips: "Ưu tiên xanh lá/xanh dương cho tường phòng khách; trắng dùng làm nền phụ.",
  },
  THUY: {
    key: "THUY",
    name: "Thủy",
    ownColors: ["Đen", "Xanh navy", "Xanh dương đậm"],
    sinhColors: ["Trắng", "Xám", "Bạc", "Ghi sáng"],
    avoidColors: ["Vàng đất", "Nâu đất", "Cam đất"],
    tips: "Kết hợp trắng + xanh dương tạo cảm giác rộng; tránh nâu đất chiếm diện tích lớn.",
  },
  HOA: {
    key: "HOA",
    name: "Hỏa",
    ownColors: ["Đỏ", "Cam", "Hồng", "Tím"],
    sinhColors: ["Xanh lá", "Xanh lục"],
    avoidColors: ["Đen", "Xanh nước quá tối"],
    tips: "Dùng đỏ/cam làm điểm nhấn; nền trung tính (trắng, be) để cân bằng.",
  },
  THO: {
    key: "THO",
    name: "Thổ",
    ownColors: ["Vàng đất", "Nâu", "Be", "Cam đất"],
    sinhColors: ["Đỏ", "Hồng", "Cam"],
    avoidColors: ["Xanh lá đậm", "Xanh lục chiếm ưu thế"],
    tips: "Tông ấm (be, nâu nhạt) hợp cả nội và ngoại thất; thêm điểm đỏ nhẹ cho sinh khí.",
  },
};

const SINH_MAP: Record<NguHanh, NguHanh> = {
  KIM: "THO",
  THO: "HOA",
  HOA: "MOC",
  MOC: "THUY",
  THUY: "KIM",
};

export function nguHanhFromBirthYear(birthYear: number): NguHanh {
  const idx = ((birthYear - 4) % 60 + 60) % 60;
  return NAP_AM_HANH[idx]!;
}

export function nguHanhInfoFromBirthYear(birthYear: number): NguHanhInfo {
  return NGU_HANH[nguHanhFromBirthYear(birthYear)];
}

export function sinhHanh(hanh: NguHanh): NguHanh {
  return SINH_MAP[hanh];
}

export type PaintColorResult = {
  birthYear: number;
  hanh: NguHanhInfo;
  exterior: { recommended: string[]; accent: string[]; avoid: string[] };
  interior: { living: string; bedroom: string; kitchen: string };
};

export function suggestPaintColors(birthYear: number): PaintColorResult {
  const hanh = nguHanhInfoFromBirthYear(birthYear);
  const sinh = NGU_HANH[sinhHanh(hanh.key)];

  return {
    birthYear,
    hanh,
    exterior: {
      recommended: [...hanh.ownColors.slice(0, 2), ...sinh.ownColors.slice(0, 1)],
      accent: sinh.ownColors.slice(0, 2),
      avoid: hanh.avoidColors,
    },
    interior: {
      living: `Tường: ${hanh.ownColors[0]} hoặc ${sinh.ownColors[0]} · Điểm nhấn: ${hanh.ownColors[1] ?? sinh.ownColors[1]}`,
      bedroom: `${sinh.ownColors[0]} hoặc ${hanh.ownColors[0]} — tông dịu, tránh ${hanh.avoidColors[0]}`,
      kitchen: `${hanh.ownColors[1] ?? "Be"} + trắng · tránh ${hanh.avoidColors[0]} chiếm >30% diện tích`,
    },
  };
}

export const PAINT_COLOR_DISCLAIMER =
  "Gợi ý màu theo Ngũ hành/Nạp âm năm sinh — tham khảo phong thủy. Nên cân nhắc ánh sáng, phong cách kiến trúc và sở thích cá nhân.";
