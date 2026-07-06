/** Chuẩn hóa chuỗi lãi suất người dùng nhập: «6,5%», «6.5», «6.» */
export function parsePercentInput(raw: string): number | null {
  const s = raw.replace(/%/g, "").replace(",", ".").trim();
  if (s === "" || s === ".") return null;
  const n = parseFloat(s);
  if (!Number.isFinite(n) || n < 0 || n > 100) return null;
  return n;
}

/** Đang gõ dở phần thập phân — chưa commit số cho tính toán. */
export function isPartialPercentInput(raw: string): boolean {
  const s = raw.replace(/%/g, "").trim();
  return /[.,]$/.test(s);
}

export function formatPercentInput(n: number): string {
  const rounded = Math.round(n * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

/** Lãi suất mặc định công cụ vay — tham chiếu NOXH người dưới 35 tuổi (NHNN 6,5%/năm 5 năm đầu). */
export const DEFAULT_LOAN_ANNUAL_RATE = 6.5;
