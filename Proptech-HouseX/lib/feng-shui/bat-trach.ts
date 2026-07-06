/**
 * Phong thủy Bát trạch — tính cung phi (quái số) và sơ đồ 8 hướng Cát/Hung.
 *
 * Thuật toán thuần, chạy client-side, không lưu PII. Chỉ cần năm sinh (âm lịch)
 * và giới tính. Kết quả mang tính tham khảo văn hóa — xem `BAT_TRACH_DISCLAIMER`.
 */

export type Gender = "MALE" | "FEMALE";

/** 8 quái (cung phi) — key theo pinyin để tránh nhầm Càn (qian) / Cấn (gen). */
export type TrigramKey =
  | "kham"
  | "gen"
  | "zhen"
  | "xun"
  | "li"
  | "kun"
  | "dui"
  | "qian";

/** 8 hướng địa bàn. */
export type DirectionKey = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

/** 8 du niên (8 hướng Cát/Hung của Bát trạch). */
export type StarKey =
  | "SINH_KHI"
  | "THIEN_Y"
  | "DIEN_NIEN"
  | "PHUC_VI"
  | "HOA_HAI"
  | "LUC_SAT"
  | "NGU_QUY"
  | "TUYET_MENH";

export type MenhGroup = "DONG" | "TAY";

export type Trigram = {
  key: TrigramKey;
  /** Tên cung tiếng Việt. */
  name: string;
  /** Hành ngũ hành. */
  element: string;
  /** Hướng địa bàn của quái (Hậu Thiên Bát Quái). */
  direction: DirectionKey;
  group: MenhGroup;
  /** Quái số phổ biến (Khôn = 2, không có số 5). */
  kua: number;
};

export type DirectionInfo = {
  key: DirectionKey;
  /** Tên hướng đầy đủ. */
  name: string;
  /** Viết tắt hiển thị la bàn. */
  short: string;
  /** Góc la bàn tâm hướng (độ). */
  degree: number;
};

export type StarInfo = {
  key: StarKey;
  name: string;
  auspicious: boolean;
  /** Xếp hạng: 4 = đại cát / đại hung nhất … 1 = nhẹ nhất. */
  rank: 1 | 2 | 3 | 4;
  /** Ý nghĩa ngắn. */
  meaning: string;
  /** Gợi ý bố trí không gian. */
  usage: string;
};

/** Ô kết quả cho một hướng. */
export type DirectionResult = {
  direction: DirectionInfo;
  star: StarInfo;
};

export type BatTrachResult = {
  birthYear: number;
  gender: Gender;
  /** Quái số gốc trước khi quy đổi số 5. */
  rawKua: number;
  trigram: Trigram;
  group: MenhGroup;
  /** 8 hướng theo thứ tự la bàn N → NW. */
  directions: DirectionResult[];
  goodDirections: DirectionResult[];
  badDirections: DirectionResult[];
  /** 4 hướng tốt xếp theo mức cát giảm dần. */
  bestDirection: DirectionResult;
};

export const TRIGRAMS: Record<TrigramKey, Trigram> = {
  kham: { key: "kham", name: "Khảm", element: "Thủy", direction: "N", group: "DONG", kua: 1 },
  kun: { key: "kun", name: "Khôn", element: "Thổ", direction: "SW", group: "TAY", kua: 2 },
  zhen: { key: "zhen", name: "Chấn", element: "Mộc", direction: "E", group: "DONG", kua: 3 },
  xun: { key: "xun", name: "Tốn", element: "Mộc", direction: "SE", group: "DONG", kua: 4 },
  qian: { key: "qian", name: "Càn", element: "Kim", direction: "NW", group: "TAY", kua: 6 },
  dui: { key: "dui", name: "Đoài", element: "Kim", direction: "W", group: "TAY", kua: 7 },
  gen: { key: "gen", name: "Cấn", element: "Thổ", direction: "NE", group: "TAY", kua: 8 },
  li: { key: "li", name: "Ly", element: "Hỏa", direction: "S", group: "DONG", kua: 9 },
};

export const DIRECTIONS: Record<DirectionKey, DirectionInfo> = {
  N: { key: "N", name: "Bắc", short: "B", degree: 0 },
  NE: { key: "NE", name: "Đông Bắc", short: "ĐB", degree: 45 },
  E: { key: "E", name: "Đông", short: "Đ", degree: 90 },
  SE: { key: "SE", name: "Đông Nam", short: "ĐN", degree: 135 },
  S: { key: "S", name: "Nam", short: "N", degree: 180 },
  SW: { key: "SW", name: "Tây Nam", short: "TN", degree: 225 },
  W: { key: "W", name: "Tây", short: "T", degree: 270 },
  NW: { key: "NW", name: "Tây Bắc", short: "TB", degree: 315 },
};

