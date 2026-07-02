import { prisma } from "@/lib/prisma";
import type { ListingCardData } from "@/components/listings/listing-card";
import type { TransactionType } from "@prisma/client";

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
};

function toCard(
  l: Awaited<
    ReturnType<
      typeof prisma.listing.findMany<{ include: typeof listingInclude }>
    >
  >[number],
): ListingCardData {
  return {
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
  };
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
    transactionType: params.transactionType,
    ...(params.province ? { province: params.province } : {}),
    ...(params.district ? { district: params.district } : {}),
    ...(params.propertyType ? { propertyType: params.propertyType } : {}),
  };

  try {
    const [rows, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: listingInclude,
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      items: rows.map(toCard),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  } catch {
    return {
      items: [],
      pagination: { page, pageSize, total: 0, totalPages: 1 },
    };
  }
}
