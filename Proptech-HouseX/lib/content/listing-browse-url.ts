/**
 * Build listing browse query strings consistently for href + canonical.
 * Always use URLSearchParams (spaces → `+`) so Ahrefs matches inlinks to canonical.
 */

export type ListingBrowseUrlParams = {
  province?: string;
  district?: string;
  propertyType?: string;
  page?: number | string;
};

/** Districts linked from site footer — keep in sync with SEO landings. */
export const FOOTER_SALE_DISTRICTS = [
  "Quận 1",
  "Quận 2",
  "Quận 7",
  "Quận 9",
  "Bình Thạnh",
  "Thủ Đức",
] as const;

export function listingBrowseQuery(params: ListingBrowseUrlParams): string {
  const q = new URLSearchParams();
  if (params.province) q.set("province", params.province);
  if (params.district) q.set("district", params.district);
  if (params.propertyType) q.set("propertyType", params.propertyType);
  const page =
    typeof params.page === "string" ? Number(params.page) : params.page;
  if (page && page > 1) q.set("page", String(page));
  return q.toString();
}

export function listingBrowsePath(
  base: "/mua-ban" | "/cho-thue",
  params: ListingBrowseUrlParams = {},
): string {
  const qs = listingBrowseQuery(params);
  return qs ? `${base}?${qs}` : base;
}

export function listingBrowseCanonicalUrl(
  base: "/mua-ban" | "/cho-thue",
  params: ListingBrowseUrlParams,
  siteUrl: string | undefined,
): string | undefined {
  if (!siteUrl) return undefined;
  return `${siteUrl.replace(/\/$/, "")}${listingBrowsePath(base, params)}`;
}