/** Thứ tự hiển thị la bàn (theo chiều kim đồng hồ từ Bắc). */
export const DIRECTION_ORDER: DirectionKey[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export const STARS: Record<StarKey, StarInfo> = {
  SINH_KHI: {
    key: "SINH_KHI",
    name: "Sinh Khí",
    auspicious: true,
    rank: 4,
    meaning: "Đại cát — tài lộc, thăng tiến, danh tiếng, sinh con quý tử.",
    usage: "Ưu tiên cho cửa chính, hướng làm việc, phòng khách.",
  },
  THIEN_Y: {
    key: "THIEN_Y",
    name: "Thiên Y",
    auspicious: true,
    rank: 3,
    meaning: "Đại cát — sức khỏe, trường thọ, gặp quý nhân giúp đỡ.",
    usage: "Tốt cho hướng giường ngủ, phòng người lớn tuổi, hướng bếp.",
  },
  DIEN_NIEN: {
    key: "DIEN_NIEN",
    name: "Diên Niên",
    auspicious: true,
    rank: 2,
    meaning: "Cát — hòa thuận, tình duyên, hôn nhân và các mối quan hệ.",
    usage: "Hợp phòng ngủ vợ chồng, bàn tiếp khách, phòng họp.",
  },
  PHUC_VI: {
    key: "PHUC_VI",
    name: "Phục Vị",
    auspicious: true,
    rank: 1,
    meaning: "Tiểu cát — ổn định, bình an, thuận lợi thi cử, học hành.",
    usage: "Tốt cho bàn thờ, bàn học, phòng làm việc cần tập trung.",
  },
  HOA_HAI: {
    key: "HOA_HAI",
    name: "Họa Hại",
    auspicious: false,
    rank: 1,
    meaning: "Hung nhẹ — thị phi, tiểu nhân, hao tài vặt, trắc trở công việc.",
    usage: "Nên đặt nhà vệ sinh, nhà kho, phòng phụ.",
  },
  LUC_SAT: {
    key: "LUC_SAT",
    name: "Lục Sát",
    auspicious: false,
    rank: 2,
    meaning: "Hung — cãi vã, kiện tụng, tai nạn, xáo trộn tình cảm.",
    usage: "Có thể đặt bếp (tọa hung hướng cát), nhà vệ sinh.",
  },
  NGU_QUY: {
    key: "NGU_QUY",
    name: "Ngũ Quỷ",
    auspicious: false,
    rank: 3,
    meaning: "Đại hung — mất của, mất việc, thị phi, tai họa bất ngờ.",
    usage: "Nên đặt nhà vệ sinh, nhà kho, tránh cửa chính và giường.",
  },
  TUYET_MENH: {
    key: "TUYET_MENH",
    name: "Tuyệt Mệnh",
    auspicious: false,
    rank: 4,
    meaning: "Đại hung nhất — bệnh tật, hao người tốn của, tuyệt tự.",
    usage: "Đặt nhà vệ sinh, nhà kho; tuyệt đối tránh cửa chính, giường, bàn thờ.",
  },
};

/**
 * Bảng du niên định nghĩa theo cặp quái tương hỗ (đối xứng).
 * Nếu với người quái A, hướng B là sao S thì với người quái B, hướng A cũng là S.
 */
const STAR_PAIRS: Record<StarKey, [TrigramKey, TrigramKey][]> = {
  SINH_KHI: [["qian", "dui"], ["kun", "gen"], ["zhen", "li"], ["xun", "kham"]],
  THIEN_Y: [["qian", "gen"], ["dui", "kun"], ["zhen", "kham"], ["xun", "li"]],
  DIEN_NIEN: [["qian", "kun"], ["dui", "gen"], ["zhen", "xun"], ["li", "kham"]],
  HOA_HAI: [["qian", "xun"], ["dui", "kham"], ["gen", "zhen"], ["kun", "li"]],
  LUC_SAT: [["qian", "kham"], ["dui", "xun"], ["gen", "li"], ["kun", "zhen"]],
  NGU_QUY: [["qian", "zhen"], ["dui", "li"], ["gen", "kham"], ["kun", "xun"]],
  TUYET_MENH: [["qian", "li"], ["dui", "zhen"], ["gen", "xun"], ["kun", "kham"]],
  PHUC_VI: [],
};

const STAR_LOOKUP: Map<string, StarKey> = (() => {
  const map = new Map<string, StarKey>();
  (Object.keys(STAR_PAIRS) as StarKey[]).forEach((star) => {
    STAR_PAIRS[star].forEach(([a, b]) => {
      map.set(`${a}|${b}`, star);
      map.set(`${b}|${a}`, star);
    });
  });
  return map;
})();

/** Sao du niên khi người cung `self` xét hướng của quái `other`. */
export function starFor(self: TrigramKey, other: TrigramKey): StarKey {
  if (self === other) return "PHUC_VI";
  const found = STAR_LOOKUP.get(`${self}|${other}`);
  if (!found) {
    throw new Error(`Không xác định được du niên cho cặp ${self}-${other}`);
  }
  return found;
}

/** Cộng dồn các chữ số về 1 chữ số (digital root, giữ 9). */
function reduceToSingleDigit(n: number): number {
  let x = Math.abs(n);
  while (x >= 10) {
    x = String(x)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return x;
}

/**
 * Tính quái số (cung phi) theo năm sinh âm lịch và giới tính.
 * @returns { kua, rawKua } — rawKua giữ số 5 trước khi quy đổi.
 */
export function calcKua(birthYear: number, gender: Gender): { kua: number; rawKua: number } {
  const root = reduceToSingleDigit(birthYear);

  let value: number;
  if (gender === "MALE") {
    value = birthYear >= 2000 ? 9 - root : 10 - root;
    if (value <= 0) value += 9;
  } else {
    value = birthYear >= 2000 ? 6 + root : 5 + root;
  }

  const rawKua = reduceToSingleDigit(value) || 9;

  let kua = rawKua;
  if (kua === 5) {
    kua = gender === "MALE" ? 2 : 8; // Nam ký cung Khôn, Nữ ký cung Cấn.
  }
  return { kua, rawKua };
}

const KUA_TO_TRIGRAM: Record<number, TrigramKey> = {
  1: "kham",
  2: "kun",
  3: "zhen",
  4: "xun",
  6: "qian",
  7: "dui",
  8: "gen",
  9: "li",
};

export function trigramFromKua(kua: number): Trigram {
  const key = KUA_TO_TRIGRAM[kua];
  if (!key) throw new Error(`Quái số không hợp lệ: ${kua}`);
  return TRIGRAMS[key];
}

/** Trả về quái ứng với một hướng địa bàn. */
function trigramForDirection(direction: DirectionKey): Trigram {
  const key = (Object.keys(TRIGRAMS) as TrigramKey[]).find(
    (k) => TRIGRAMS[k].direction === direction,
  );
  return TRIGRAMS[key as TrigramKey];
}

/** Tính toàn bộ kết quả Bát trạch. */
export function calcBatTrach(birthYear: number, gender: Gender): BatTrachResult {
  const { kua, rawKua } = calcKua(birthYear, gender);
  const trigram = trigramFromKua(kua);

  const directions: DirectionResult[] = DIRECTION_ORDER.map((dirKey) => {
    const other = trigramForDirection(dirKey);
    const star = STARS[starFor(trigram.key, other.key)];
    return { direction: DIRECTIONS[dirKey], star };
  });

  const goodDirections = directions
    .filter((d) => d.star.auspicious)
    .sort((a, b) => b.star.rank - a.star.rank);
  const badDirections = directions
    .filter((d) => !d.star.auspicious)
    .sort((a, b) => b.star.rank - a.star.rank);

  return {
    birthYear,
    gender,
    rawKua,
    trigram,
    group: trigram.group,
    directions,
    goodDirections,
    badDirections,
    bestDirection: goodDirections[0]!,
  };
}

export function menhGroupLabel(group: MenhGroup): string {
  return group === "DONG" ? "Đông tứ mệnh" : "Tây tứ mệnh";
}

export function trachGroupLabel(group: MenhGroup): string {
  return group === "DONG" ? "Đông tứ trạch" : "Tây tứ trạch";
}

/** 4 hướng tốt của mỗi nhóm (dùng cho mô tả tổng quan). */
export function groupGoodDirectionNames(group: MenhGroup): string[] {
  const keys: DirectionKey[] =
    group === "DONG" ? ["N", "S", "E", "SE"] : ["W", "SW", "NW", "NE"];
  return keys.map((k) => DIRECTIONS[k].name);
}

export const BAT_TRACH_DISCLAIMER =
  "Kết quả dựa trên phương pháp Bát trạch minh cảnh (cung phi bát trạch) — mang tính tham khảo văn hóa, tín ngưỡng, không phải cơ sở khoa học. Nên kết hợp với công năng, ánh sáng, thông gió và tư vấn chuyên gia khi quyết định.";

export const GENDER_LABEL: Record<Gender, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
};
