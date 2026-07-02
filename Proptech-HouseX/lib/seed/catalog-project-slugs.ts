import { listAllDemoProjects } from "@/lib/preview/demo-projects";
import { GO_LIVE_LANDING_SLUGS, isGoLiveLandingSlug } from "./go-live-landing-slugs";

export { GO_LIVE_LANDING_SLUGS, isGoLiveLandingSlug };

/** Slug NOXH có catalog tĩnh — lấy từ mock registry (Long An, LTK, KDC Chàng Sông, …). */
export function getNoxhCatalogSlugs(): readonly string[] {
  return listAllDemoProjects()
    .filter((p) => p.projectType === "NHA_O_XA_HOI")
    .map((p) => p.slug);
}

export function getCatalogSlugs(
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI",
): readonly string[] {
  if (projectType === "THUONG_MAI") return GO_LIVE_LANDING_SLUGS;
  if (projectType === "NHA_O_XA_HOI") return getNoxhCatalogSlugs();
  return [...GO_LIVE_LANDING_SLUGS, ...getNoxhCatalogSlugs()];
}

export function isCatalogProjectSlug(slug: string): boolean {
  if (isGoLiveLandingSlug(slug)) return true;
  return getNoxhCatalogSlugs().includes(slug);
}
