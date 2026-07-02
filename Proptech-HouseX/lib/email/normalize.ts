/** Chuẩn hoá email trước khi lưu/so sánh. */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}
