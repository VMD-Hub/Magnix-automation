/** Dự án mẫu nội bộ — không hiển thị trên web công khai. */
export const INTERNAL_DEMO_PROJECT_SLUGS = [
  "housex-riverside",
  "housex-an-cu",
] as const;

/** Tin đăng seed / HX-DEMO — chỉ dùng dev/staging. */
export const INTERNAL_DEMO_LISTING_CODES = [
  "MX-SEED0001",
  "MX-SEED0002",
  "MX-SEED0003",
] as const;

export function isInternalDemoProjectSlug(slug: string): boolean {
  return (INTERNAL_DEMO_PROJECT_SLUGS as readonly string[]).includes(slug);
}

export function isInternalDemoListingCode(code: string): boolean {
  if ((INTERNAL_DEMO_LISTING_CODES as readonly string[]).includes(code)) {
    return true;
  }
  return code.startsWith("HX-DEMO-");
}
