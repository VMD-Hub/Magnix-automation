import { prisma } from "@/lib/prisma";
import type { ListingCardData } from "@/components/listings/listing-card";
import type { ProjectCardData } from "@/components/projects/project-card";

export type HomepageData = {
  ok: boolean;
  projects: ProjectCardData[];
  saleListings: ListingCardData[];
};

const EMPTY: HomepageData = { ok: false, projects: [], saleListings: [] };

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

/**
 * Lấy dữ liệu trang chủ. Bọc try/catch để trang vẫn render (empty state)
 * khi DB chưa sẵn sàng / chưa seed.
 */
export async function getHomepageData(): Promise<HomepageData> {
  try {
    const [projects, saleListings] = await Promise.all([
      prisma.project.findMany({
        where: { deletedAt: null },
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
        where: { status: "ACTIVE", deletedAt: null, transactionType: "SALE" },
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        take: 8,
        include: listingInclude,
      }),
    ]);

    return {
      ok: true,
      projects: projects.map((p) => ({
        slug: p.slug,
        name: p.name,
        projectType: p.projectType,
        status: p.status,
        province: p.province,
        district: p.district,
        developerName: p.developer?.name ?? null,
        priceFrom: p.unitTypes[0]?.priceFrom?.toString() ?? null,
        listingCount: p._count.listings,
        imageUrl: null,
      })),
      saleListings: saleListings.map((l) => ({
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
      })),
    };
  } catch {
    return EMPTY;
  }
}
