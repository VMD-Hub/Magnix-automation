import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildGladiaHeightsMock,
  buildGladiaHeightsPreviewListings,
  GLADIA_HEIGHTS_SLUG,
} from "@/lib/preview/gladia-heights-mock";

export const metadata: Metadata = {
  title: "Preview — Gladia Heights Khang Điền",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function GladiaHeightsPreviewPage() {
  const project = buildGladiaHeightsMock();
  const listings = buildGladiaHeightsPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${GLADIA_HEIGHTS_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
