/** Parse chuỗi người dùng gõ — chỉ giữ chữ số. */
export function parseVndInput(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/** Hiển thị có nhóm nghìn — dùng khi blur / không focus. */
export function formatVndInputDisplay(n: number): string {
  if (!n || n <= 0) return "";
  return n.toLocaleString("vi-VN");
}

/** Parse % thập phân — cho phép gõ dở «7.» */
export function parseDecimalInput(raw: string): number | null {
  const s = raw.replace(",", ".").trim();
  if (s === "" || s === ".") return null;
  const n = parseFloat(s);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function isPartialDecimalInput(raw: string): boolean {
  const s = raw.replace(",", ".").trim();
  return /^\d*[.,]$/.test(s);
}
