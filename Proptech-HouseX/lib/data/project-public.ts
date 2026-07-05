import type { ProjectDetail } from "@/lib/data/project";
import type { ProjectLandingListingCard } from "@/lib/data/listing";
import {
  buildOverviewData,
  parseProjectOverview,
} from "@/lib/content/project-landing";
import { getProjectBySlugOrId } from "@/lib/data/project";
import { withDbTimeout } from "@/lib/db/query-timeout";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import {
  isInternalDemoProjectSlug,
} from "@/lib/deploy/internal-demo-content";
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

/**
 * Landing content của các dự án curated (DTA, Solena, Vinhomes, …) là code-authored:
 * code luôn là nguồn sự thật cho phần landing (ảnh, highlights, gallery, location, FAQ…),
 * còn DB chỉ giữ dữ liệu vận hành (tồn kho, unitTypes, legalDocs, toạ độ).
 *
 * Trước đây hàm này bỏ qua catalog khi bản ghi DB "trông đủ field" (landingLooksComplete),
 * khiến 1 bản DB cũ/khôi phục từ backup luôn thắng và landing "quay về bản cũ", ảnh mất.
 * Giờ với mọi slug curated ta luôn overlay landing từ code lên trên dữ liệu DB.
 */
export function enrichProjectFromCatalog(
  project: ProjectDetail,
  slug: string,
): ProjectDetail {
  if (!isCatalogProjectSlug(slug)) return project;

  const catalog = getDemoProjectBySlug(slug);
  if (!catalog) return project;

  const current = parseProjectOverview(project.overviewData);
  const catalogOverview = parseProjectOverview(catalog.overviewData);
  if (!catalogOverview.landing) return project;

  return {
    ...catalog,
    ...project,
    overviewData: buildOverviewData(project.overviewData, {
      totalUnits: current.totalUnits ?? catalogOverview.totalUnits,
      blocks: current.blocks ?? catalogOverview.blocks,
      landing: catalogOverview.landing,
    }) as ProjectDetail["overviewData"],
    description: project.description?.trim() || catalog.description,
    seoTitle: project.seoTitle?.trim() || catalog.seoTitle,
    seoDesc: project.seoDesc?.trim() || catalog.seoDesc,
    unitTypes:
      project.unitTypes.length > 0 ? project.unitTypes : catalog.unitTypes,
    legalDocs:
      project.legalDocs.length > 0 ? project.legalDocs : catalog.legalDocs,
    developer: project.developer ?? catalog.developer,
  };
}

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
  if (isInternalDemoProjectSlug(slug)) return null;

  try {
    const fromDb = await withDbTimeout(getProjectBySlugOrId(slug));
    if (fromDb) {
      const project = enrichProjectFromCatalog(fromDb, slug);
      const listings =
        getDemoListingsForSlug(slug).length > 0 && isCatalogProjectSlug(slug)
          ? getDemoListingsForSlug(slug)
          : [];
      return { project, marketplaceListings: listings, source: "db" };
    }
  } catch {
    // Postgres offline / timeout — thử catalog go-live bên dưới.
  }

  const catalog = getCatalogLanding(slug);
  if (catalog) return catalog;

  if (!allowDemoProjectFallback()) {
    // Production: không có DB row — chỉ go-live catalog đã đăng ký.
    return null;
  }

  const demo = getDemoProjectBySlug(slug);
  if (!demo) return null;

  return {
    project: demo,
    marketplaceListings: getDemoListingsForSlug(slug),
    source: "demo",
  };
}
