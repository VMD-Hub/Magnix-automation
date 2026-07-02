import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildVinhomesGrandParkMock,
  buildVinhomesGrandParkPreviewListings,
  VINHOMES_GRAND_PARK_SLUG,
} from "@/lib/preview/vinhomes-grand-park-mock";

export const metadata: Metadata = {
  title: "Preview — Vinhomes Grand Park Quận 9",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function VinhomesGrandParkPreviewPage() {
  const project = buildVinhomesGrandParkMock();
  const listings = buildVinhomesGrandParkPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${VINHOMES_GRAND_PARK_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
