/** Tên hiển thị trên bảng trúng — ẩn một phần họ tên. */
export function maskWinnerDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Khách hàng";
  if (parts.length === 1) {
    const p = parts[0]!;
    return p.length <= 2 ? `${p[0]}***` : `${p.slice(0, 2)}***`;
  }
  const last = parts[parts.length - 1]!;
  const first = parts[0]!;
  const maskedLast =
    last.length <= 1 ? `${last[0]}***` : `${last[0]}${"*".repeat(Math.min(3, last.length - 1))}`;
  return `${first} ${maskedLast}`;
}
