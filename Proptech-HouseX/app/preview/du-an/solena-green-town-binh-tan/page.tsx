import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildSolenaGreenTownMock,
  buildSolenaPreviewListings,
  SOLENA_GREEN_TOWN_SLUG,
} from "@/lib/preview/solena-green-town-mock";

export const metadata: Metadata = {
  title: "Preview — Solena Green Town Bình Tân",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function SolenaGreenTownPreviewPage() {
  const project = buildSolenaGreenTownMock();
  const listings = buildSolenaPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${SOLENA_GREEN_TOWN_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
