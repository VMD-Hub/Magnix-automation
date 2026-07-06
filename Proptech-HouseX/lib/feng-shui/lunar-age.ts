/** Tuổi mụ (âm lịch) và chi năm — dùng chung các công cụ phong thủy. */

export const CHI_NAMES = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
] as const;

export type ChiIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

/** Chi năm (Địa chi) từ năm dương lịch — mốc Tý = 1984, 1996… */
export function chiIndexFromYear(year: number): ChiIndex {
  const idx = ((year - 4) % 12 + 12) % 12;
  return idx as ChiIndex;
}

export function chiNameFromYear(year: number): string {
  return CHI_NAMES[chiIndexFromYear(year)];
}

/** Tuổi mụ = năm làm việc − năm sinh + 1 (theo phong thủy dân gian VN). */
export function calcLunarAge(birthYear: number, actionYear: number): number {
  return actionYear - birthYear + 1;
}
