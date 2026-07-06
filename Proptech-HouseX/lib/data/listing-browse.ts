import type { ListingDetail, PublicListingDetail } from "@/lib/data/listing";
import { prisma } from "@/lib/prisma";
import type { ListingCardData } from "@/components/listings/listing-card";
import type { TransactionType } from "@prisma/client";
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

function paginateCatalog(
  cards: ListingCardData[],
  page: number,
  pageSize: number,
  isCatalog = false,
): ListingBrowseResult {
  const total = cards.length;
  const start = (page - 1) * pageSize;
  return {
    items: cards.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    isCatalog: isCatalog || total > 0,
  };
}

/** Gộp tin DB + catalog go-live (DTA A10, …) — tránh trùng mã tin. */
function mergeSaleBrowseCards(
  dbItems: ListingCardData[],
  params: ListingBrowseParams,
): ListingCardData[] {
  const seen = new Set(dbItems.map((c) => c.code));
  const merged = [...dbItems];

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

/** Danh sách tin đăng public — SSR trang mua bán / cho thuê. */
export async function browseListings(
  params: ListingBrowseParams,
): Promise<ListingBrowseResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

  const where = {
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

  let dbItems: ListingCardData[] = [];

  try {
    const rows = await prisma.listing.findMany({
      where,
      orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
      include: listingInclude,
    });
    dbItems = rows.map(toCard);
  } catch {
    // DB offline — dùng catalog go-live bên dưới.
  }

  if (params.transactionType === "SALE") {
    const merged = mergeSaleBrowseCards(dbItems, params);
    if (merged.length > 0) {
      const usedCatalog = merged.length > dbItems.length || dbItems.length === 0;
      return paginateCatalog(merged, page, pageSize, usedCatalog);
    }
  } else if (dbItems.length > 0) {
    const filtered = filterDemoCards(dbItems, params);
    return paginateCatalog(filtered, page, pageSize);
  }

  return {
    items: [],
    pagination: { page, pageSize, total: 0, totalPages: 1 },
  };
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
