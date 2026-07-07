import Link from "next/link";
import { DemoCatalogBanner } from "@/components/projects/demo-catalog-banner";
import { ProjectCard } from "@/components/projects/project-card";
import { CatalogGridSkeleton } from "@/components/ui/catalog-page-skeleton";
import {
  projectCatalogCanonicalUrl,
  projectCatalogPageHref,
} from "@/lib/content/project-catalog-paths";
import { listProjects } from "@/lib/data/project-list";
import { getSiteUrl } from "@/lib/site-config";
import { NOXH_CATALOG_TITLE } from "@/lib/content/messaging/noxh-public";

type Props = {
  projectType?: "THUONG_MAI" | "NHA_O_XA_HOI";
  page: number;
  isNoxhCatalog: boolean;
};

export async function ProjectCatalogGrid({
  projectType,
  page,
  isNoxhCatalog,
}: Props) {
  const { items, pagination, isDemo } = await listProjects({ projectType, page });

  const siteUrl = getSiteUrl();
  const catalogUrl = projectCatalogCanonicalUrl(
    isNoxhCatalog ? "NHA_O_XA_HOI" : projectType,
    page,
    siteUrl,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isNoxhCatalog ? NOXH_CATALOG_TITLE : "Dự án bất động sản HouseX",
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

      {isDemo && process.env.NODE_ENV !== "production" ? <DemoCatalogBanner /> : null}

      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.slug} item={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-silver-200 bg-white/60 p-12 text-center text-[#666666]">
          Chưa có dự án trong mục này.
        </div>
      )}

      {pagination.totalPages > 1 ? (
        <nav className="mt-8 flex justify-center gap-2">
          {page > 1 ? (
            <PageLink
              href={projectCatalogPageHref(projectType, page - 1)}
              label="← Trước"
            />
          ) : null}
          <span className="px-3 py-2 text-sm text-slate-600">
            Trang {page}/{pagination.totalPages}
          </span>
          {page < pagination.totalPages ? (
            <PageLink
              href={projectCatalogPageHref(projectType, page + 1)}
              label="Sau →"
            />
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

export function ProjectCatalogGridFallback() {
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
