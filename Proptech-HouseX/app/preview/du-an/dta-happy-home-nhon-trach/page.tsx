import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import { orderProjectRelatedArticles } from "@/lib/content/project-related-articles";
import { DTA_HAPPY_HOME_SLUG } from "@/lib/content/dta-happy-home-landing";
import { getDemoArticlesForProject } from "@/lib/preview/demo-articles";
import {
  buildDtaHappyHomeMock,
  buildDtaPreviewListings,
} from "@/lib/preview/dta-happy-home-mock";
import { getDemoProjectInventory } from "@/lib/preview/demo-project-inventory";

export const metadata: Metadata = {
  title: "Preview — DTA Happy Home Nhơn Trạch",
  robots: { index: false, follow: false },
};

/** Xem trước landing NOXH mẫu — không cần DB. */
export default function DtaHappyHomePreviewPage() {
  const project = buildDtaHappyHomeMock();
  const listings = buildDtaPreviewListings();
  const inventory = getDemoProjectInventory(DTA_HAPPY_HOME_SLUG, {});
  const relatedArticles = orderProjectRelatedArticles(
    DTA_HAPPY_HOME_SLUG,
    getDemoArticlesForProject(DTA_HAPPY_HOME_SLUG, 10),
    6,
  );

  return (
    <>
      <ProjectPreviewBanner productionPath="/du-an/dta-happy-home-nhon-trach" />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
        relatedArticles={relatedArticles}
        inventory={inventory}
      />
    </>
  );
}
