import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import { ID_TOWN_SLUG } from "@/lib/content/id-town-landing";
import {
  buildIdTownMock,
  buildIdTownPreviewListings,
} from "@/lib/preview/id-town-mock";

export const metadata: Metadata = {
  title: "Preview — ID Town Long Thành",
  robots: { index: false, follow: false },
};

/** Xem trước landing NOXH ID Town — không cần DB. */
export default function IdTownPreviewPage() {
  const project = buildIdTownMock();
  const listings = buildIdTownPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${ID_TOWN_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
