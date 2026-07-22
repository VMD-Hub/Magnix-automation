import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { DemoCatalogBanner } from "@/components/projects/demo-catalog-banner";
import {
  projectCatalogPathForType,
  projectCatalogTypeFromSegmentSlug,
} from "@/lib/content/project-catalog-routes";
import {
  ProjectLandingContent,
  ProjectLandingView,
} from "@/components/projects/project-landing-view";
import { getPublicProjectBySlug } from "@/lib/data/project-public";
import { getProjectMarketplaceListings } from "@/lib/data/listing";
import { getProjectInventoryForPage } from "@/lib/data/project-unit";
import { getArticlesForProjectSlug } from "@/lib/data/article-public";
import { getDemoProjectInventory } from "@/lib/preview/demo-project-inventory";
import { parseProjectInventoryPageFilters } from "@/lib/validation/project-unit";
import { buildProjectJsonLd } from "@/lib/seo/json-ld";
import {
  normalizeSeoDescription,
  normalizeSeoTitle,
} from "@/lib/seo/meta-text";
import { getSiteUrl } from "@/lib/site-config";
import { resolveLandingHeroImage, parseProjectOverview } from "@/lib/content/project-landing";
import { withOpenGraph } from "@/lib/seo/open-graph";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicProjectBySlug(slug);

  if (!result) {
    return { title: "Không tìm thấy dự án" };
  }

  const { project } = result;
  const title = normalizeSeoTitle(project.seoTitle ?? project.name);
  const description = normalizeSeoDescription(
    project.seoDesc ??
      project.description?.slice(0, 200) ??
      `${project.name} tại ${project.district}, ${project.province} — thông tin giá, tiến độ và mặt bằng trên House X.`,
  );
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/du-an/${project.slug}`;
  const overview = parseProjectOverview(project.overviewData);
  const hero = resolveLandingHeroImage(overview.landing, project.name);
  const ogImage =
    hero?.url ??
    project.developer?.logoUrl ??
    "/images/hero/hcmc-skyline-river-day.webp";
  const ogAlt = hero?.alt ?? project.developer?.name ?? project.name;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: withOpenGraph({
      title,
      description,
      url: canonical,
      images: [{ url: ogImage, alt: ogAlt }],
    }),
  };
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const catalogType = projectCatalogTypeFromSegmentSlug(slug);
  if (catalogType) {
    permanentRedirect(projectCatalogPathForType(catalogType));
  }

  const inventoryFilters = parseProjectInventoryPageFilters(await searchParams);
  const result = await getPublicProjectBySlug(slug);

  if (!result) {
    notFound();
  }

  const { project, marketplaceListings, source } = result;
  const jsonLd = buildProjectJsonLd(project);
  const overview = parseProjectOverview(project.overviewData);
  const hasRichLanding =
    (overview.landing?.highlights.length ?? 0) > 0 ||
    (overview.landing?.gallery.length ?? 0) > 0;
  const useDirectLanding =
    source === "demo" || source === "catalog" || hasRichLanding;

  const [relatedArticles, inventory, resolvedMarketplaceListings] =
    await Promise.all([
      getArticlesForProjectSlug(project.slug, 6),
      source === "db"
        ? getProjectInventoryForPage(slug, inventoryFilters).catch(() =>
            getDemoProjectInventory(slug, inventoryFilters),
          )
        : Promise.resolve(getDemoProjectInventory(slug, inventoryFilters)),
      source === "db" && !useDirectLanding
        ? getProjectMarketplaceListings(project.id).catch(() => [])
        : Promise.resolve(marketplaceListings),
    ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {source === "demo" && process.env.NODE_ENV !== "production" && (
        <DemoCatalogBanner message="Dự án mẫu NOXH — chưa kết nối Postgres. Nội dung dùng để duyệt giao diện trước go-live." />
      )}
      {useDirectLanding ? (
        <ProjectLandingContent
          project={project}
          marketplaceListings={resolvedMarketplaceListings}
          relatedArticles={relatedArticles}
          inventory={inventory}
          inventoryFilters={inventoryFilters}
        />
      ) : (
        <ProjectLandingView
          project={project}
          marketplaceListings={resolvedMarketplaceListings}
          relatedArticles={relatedArticles}
          inventory={inventory}
          inventoryFilters={inventoryFilters}
        />
      )}
    </>
  );
}
