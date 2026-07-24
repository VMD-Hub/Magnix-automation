import Link from "next/link";
import { Suspense } from "react";
import { CatalogPageShell } from "@/components/layout/catalog-page-shell";
import { ProjectCatalogBanner } from "@/components/projects/project-catalog-banner";
import {
  NoxhProvinceHubGrid,
  NoxhProvinceHubGridFallback,
} from "@/components/projects/noxh-province-hub-grid";
import {
  buildRichFaqJsonLd,
  ToolsFaqSection,
} from "@/components/tools/tools-faq-section";
import { PreloadBannerImage } from "@/components/seo/preload-banner-image";
import { catalogBannerSources } from "@/lib/brand/banner-responsive";
import { PROJECT_CATALOG_BANNERS } from "@/lib/brand/project-catalog-banners";
import { buildNoxhProvinceHubFaqs } from "@/lib/content/noxh-province-hub";
import type { NoxhProvinceEntry } from "@/lib/content/noxh-province-registry";
import {
  provincesMatchingNoxhHub,
} from "@/lib/content/noxh-province-registry";
import {
  NOXH_CATALOG_PATH,
  PROJECT_CATALOG_BASE_PATH,
} from "@/lib/content/project-catalog-routes";
import { NOXH_HANDBOOK_PATH } from "@/lib/content/messaging/noxh-public";

type Props = {
  entry: NoxhProvinceEntry;
  page: number;
};

export function NoxhProvinceHubPage({ entry, page }: Props) {
  const faqs = buildNoxhProvinceHubFaqs(entry);
  const provinces = provincesMatchingNoxhHub(entry.slug);
  const listName = `Nhà ở xã hội ${entry.nameNew}`;
  const bannerPreload = catalogBannerSources(
    PROJECT_CATALOG_BANNERS.NHA_O_XA_HOI.slide,
  );

  return (
    <CatalogPageShell>
      <PreloadBannerImage sources={bannerPreload} />
      {page === 1 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildRichFaqJsonLd(faqs)),
          }}
        />
      ) : null}

      <ProjectCatalogBanner variant="NHA_O_XA_HOI" />

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={PROJECT_CATALOG_BASE_PATH}
              className="hover:text-brand-700 hover:underline"
            >
              Dự án
            </Link>
          </li>
          <li aria-hidden className="text-slate-400">
            /
          </li>
          <li>
            <Link
              href={NOXH_CATALOG_PATH}
              className="hover:text-brand-700 hover:underline"
            >
              Nhà ở xã hội
            </Link>
          </li>
          <li aria-hidden className="text-slate-400">
            /
          </li>
          <li className="font-medium text-slate-900">{entry.nameNew}</li>
        </ol>
      </nav>

      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Nhà ở xã hội {entry.nameNew}
        </h1>
        <p className="mt-2 text-sm font-medium text-emerald-800">
          Cập nhật 2026 — danh mục dự án tại {entry.nameNew}
          {entry.aliasesOld.length > 0
            ? ` (vẫn tìm được theo tên quen gọi: ${entry.aliasesOld.join(", ")})`
            : ""}
          .
        </p>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Chọn dự án để xem giá, tiến độ và điều kiện mua — thông tin có căn cứ
          trước khi bạn giữ suất hoặc nộp hồ sơ.
        </p>
      </header>

      {page === 1 ? (
        <nav
          aria-label="Liên kết hỗ trợ"
          className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-sm"
        >
          <Link
            href={NOXH_HANDBOOK_PATH}
            prefetch
            className="font-semibold text-brand-700 hover:underline"
          >
            Hướng dẫn nhà ở xã hội
          </Link>
          <Link
            href="/vay-mua-nha"
            prefetch
            className="font-semibold text-brand-700 hover:underline"
          >
            Vay mua nhà
          </Link>
          <Link
            href="/tinh-tra-gop"
            prefetch
            className="font-semibold text-brand-700 hover:underline"
          >
            Tính trả góp
          </Link>
          <Link
            href={NOXH_CATALOG_PATH}
            prefetch
            className="font-semibold text-brand-700 hover:underline"
          >
            Tất cả dự án nhà ở xã hội
          </Link>
        </nav>
      ) : null}

      <Suspense
        key={`${entry.slug}-${page}`}
        fallback={<NoxhProvinceHubGridFallback />}
      >
        <NoxhProvinceHubGrid
          provinceSlug={entry.slug}
          provinces={provinces}
          listName={listName}
          page={page}
        />
      </Suspense>

      {page === 1 ? (
        <ToolsFaqSection
          className="mt-14 max-w-5xl"
          heading={`Câu hỏi thường gặp — NOXH ${entry.nameNew}`}
          items={faqs}
        />
      ) : null}

      <p className="mt-8 text-sm text-slate-600">
        <Link
          href={NOXH_CATALOG_PATH}
          prefetch
          className="font-semibold text-brand-700 hover:underline"
        >
          ← Tất cả dự án nhà ở xã hội
        </Link>
      </p>
    </CatalogPageShell>
  );
}
