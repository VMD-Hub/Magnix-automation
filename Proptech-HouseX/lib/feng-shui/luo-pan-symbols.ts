import type { TrigramKey } from "@/lib/feng-shui/bat-trach";

/** 二十四山 — theo chiều kim đồng hồ từ Bắc (子). */
export const TWENTY_FOUR_MOUNTAINS = [
  "子", "癸", "丑", "艮", "寅", "甲", "卯", "乙",
  "辰", "巽", "巳", "丙", "午", "丁", "未", "坤",
  "申", "庚", "酉", "辛", "戌", "乾", "亥", "壬",
] as const;

/** Hán tự 8 quái — dùng la bàn & biểu tượng cung mệnh. */
export const TRIGRAM_HAN: Record<TrigramKey, string> = {
  qian: "乾",
  kun: "坤",
  kan: "坎",
  li: "離",
  zhen: "震",
  xun: "巽",
  gen: "艮",
  dui: "兌",
};

/** 64 quái — chữ rút gọn vòng ngoài la bàn (Thiên Văn). */
export const HEXAGRAM_64_LABELS = [
  "乾", "坤", "屯", "蒙", "需", "訟", "師", "比",
  "畜", "履", "泰", "否", "人", "有", "謙", "豫",
  "隨", "蠱", "臨", "觀", "嗑", "賁", "剝", "復",
  "妄", "畜", "頤", "過", "坎", "離", "咸", "恆",
  "遁", "壯", "晉", "夷", "人", "睽", "蹇", "解",
  "損", "益", "夬", "姤", "萃", "升", "困", "井",
  "革", "鼎", "震", "艮", "漸", "妹", "豐", "旅",
  "巽", "兌", "渙", "節", "孚", "過", "濟", "未",
] as const;

/** Mẫu 6 hào (dưới → trên): true = dương. */
export const HEXAGRAM_64_LINES: readonly (readonly boolean[])[] = [
  [true, true, true, true, true, true],
  [false, false, false, false, false, false],
  [true, false, false, false, true, false],
  [false, true, false, false, false, true],
  [true, true, true, false, true, true],
  [false, true, true, false, true, false],
  [false, false, true, false, false, true],
  [false, true, false, false, false, false],
  [true, true, false, true, true, true],
  [true, true, true, true, true, false],
  [false, true, true, true, true, true],
  [true, false, false, false, false, true],
  [true, true, true, true, false, true],
  [true, true, true, false, true, true],
  [false, false, true, true, true, false],
  [false, true, false, false, true, false],
  [true, false, false, true, false, true],
  [false, true, false, true, false, false],
  [false, false, true, true, false, false],
  [false, false, false, true, false, true],
  [true, false, true, false, false, true],
  [false, true, false, true, true, false],
  [false, false, false, false, false, true],
  [false, true, false, false, false, false],
  [true, false, false, true, true, true],
  [false, false, true, true, true, false],
  [false, true, false, false, false, true],
  [false, false, true, true, true, true],
  [false, true, true, false, false, true],
  [true, false, false, true, false, false],
  [false, true, true, true, false, true],
  [false, true, true, false, true, true],
  [false, false, true, true, true, true],
  [false, true, false, false, true, true],
  [true, true, true, false, false, true],
  [false, false, false, true, false, false],
  [true, true, false, true, false, true],
  [true, false, true, false, true, true],
  [false, true, true, false, true, false],
  [false, false, true, false, true, true],
  [true, true, false, false, false, true],
  [false, true, true, true, false, false],
  [true, true, true, false, true, false],
  [false, true, true, true, true, true],
  [false, false, false, true, true, false],
  [false, false, true, false, false, false],
  [false, true, false, true, false, true],
  [false, false, true, false, true, false],
  [true, true, true, true, false, true],
  [false, true, true, true, false, true],
  [true, false, false, true, false, true],
  [false, false, true, true, false, true],
  [true, true, false, false, true, false],
  [false, true, false, false, false, true],
  [true, false, true, true, false, false],
  [false, true, true, false, false, true],
  [true, true, true, false, false, false],
  [false, true, true, false, true, false],
  [false, false, false, true, true, true],
  [false, true, false, false, true, true],
  [true, true, true, false, true, true],
  [false, true, true, true, true, false],
  [true, false, false, false, true, true],
  [false, false, true, true, true, true],
] as const;

export const EIGHT_TRIGRAMS_ORDER: TrigramKey[] = [
  "kan", "gen", "zhen", "xun", "li", "kun", "dui", "qian",
];
