import Link from "next/link";
import { DemoCatalogBanner } from "@/components/projects/demo-catalog-banner";
import { ProjectCard } from "@/components/projects/project-card";
import { CatalogGridSkeleton } from "@/components/ui/catalog-page-skeleton";
import { listProjects } from "@/lib/data/project-list";
import { getSiteUrl } from "@/lib/site-config";
import { noxhProvinceHubPageHref } from "@/lib/content/noxh-province-hub";
import { NOXH_PROVINCE_HUB_BASE } from "@/lib/content/noxh-province-registry";

type Props = {
  provinceSlug: string;
  provinces: string[];
  listName: string;
  page: number;
};

export async function NoxhProvinceHubGrid({
  provinceSlug,
  provinces,
  listName,
  page,
}: Props) {
  const { items, pagination, isDemo } = await listProjects({
    projectType: "NHA_O_XA_HOI",
    provinces,
    page,
  });

  const siteUrl = getSiteUrl();
  const catalogUrl = `${siteUrl}${noxhProvinceHubPageHref(provinceSlug, page)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: catalogUrl,
    numberOfItems: items.length,
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}/du-an/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {isDemo && process.env.NODE_ENV !== "production" ? (
        <DemoCatalogBanner />
      ) : null}

      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.slug} item={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-silver-200 bg-white/60 p-12 text-center text-[#666666]">
          <p>Chưa có dự án nhà ở xã hội tại khu vực này trên House X.</p>
          <p className="mt-3">
            <Link
              href={NOXH_PROVINCE_HUB_BASE}
              prefetch
              className="font-semibold text-brand-700 hover:underline"
            >
              Xem tất cả dự án nhà ở xã hội
            </Link>
          </p>
        </div>
      )}

      {pagination.totalPages > 1 ? (
        <nav className="mt-8 flex justify-center gap-2">
          {page > 1 ? (
            <PageLink
              href={noxhProvinceHubPageHref(provinceSlug, page - 1)}
              label="← Trước"
            />
          ) : null}
          <span className="px-3 py-2 text-sm text-slate-600">
            Trang {page}/{pagination.totalPages}
          </span>
          {page < pagination.totalPages ? (
            <PageLink
              href={noxhProvinceHubPageHref(provinceSlug, page + 1)}
              label="Sau →"
            />
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

export function NoxhProvinceHubGridFallback() {
  return <CatalogGridSkeleton count={6} />;
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch
      className="rounded-lg border border-silver-200 bg-white px-4 py-2 text-sm font-medium text-[#333333] hover:border-brand-200 hover:bg-brand-50"
    >
      {label}
    </Link>
  );
}
