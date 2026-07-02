import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildMonreiSaigonMock,
  buildMonreiSaigonPreviewListings,
  MONREI_SAIGON_SLUG,
} from "@/lib/preview/monrei-saigon-mock";

export const metadata: Metadata = {
  title: "Preview — Monrei Saigon Thuận Giao",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function MonreiSaigonPreviewPage() {
  const project = buildMonreiSaigonMock();
  const listings = buildMonreiSaigonPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${MONREI_SAIGON_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
