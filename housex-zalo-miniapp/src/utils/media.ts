import { HOUSEX_API_BASE } from "../config";

/** Absolute asset URL for Mini App (hero images often start with /). */
export function mediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${HOUSEX_API_BASE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function formatVnd(amount: string | number | null | undefined): string | null {
  if (amount == null || amount === "") return null;
  const n = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 1_000_000_000) {
    const ty = n / 1_000_000_000;
    return `${ty % 1 === 0 ? ty.toFixed(0) : ty.toFixed(1)} tỷ`;
  }
  if (n >= 1_000_000) {
    return `${Math.round(n / 1_000_000)} triệu`;
  }
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}
