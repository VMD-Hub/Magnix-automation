import type { Metadata } from "next";
import { ProjectLandingContent } from "@/components/projects/project-landing-view";
import { ProjectPreviewBanner } from "@/components/projects/project-preview-banner";
import {
  buildDtaHappyHomeMock,
  buildDtaPreviewListings,
} from "@/lib/preview/dta-happy-home-mock";

export const metadata: Metadata = {
  title: "Preview — DTA Happy Home Nhơn Trạch",
  robots: { index: false, follow: false },
};

/** Xem trước landing NOXH mẫu — không cần DB. */
export default function DtaHappyHomePreviewPage() {
  const project = buildDtaHappyHomeMock();
  const listings = buildDtaPreviewListings();

  return (
    <>
      <ProjectPreviewBanner productionPath="/du-an/dta-happy-home-nhon-trach" />
      <ProjectLandingContent
        project={project}
        marketplaceListings={listings}
      />
    </>
  );
}
