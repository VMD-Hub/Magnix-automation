import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildVinhomesGreenParadiseMock,
  buildVinhomesGreenParadisePreviewListings,
  VINHOMES_GREEN_PARADISE_SLUG,
} from "@/lib/preview/vinhomes-green-paradise-mock";

export const metadata: Metadata = {
  title: "Preview — Vinhomes Green Paradise Cần Giờ",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function VinhomesGreenParadisePreviewPage() {
  const project = buildVinhomesGreenParadiseMock();
  const listings = buildVinhomesGreenParadisePreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${VINHOMES_GREEN_PARADISE_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
