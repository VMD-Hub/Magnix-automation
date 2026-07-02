import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildNobleCrystalRiversideMock,
  buildNobleCrystalRiversidePreviewListings,
  NOBLE_CRYSTAL_RIVERSIDE_SLUG,
} from "@/lib/preview/noble-crystal-riverside-mock";

export const metadata: Metadata = {
  title: "Preview — Noble Crystal Riverside Quận 7",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function NobleCrystalRiversidePreviewPage() {
  const project = buildNobleCrystalRiversideMock();
  const listings = buildNobleCrystalRiversidePreviewListings();

  return (
    <>
      <ProjectPreviewBanner
        productionPath={`/du-an/${NOBLE_CRYSTAL_RIVERSIDE_SLUG}`}
      />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
