import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import { getProjectBySlugOrId } from "@/lib/data/project";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import { isCatalogProjectSlug } from "@/lib/seed/catalog-project-slugs";
import {
  getDemoListingsForSlug,
  getDemoProjectBySlug,
} from "@/lib/preview/demo-projects";

export type PublicProjectResult = {
  project: ProjectDetail;
  marketplaceListings: ProjectLandingListingCard[];
  source: "db" | "catalog" | "demo";
};

function getCatalogLanding(slug: string): PublicProjectResult | null {
  if (!isCatalogProjectSlug(slug)) return null;
  const project = getDemoProjectBySlug(slug);
  if (!project) return null;
  return {
    project,
    marketplaceListings: getDemoListingsForSlug(slug),
    source: "catalog",
  };
}

/** Trang công khai — DB trước, catalog go-live, rồi demo dev. */
export async function getPublicProjectBySlug(
  slug: string,
): Promise<PublicProjectResult | null> {
  try {
    const fromDb = await getProjectBySlugOrId(slug);
    if (fromDb) {
      return { project: fromDb, marketplaceListings: [], source: "db" };
    }
  } catch {
    // Postgres offline — thử catalog go-live bên dưới.
  }

  const catalog = getCatalogLanding(slug);
  if (catalog) return catalog;

  if (!allowDemoProjectFallback()) return null;

  const demo = getDemoProjectBySlug(slug);
  if (!demo) return null;

  return {
    project: demo,
    marketplaceListings: getDemoListingsForSlug(slug),
    source: "demo",
  };
}
