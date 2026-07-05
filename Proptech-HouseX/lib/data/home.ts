import { prisma } from "@/lib/prisma";
import type { ListingCardData } from "@/components/listings/listing-card";
import type { ProjectCardData } from "@/components/projects/project-card";
import {
  parseProjectOverview,
  resolveLandingHeroImage,
} from "@/lib/content/project-landing";
import { ensureNoxhLandingMedia } from "@/lib/content/noxh-stock-images";
import { ensureCatalogCoverUrl } from "@/lib/content/catalog-cover-fallback";
import { isSafeImageUrl } from "@/lib/content/safe-image";
import { listCatalogProjectCards } from "@/lib/preview/demo-projects";
import { listDemoSaleListingCards } from "@/lib/preview/demo-listings";
import {
  INTERNAL_DEMO_LISTING_CODES,
  INTERNAL_DEMO_PROJECT_SLUGS,
} from "@/lib/deploy/internal-demo-content";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";

export type HomepageData = {
  ok: boolean;
  projects: ProjectCardData[];
  saleListings: ListingCardData[];
};

const listingInclude = {
  media: {
    where: { status: "READY" },
    orderBy: { position: "asc" as const },
    take: 1,
  },
  fingerprint: {
    select: { canonical: { select: { offerCount: true } } },
  },
};

/** Ảnh bìa card dự án: hero landing (NOXH đã sanitize) → fallback catalog cover local. */
function resolveProjectCardImage(
  overviewData: unknown,
  projectType: string,
  slug: string,
  name: string,
): string {
  const overview = parseProjectOverview(overviewData);
  const landing =
    overview.landing && projectType === "NHA_O_XA_HOI"
      ? ensureNoxhLandingMedia(overview.landing, slug)
      : overview.landing;
  const hero = resolveLandingHeroImage(landing, name);
  return isSafeImageUrl(hero?.url) ? hero!.url : ensureCatalogCoverUrl(slug);
}

/**
 * Lấy dữ liệu trang chủ. Bọc try/catch để trang vẫn render (empty state)
 * khi DB chưa sẵn sàng / chưa seed.
 */
export async function getHomepageData(): Promise<HomepageData> {
  try {
    const [projects, saleListings] = await Promise.all([
      prisma.project.findMany({
        where: {
          deletedAt: null,
          slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          developer: { select: { name: true } },
          unitTypes: {
            select: { priceFrom: true },
            orderBy: { priceFrom: "asc" },
            take: 1,
          },
          _count: { select: { listings: true } },
        },
      }),
      prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          deletedAt: null,
          transactionType: "SALE",
          code: { notIn: [...INTERNAL_DEMO_LISTING_CODES] },
          OR: [
            { projectId: null },
            { project: { slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] } } },
          ],
        },
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        take: 8,
        include: listingInclude,
      }),
    ]);

    const mappedListings =
      saleListings.length > 0
        ? saleListings.map((l) => ({
            code: l.code,
            propertyType: l.propertyType,
            transactionType: l.transactionType,
            price: l.price.toString(),
            area: l.area,
            province: l.province,
            district: l.district,
            verified: l.verified,
            hasVideo: l.hasVideo,
            photoCount: l.photoCount,
            imageUrl: l.media[0]?.url ?? null,
            offerCount: l.fingerprint?.canonical?.offerCount ?? 0,
          }))
        : allowDemoProjectFallback()
          ? listDemoSaleListingCards().slice(0, 4)
          : [];

    return {
      ok: true,
      projects:
        projects.length > 0
          ? projects.map((p) => ({
              slug: p.slug,
              name: p.name,
              projectType: p.projectType,
              status: p.status,
              province: p.province,
              district: p.district,
              developerName: p.developer?.name ?? null,
              priceFrom: p.unitTypes[0]?.priceFrom?.toString() ?? null,
              listingCount: p._count.listings,
              imageUrl: resolveProjectCardImage(
                p.overviewData,
                p.projectType,
                p.slug,
                p.name,
              ),
            }))
          : listCatalogProjectCards().slice(0, 6),
      saleListings: mappedListings,
    };
  } catch {
    return {
      ok: false,
      projects: listCatalogProjectCards().slice(0, 6),
      saleListings: allowDemoProjectFallback()
        ? listDemoSaleListingCards().slice(0, 4)
        : [],
    };
  }
}
