import type { ListingDetail, PublicListingDetail } from "@/lib/data/listing";
import { prisma } from "@/lib/prisma";
import type { ListingCardData } from "@/components/listings/listing-card";
import type { Prisma, TransactionType } from "@prisma/client";
import {
  INTERNAL_DEMO_LISTING_CODES,
  INTERNAL_DEMO_PROJECT_SLUGS,
  isInternalDemoListingCode,
} from "@/lib/deploy/internal-demo-content";
import { allowDemoProjectFallback } from "@/lib/deploy/demo-fallback";
import {
  enrichDtaListingCardTitle,
  isDtaHappyHomeListingCode,
  buildDtaHappyHomeListingDetail,
} from "@/lib/preview/dta-happy-home-listings";
import {
  buildDemoListingDetail,
  DEMO_SALE_LISTING_CARDS,
} from "@/lib/preview/demo-listings";
import { listCatalogSaleListingCards } from "@/lib/preview/catalog-listings";
import { listingMatchesBrowseProvince, provincesMatchingBrowseFilter } from "@/lib/content/mega-province-browse";
import { getListingByCode } from "@/lib/data/listing";
import { unstable_cache } from "next/cache";

const listingInclude = {
  media: {
    where: { status: "READY" as const },
    orderBy: { position: "asc" as const },
    take: 1,
  },
  fingerprint: {
    select: { canonical: { select: { offerCount: true } } },
  },
};

export type ListingBrowseParams = {
  transactionType: TransactionType;
  province?: string;
  district?: string;
  propertyType?: string;
  page?: number;
  pageSize?: number;
};

export type ListingBrowseResult = {
  items: ListingCardData[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  /** Tin minh hoạ khi Postgres chưa có listing. */
  isCatalog?: boolean;
};

function toCard(
  l: Awaited<
    ReturnType<
      typeof prisma.listing.findMany<{ include: typeof listingInclude }>
    >
  >[number],
): ListingCardData {
  return enrichDtaListingCardTitle({
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
  });
}

function filterDemoCards(
  cards: ListingCardData[],
  params: ListingBrowseParams,
): ListingCardData[] {
  return cards.filter((c) => {
    if (params.district && c.district !== params.district) return false;
    if (params.propertyType && c.propertyType !== params.propertyType) return false;
    if (params.province) {
      if (!listingMatchesBrowseProvince(c.province, params.province)) return false;
    }
    return true;
  });
}

export function buildListingBrowsePage(
  dbPageItems: ListingCardData[],
  dbTotal: number,
  catalogItems: ListingCardData[],
  page: number,
  pageSize: number,
): ListingBrowseResult {
  const start = (page - 1) * pageSize;
  const catalogStart = Math.max(0, start - dbTotal);
  const catalogTake = Math.max(0, pageSize - dbPageItems.length);
  const items = [
    ...dbPageItems,
    ...catalogItems.slice(catalogStart, catalogStart + catalogTake),
  ];
  const total = dbTotal + catalogItems.length;

  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    ...(total > 0 ? { isCatalog: true } : {}),
  };
}

/** Catalog go-live (DTA A10, …) rồi demo dev — tránh trùng mã giữa hai nguồn. */
function getSaleBrowseCatalogCards(
  params: ListingBrowseParams,
): ListingCardData[] {
  const seen = new Set<string>();
  const merged: ListingCardData[] = [];

  const catalog = filterDemoCards(
    listCatalogSaleListingCards().map(enrichDtaListingCardTitle),
    params,
  );
  for (const card of catalog) {
    if (seen.has(card.code)) continue;
    seen.add(card.code);
    merged.push(card);
  }

  if (allowDemoProjectFallback()) {
    const devOnly = filterDemoCards(DEMO_SALE_LISTING_CARDS, params);
    for (const card of devOnly) {
      if (seen.has(card.code)) continue;
      seen.add(card.code);
      merged.push(card);
    }
  }

  return merged;
}

async function browseListingsUncached(
  params: ListingBrowseParams,
): Promise<ListingBrowseResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const start = (page - 1) * pageSize;

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE" as const,
    deletedAt: null,
    code: { notIn: [...INTERNAL_DEMO_LISTING_CODES] },
    OR: [
      { projectId: null },
      { project: { slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] } } },
    ],
    transactionType: params.transactionType,
    ...(params.province
      ? (() => {
          const expanded = provincesMatchingBrowseFilter(params.province);
          return expanded
            ? { province: { in: expanded } }
            : { province: params.province };
        })()
      : {}),
    ...(params.district ? { district: params.district } : {}),
    ...(params.propertyType ? { propertyType: params.propertyType } : {}),
  };

  const catalogItems =
    params.transactionType === "SALE"
      ? getSaleBrowseCatalogCards(params)
      : [];

  try {
    const [rows, dbTotal, duplicateRows] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        skip: start,
        take: pageSize,
        include: listingInclude,
      }),
      prisma.listing.count({ where }),
      catalogItems.length > 0
        ? prisma.listing.findMany({
            where: {
              AND: [
                where,
                { code: { in: catalogItems.map((item) => item.code) } },
              ],
            },
            select: { code: true },
          })
        : Promise.resolve([]),
    ]);
    const duplicateCodes = new Set(duplicateRows.map((row) => row.code));
    const deduplicatedCatalog = catalogItems.filter(
      (item) => !duplicateCodes.has(item.code),
    );
    return buildListingBrowsePage(
      rows.map(toCard),
      dbTotal,
      deduplicatedCatalog,
      page,
      pageSize,
    );
  } catch {
    // DB offline — dùng catalog go-live bên dưới.
    return buildListingBrowsePage([], 0, catalogItems, page, pageSize);
  }
}

const browseListingsCached = unstable_cache(
  async (
    transactionType: TransactionType,
    province: string,
    district: string,
    propertyType: string,
    page: number,
    pageSize: number,
  ) =>
    browseListingsUncached({
      transactionType,
      province: province || undefined,
      district: district || undefined,
      propertyType: propertyType || undefined,
      page,
      pageSize,
    }),
  ["browse-listings"],
  { revalidate: 120, tags: ["listings-browse"] },
);

/** Danh sách tin đăng public — SSR trang mua bán / cho thuê (cache 120s). */
export async function browseListings(
  params: ListingBrowseParams,
): Promise<ListingBrowseResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  return browseListingsCached(
    params.transactionType,
    params.province ?? "",
    params.district ?? "",
    params.propertyType ?? "",
    page,
    pageSize,
  );
}

type ListingWithEditorialTitle = PublicListingDetail;

function mergeDtaEditorialCopy(
  fromDb: ListingDetail,
  code: string,
): ListingWithEditorialTitle {
  const demo: PublicListingDetail | null = buildDtaHappyHomeListingDetail(code);
  if (!demo?.title) return fromDb;
  return {
    ...fromDb,
    title: demo.title,
    description: demo.description ?? fromDb.description,
  };
}

/** Chi tiết tin — DB trước, catalog demo; DTA A10 luôn gắn copy biên tập. */
export async function getPublicListingByCode(
  code: string,
): Promise<ListingWithEditorialTitle | null> {
  if (isInternalDemoListingCode(code) && !allowDemoProjectFallback()) {
    return null;
  }

  try {
    const fromDb = await getListingByCode(code);
    if (fromDb) {
      if (isDtaHappyHomeListingCode(code)) {
        return mergeDtaEditorialCopy(fromDb, code);
      }
      return fromDb;
    }
  } catch {
    // Postgres offline
  }

  return buildDemoListingDetail(code) as PublicListingDetail | null;
}

export type { ListingDetail, PublicListingDetail } from "@/lib/data/listing";
