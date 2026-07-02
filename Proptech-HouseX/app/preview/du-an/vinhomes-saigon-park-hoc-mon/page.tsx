import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildVinhomesSaigonParkMock,
  buildVinhomesSaigonParkPreviewListings,
  VINHOMES_SAIGON_PARK_SLUG,
} from "@/lib/preview/vinhomes-saigon-park-mock";

export const metadata: Metadata = {
  title: "Preview — Vinhomes Saigon Park Hóc Môn",
  robots: { index: false, follow: false },
};

/** Xem trước landing thương mại — không cần DB. */
export default function VinhomesSaigonParkPreviewPage() {
  const project = buildVinhomesSaigonParkMock();
  const listings = buildVinhomesSaigonParkPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath={`/du-an/${VINHOMES_SAIGON_PARK_SLUG}`} />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
