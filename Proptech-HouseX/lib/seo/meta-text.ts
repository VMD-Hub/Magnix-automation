/**
 * Chuẩn hóa title / description cho SERP (Ahrefs: title ≤60, desc ~70–160).
 * Root layout template = "%s | House X" (+10 ký tự) → phần title trang ≤50.
 */

const BRAND_SUFFIX_RE = /\s*\|\s*House\s*X\s*$/i;

export const SEO_TITLE_SEGMENT_MAX = 50;
export const SEO_DESC_MIN = 70;
export const SEO_DESC_MAX = 160;
export const SEO_DESC_TARGET = 145;

export function stripSeoBrandSuffix(raw: string): string {
  return String(raw ?? "")
    .replace(BRAND_SUFFIX_RE, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWord(text: string, max: number): string {
  const chars = [...text];
  if (chars.length <= max) return text;
  const slice = chars.slice(0, max).join("");
  const cut = slice.lastIndexOf(" ");
  const base = (cut >= Math.floor(max * 0.6) ? slice.slice(0, cut) : slice).trim();
  return base.replace(/[.,;:–—-]+$/, "").trim();
}

/** Title segment trước template brand — max 50 codepoints. */
export function normalizeSeoTitle(raw: string, max = SEO_TITLE_SEGMENT_MAX): string {
  const cleaned = stripSeoBrandSuffix(raw);
  if (!cleaned) return cleaned;
  return truncateAtWord(cleaned, max);
}

/** Meta description 70–160; cắt ở ranh giới từ nếu dài. */
export function normalizeSeoDescription(
  raw: string,
  opts?: { min?: number; max?: number },
): string {
  const min = opts?.min ?? SEO_DESC_MIN;
  const max = opts?.max ?? SEO_DESC_MAX;
  let text = String(raw ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return text;
  if ([...text].length > max) {
    text = truncateAtWord(text, max);
  }
  // Không pad tự động nếu quá ngắn — caller nên viết lại copy.
  void min;
  return text;
}
