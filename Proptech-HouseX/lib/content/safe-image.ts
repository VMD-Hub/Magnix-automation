/**
 * Allowlist ảnh an toàn — dùng CHUNG cho landing dự án và ảnh bìa bài viết.
 *
 * Bài học từ sự cố DTA Happy Home: hotlink ảnh bên thứ ba (website CĐT) rất dễ gãy
 * khi họ đổi đường dẫn / chặn hotlink / sập server → ảnh "mất" trên site.
 * Vì vậy chỉ 2 loại URL được coi là AN TOÀN:
 *   1) Đường dẫn /public local (bắt đầu bằng "/") — versioned trong repo.
 *   2) Host nằm trong SAFE_IMAGE_HOSTS — ảnh stock đã host ổn định.
 * Mọi URL khác đều bị coi là rủi ro và sẽ được thay bằng ảnh dự phòng an toàn.
 */
export const SAFE_IMAGE_HOSTS = new Set<string>(["images.unsplash.com"]);

export function isSafeImageUrl(url: string | undefined | null): boolean {
  if (!url || !url.trim()) return false;
  if (url.startsWith("/")) return true;
  try {
    return SAFE_IMAGE_HOSTS.has(new URL(url).host);
  } catch {
    return false;
  }
}

/** Ảnh dự phòng local dùng chung khi một ảnh (bìa/landing) không tải được. */
export const IMAGE_FALLBACK = "/images/hero/hcmc-skyline-river-day.webp";

/** Ảnh bìa dự phòng khi cover bài viết trỏ nguồn ngoài không an toàn. */
export const ARTICLE_COVER_FALLBACK = IMAGE_FALLBACK;

/**
 * Chuẩn hóa URL ảnh bìa bài viết: an toàn thì giữ nguyên, không an toàn thì
 * thay bằng ảnh dự phòng. Áp dụng ở lớp hiển thị để KHÔNG bao giờ hiện ảnh vỡ.
 */
export function ensureArticleCoverUrl(
  url: string | null | undefined,
): string | null {
  if (url == null) return null;
  return isSafeImageUrl(url) ? url : ARTICLE_COVER_FALLBACK;
}
