import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildVictoriaVillageMock,
  buildVictoriaVillagePreviewListings,
  VICTORIA_VILLAGE_SLUG,
} from "@/lib/preview/victoria-village-mock";

export const metadata: Metadata = {
  title: "Preview — Victoria Village Thạnh Mỹ Lợi",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function VictoriaVillagePreviewPage() {
  const project = buildVictoriaVillageMock();
  const listings = buildVictoriaVillagePreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${VICTORIA_VILLAGE_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
