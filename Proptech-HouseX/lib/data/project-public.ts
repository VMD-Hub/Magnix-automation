import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import { getProjectBySlugOrId } from "@/lib/data/project";
import {
  getDemoListingsForSlug,
  getDemoProjectBySlug,
} from "@/lib/preview/demo-projects";

export type PublicProjectResult = {
  project: ProjectDetail;
  marketplaceListings: ProjectLandingListingCard[];
  source: "db" | "demo";
};

/** Trang công khai — DB trước, fallback demo khi chưa seed / Postgres offline. */
export async function getPublicProjectBySlug(
  slug: string,
): Promise<PublicProjectResult | null> {
  try {
    const fromDb = await getProjectBySlugOrId(slug);
    if (fromDb) {
      return { project: fromDb, marketplaceListings: [], source: "db" };
    }
  } catch {
    // Postgres chưa chạy — dùng demo bên dưới.
  }

  const demo = getDemoProjectBySlug(slug);
  if (!demo) return null;

  return {
    project: demo,
    marketplaceListings: getDemoListingsForSlug(slug),
    source: "demo",
  };
}
