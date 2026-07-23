import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import { orderProjectRelatedArticles } from "@/lib/content/project-related-articles";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import {
  buildHoGuomXanhMock,
  buildHoGuomXanhPreviewListings,
  HGX_PROJECT_SLUG,
} from "@/lib/preview/ho-guom-xanh-mock";
import { getDemoProjectInventory } from "@/lib/preview/demo-project-inventory";

export const metadata: Metadata = {
  title: "Preview — Nhà ở xã hội Hồ Gươm Xanh",
  robots: { index: false, follow: false },
};

/** Xem trước landing NOXH Hồ Gươm Xanh — không cần DB. */
export default function HoGuomXanhPreviewPage() {
  const project = buildHoGuomXanhMock();
  const listings = buildHoGuomXanhPreviewListings();
  const inventory = getDemoProjectInventory(HGX_PROJECT_SLUG, {});
  const relatedArticles = orderProjectRelatedArticles(
    HGX_PROJECT_SLUG,
    getDemoArticlesForProject(HGX_PROJECT_SLUG, 10),
    6,
  );

  return (
    <>
      <ProjectPreviewBanner
        productionPath={`/du-an/${HGX_PROJECT_SLUG}`}
      />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
        relatedArticles={relatedArticles}
        inventory={inventory}
      />
    </>
  );
}
