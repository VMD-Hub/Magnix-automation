import Link from "next/link";
import { Suspense } from "react";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
import { ProjectCatalogBanner } from "@/components/projects/project-catalog-banner";
import {
  ProjectCatalogGrid,
  ProjectCatalogGridFallback,
} from "@/components/projects/project-catalog-grid";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import {
  projectCatalogBannerVariant,
  PROJECT_CATALOG_BANNERS,
} from "@/lib/brand/project-catalog-banners";
import { PreloadBannerImage } from "@/components/seo/preload-banner-image";
import { catalogBannerSources } from "@/lib/brand/banner-responsive";
import { EditorialTrustPanel } from "@/components/content/editorial-trust-panel";
import { getNoxhEditorialTrust } from "@/lib/content/editorial-trust";
import { NOXH_ELIGIBILITY_FAQ } from "@/lib/content/noxh-eligibility-faq";
import {
  NOXH_CATALOG_FAQ_HEADING,
  NOXH_HANDBOOK_PATH,
} from "@/lib/content/messaging/noxh-public";
import {
  COMMERCIAL_CATALOG_PATH,
  NOXH_CATALOG_PATH,
  PROJECT_CATALOG_BASE_PATH,
  type ProjectCatalogDbType,
} from "@/lib/content/project-catalog-routes";
import {
  listNoxhProvinceHubsEnabled,
  noxhProvinceHubPath,
} from "@/lib/content/noxh-province-registry";
import { PROJECT_TYPE_LABEL } from "@/lib/format";
import { cn } from "@/lib/ui/cn";

type Props = {
  projectType?: ProjectCatalogDbType;
  page: number;
};

export function ProjectCatalogPage({ projectType, page }: Props) {
  const bannerVariant = projectCatalogBannerVariant(projectType);
  const isNoxhCatalog = projectType === "NHA_O_XA_HOI";
  const showNoxhFaq = isNoxhCatalog && page === 1;
  const noxhTrust = showNoxhFaq ? getNoxhEditorialTrust() : null;
  const gridKey = `${projectType ?? "all"}-${page}`;

  const bannerPreload = catalogBannerSources(
    PROJECT_CATALOG_BANNERS[bannerVariant].slide,
  );

  return (
    <CatalogPageShell>
      <PreloadBannerImage sources={bannerPreload} />
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
        <CatalogTab
          href={PROJECT_CATALOG_BASE_PATH}
          active={!projectType}
          label="Tất cả"
        />
        <CatalogTab
          href={COMMERCIAL_CATALOG_PATH}
          active={projectType === "THUONG_MAI"}
          label="Thương mại"
        />
        <CatalogTab
          href={NOXH_CATALOG_PATH}
          active={projectType === "NHA_O_XA_HOI"}
          label={PROJECT_TYPE_LABEL.NHA_O_XA_HOI}
        />
      </div>

      {isNoxhCatalog ? (
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Theo tỉnh, thành phố
          </p>
          <div className="flex flex-wrap gap-2">
            {listNoxhProvinceHubsEnabled().map((hub) => (
              <Link
                key={hub.slug}
                href={noxhProvinceHubPath(hub.slug)}
                prefetch
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:border-emerald-300 hover:bg-emerald-100"
              >
                {hub.nameNew}
              </Link>
            ))}
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Cần nắm điều kiện mua, hồ sơ và quy trình trước? Xem{" "}
            <Link
              href={NOXH_HANDBOOK_PATH}
              prefetch
              className="font-semibold text-brand-700 hover:underline"
            >
              hướng dẫn nhà ở xã hội
            </Link>
            .
          </p>
        </div>
      ) : null}

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
    </CatalogPageShell>
  );
}

function CatalogTab({
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
        "proptech-catalog-tab",
        active ? "proptech-catalog-tab--active" : "proptech-catalog-tab--idle",
      )}
    >
      {label}
    </Link>
  );
}
