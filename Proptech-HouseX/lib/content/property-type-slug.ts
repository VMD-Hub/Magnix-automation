/** Slug URL (footer, filter) ↔ giá trị DB `Listing.propertyType`. */
const SLUG_TO_DB: Record<string, string> = {
  "can-ho": "can_ho",
  "can-ho-dich-vu": "can_ho_dich_vu",
  "phong-tro": "phong_tro",
  "nha-pho": "nha_pho",
  "biet-thu": "biet_thu",
  "dat-nen": "dat_nen",
  "van-phong": "van_phong",
  shophouse: "shophouse",
};

const DB_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_DB).map(([slug, db]) => [db, slug]),
) as Record<string, string>;

export function propertyTypeFromSlug(
  slug: string | undefined | null,
): string | undefined {
  if (!slug?.trim()) return undefined;
  const key = slug.trim().toLowerCase();
  return SLUG_TO_DB[key] ?? (key.includes("_") ? key : undefined);
}

export function propertyTypeToSlug(dbValue: string): string {
  return DB_TO_SLUG[dbValue] ?? dbValue.replace(/_/g, "-");
}

export const PROPERTY_TYPE_FILTER_OPTIONS = [
  { slug: "can-ho", label: "Căn hộ" },
  { slug: "nha-pho", label: "Nhà phố" },
  { slug: "biet-thu", label: "Biệt thự" },
  { slug: "dat-nen", label: "Đất nền" },
  { slug: "shophouse", label: "Shophouse" },
  { slug: "van-phong", label: "Văn phòng" },
] as const;

/** Loại hình phổ biến khi cho thuê — gồm CHDV & phòng trọ. */
export const RENT_PROPERTY_TYPE_FILTER_OPTIONS = [
  { slug: "can-ho", label: "Căn hộ" },
  { slug: "can-ho-dich-vu", label: "Căn hộ dịch vụ" },
  { slug: "phong-tro", label: "Phòng trọ" },
  { slug: "nha-pho", label: "Nhà phố" },
  { slug: "biet-thu", label: "Biệt thự" },
  { slug: "shophouse", label: "Shophouse" },
  { slug: "van-phong", label: "Văn phòng" },
  { slug: "dat-nen", label: "Đất nền" },
] as const;
