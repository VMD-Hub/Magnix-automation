import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Shared include shape so API + SSR page return identical relations. */
export const listingDetailInclude = {
  broker: {
    select: {
      id: true,
      fullName: true,
      phone: true,
      brokerType: true,
      licenseVerified: true,
      rating: true,
    },
  },
  project: { select: { id: true, slug: true, name: true } },
  unitType: { select: { id: true, name: true } },
  media: { where: { status: "READY" }, orderBy: { position: "asc" } },
  fingerprint: { select: { canonicalId: true } },
} as const;

export async function getListingByCode(code: string) {
  // findFirst (không phải findUnique) để lọc soft-deleted cùng điều kiện.
  return prisma.listing.findFirst({
    where: { code, deletedAt: null },
    include: listingDetailInclude,
  });
}

/**
 * Tin đăng ACTIVE gắn với một dự án (marketplace "ký gửi" trên trang dự án),
 * sắp theo rankScore (P2 — quality + tier + freshness) rồi thời gian tạo.
 */
export async function getProjectMarketplaceListings(projectId: string, take = 12) {
  return prisma.listing.findMany({
    where: { projectId, status: "ACTIVE", deletedAt: null },
    include: {
      broker: { select: { id: true, fullName: true, brokerType: true } },
      media: {
        where: { status: "READY" },
        orderBy: { position: "asc" },
        take: 1,
      },
    },
    orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
    take,
  });
}

export type ListingDetail = NonNullable<
  Awaited<ReturnType<typeof getListingByCode>>
>;

/** Dữ liệu tối thiểu để render thẻ tin ký gửi trên landing dự án. */
export type ProjectLandingListingCard = {
  id: string;
  code: string;
  transactionType: string;
  propertyType: string;
  price: Prisma.Decimal | number | string | null;
  tier: string;
  broker: { fullName: string };
  media: { url: string }[];
};

export type ProjectMarketplaceListing = Awaited<
  ReturnType<typeof getProjectMarketplaceListings>
>[number];
