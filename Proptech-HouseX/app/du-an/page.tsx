import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProjectCatalogBanner } from "@/components/projects/project-catalog-banner";
import {
  ProjectCatalogGrid,
  ProjectCatalogGridFallback,
} from "@/components/projects/project-catalog-grid";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { projectCatalogBannerVariant } from "@/lib/brand/project-catalog-banners";
import { EditorialTrustPanel } from "@/components/content/editorial-trust-panel";
import { getNoxhEditorialTrust } from "@/lib/content/editorial-trust";
import { NOXH_ELIGIBILITY_FAQ } from "@/lib/content/noxh-eligibility-faq";
import {
  NOXH_CATALOG_FAQ_HEADING,
  NOXH_CATALOG_SEO_DESCRIPTION,
  NOXH_CATALOG_SEO_TITLE,
} from "@/lib/content/messaging/noxh-public";
import { PROJECT_TYPE_LABEL } from "@/lib/format";
import { cn } from "@/lib/ui/cn";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{
    projectType?: string;
    page?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const isNoxh = sp.projectType === "NHA_O_XA_HOI";
  const isCommercial = sp.projectType === "THUONG_MAI";
  const title = isNoxh
    ? NOXH_CATALOG_SEO_TITLE
    : isCommercial
      ? "Dự án thương mại"
      : "Dự án bất động sản";
  const description = isNoxh
    ? NOXH_CATALOG_SEO_DESCRIPTION
    : isCommercial
      ? "Khám phá dự án thương mại mới tại TP.HCM và các tỉnh thành."
      : "Danh mục dự án thương mại và NOXH trên HouseX.";

  return { title, description };
}

export default async function DuAnListPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const projectType =
    sp.projectType === "NHA_O_XA_HOI" || sp.projectType === "THUONG_MAI"
      ? sp.projectType
      : undefined;

  const bannerVariant = projectCatalogBannerVariant(projectType);
  const isNoxhCatalog = projectType === "NHA_O_XA_HOI";
  const showNoxhFaq = isNoxhCatalog && page === 1;
  const noxhTrust = showNoxhFaq ? getNoxhEditorialTrust() : null;
  const gridKey = `${projectType ?? "all"}-${page}`;

  return (
    <div className="proptech-section-glow mx-auto max-w-7xl py-8 container-px">
      {showNoxhFaq ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildRichFaqJsonLd(NOXH_ELIGIBILITY_FAQ)),
          }}
        />
      ) : null}

      <ProjectCatalogBanner variant={bannerVariant} />

      <div className="mb-6 flex flex-wrap gap-2">
        <Tab href="/du-an" active={!projectType} label="Tất cả" />
        <Tab
          href="/du-an?projectType=THUONG_MAI"
          active={projectType === "THUONG_MAI"}
          label="Thương mại"
        />
        <Tab
          href="/du-an?projectType=NHA_O_XA_HOI"
          active={projectType === "NHA_O_XA_HOI"}
          label={PROJECT_TYPE_LABEL.NHA_O_XA_HOI}
        />
      </div>

      <Suspense key={gridKey} fallback={<ProjectCatalogGridFallback />}>
        <ProjectCatalogGrid
          projectType={projectType}
          page={page}
          isNoxhCatalog={isNoxhCatalog}
        />
      </Suspense>

      {showNoxhFaq ? (
        <>
          <ToolsFaqSection
            className="mt-14 max-w-5xl"
            heading={NOXH_CATALOG_FAQ_HEADING}
            items={NOXH_ELIGIBILITY_FAQ}
          />
          <p className="mt-6 max-w-5xl text-sm text-slate-600">
            Tự kiểm tra điều kiện theo hồ sơ của bạn:{" "}
            <Link
              href="/cong-cu/dieu-kien-noxh"
              prefetch
              className="font-semibold text-brand-700 hover:underline"
            >
              Công cụ kiểm tra NOXH
            </Link>
            .
          </p>
          {noxhTrust ? (
            <EditorialTrustPanel
              className="max-w-5xl"
              updatedAt={noxhTrust.updatedAt}
              sources={noxhTrust.sources}
              expert={noxhTrust.expert}
              variant="tool"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function Tab({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-brand-600 text-white shadow-sm shadow-brand-600/20"
          : "bg-white text-[#555555] ring-1 ring-silver-200 hover:bg-silver-50",
      )}
    >
      {label}
    </Link>
  );
}
