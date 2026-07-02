import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Upsert CanonicalProperty theo clusterKey và +1 offerCount.
 * Gọi trong transaction khi tạo listing. Trả về id canonical.
 */
export async function upsertCanonicalForListing(
  tx: Prisma.TransactionClient,
  params: {
    clusterKey: string;
    projectId?: string | null;
    unitTypeId?: string | null;
    propertyType: string;
    province: string;
    district: string;
  },
): Promise<string> {
  const canonical = await tx.canonicalProperty.upsert({
    where: { clusterKey: params.clusterKey },
    create: {
      clusterKey: params.clusterKey,
      projectId: params.projectId ?? null,
      unitTypeId: params.unitTypeId ?? null,
      propertyType: params.propertyType,
      province: params.province,
      district: params.district,
      offerCount: 1,
    },
    update: { offerCount: { increment: 1 } },
  });
  return canonical.id;
}

const TIER_RANK = { PREMIUM: 0, VIP: 1, FREE: 2 } as const;

/** Các tin ACTIVE khác cùng 1 BĐS (nhiều broker), trừ listing hiện tại. */
export async function getCanonicalOffers(
  canonicalId: string,
  excludeListingId?: string,
) {
  const offers = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
      fingerprint: { canonicalId },
      ...(excludeListingId ? { id: { not: excludeListingId } } : {}),
    },
    select: {
      id: true,
      code: true,
      tier: true,
      price: true,
      createdAt: true,
      broker: { select: { id: true, fullName: true } },
    },
  });
  return offers.sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);
}

/**
 * Tin "đại diện" của một canonical (cho SEO canonical URL): ưu tiên tier cao,
 * rồi tin tạo sớm nhất. Các tin còn lại nên noindex để tránh duplicate content.
 */
export async function getCanonicalPrimaryCode(
  canonicalId: string,
): Promise<string | null> {
  const offers = await prisma.listing.findMany({
    where: { status: "ACTIVE", deletedAt: null, fingerprint: { canonicalId } },
    select: { code: true, tier: true, createdAt: true },
  });
  if (offers.length === 0) return null;
  offers.sort(
    (a, b) =>
      TIER_RANK[a.tier] - TIER_RANK[b.tier] ||
      a.createdAt.getTime() - b.createdAt.getTime(),
  );
  return offers[0]!.code;
}
