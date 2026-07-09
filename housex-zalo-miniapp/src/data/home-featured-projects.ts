import type { UserLane } from "@/services/lane";

/** Dự án pin theo lane — thứ tự hiển thị trên Home. */
export const NOXH_FEATURED_SLUGS = [
  "dta-happy-home-nhon-trach",
  "thu-thiem-green-house-thu-duc",
] as const;

export const CCTM_FEATURED_SLUGS = [
  "solena-green-town-binh-tan",
] as const;

export function featuredSlugsForLane(lane: UserLane): readonly string[] {
  return lane === "noxh" ? NOXH_FEATURED_SLUGS : CCTM_FEATURED_SLUGS;
}

export function sortProjectsFeaturedFirst<T extends { slug: string }>(
  items: T[],
  featured: readonly string[],
): T[] {
  const bySlug = new Map(items.map((p) => [p.slug, p]));
  const pinned = featured
    .map((slug) => bySlug.get(slug))
    .filter((p): p is T => p != null);
  const featuredSet = new Set<string>(featured);
  const rest = items.filter((p) => !featuredSet.has(p.slug));
  return [...pinned, ...rest];
}
