import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  ageInDays,
  computeQualityScore,
  computeRankScore,
  type ListingTier,
} from "@/lib/rules/ranking";

type Db = PrismaClient | Prisma.TransactionClient;

export interface MediaCounts {
  readyImageCount: number;
  totalVideoCount: number;
  readyVideoCount: number;
}

/** Đếm media theo loại/trạng thái — input cho cả publish gate lẫn quality score. */
export async function mediaCountsFor(
  db: Db,
  listingId: string,
): Promise<MediaCounts> {
  const [readyImageCount, totalVideoCount, readyVideoCount] = await Promise.all([
    db.listingMedia.count({
      where: { listingId, status: "READY", type: { not: "video" } },
    }),
    db.listingMedia.count({ where: { listingId, type: "video" } }),
    db.listingMedia.count({
      where: { listingId, type: "video", status: "READY" },
    }),
  ]);
  return { readyImageCount, totalVideoCount, readyVideoCount };
}

/**
 * Tính lại quality + rank cho 1 listing và lưu các cột precompute.
 * Gọi sau create/patch, sau khi media READY, và định kỳ bằng cron (freshness decay).
 */
export async function recomputeListingRanking(
  listingId: string,
  db: Db = prisma,
  now: Date = new Date(),
): Promise<{ qualityScore: number; rankScore: number } | null> {
  const l = await db.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      tier: true,
      verified: true,
      description: true,
      projectId: true,
      lat: true,
      lng: true,
      createdAt: true,
    },
  });
  if (!l) return null;

  const counts = await mediaCountsFor(db, listingId);
  const leadCount = await db.lead.count({ where: { listingId } });

  const qualityScore = computeQualityScore({
    photoCount: counts.readyImageCount,
    hasVideo: counts.readyVideoCount > 0,
    descriptionLength: l.description?.length ?? 0,
    verified: l.verified,
    hasProject: l.projectId != null,
    hasGeo: l.lat != null && l.lng != null,
  });

  const rankScore = computeRankScore({
    tier: l.tier as ListingTier,
    qualityScore,
    verified: l.verified,
    ageDays: ageInDays(l.createdAt, now),
    leadCount,
  });

  await db.listing.update({
    where: { id: listingId },
    data: {
      photoCount: counts.readyImageCount,
      hasVideo: counts.readyVideoCount > 0,
      qualityScore,
      rankScore,
      rankUpdatedAt: now,
    },
  });

  return { qualityScore, rankScore };
}

/** Tính lại rank cho toàn bộ tin ACTIVE (freshness suy giảm theo thời gian). */
export async function recomputeActiveRankings(
  db: PrismaClient = prisma,
  now: Date = new Date(),
): Promise<{ updated: number }> {
  let cursor: string | undefined;
  let updated = 0;
  for (;;) {
    const rows = await db.listing.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      select: { id: true },
      take: 500,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    });
    if (rows.length === 0) break;
    for (const r of rows) {
      await recomputeListingRanking(r.id, db, now);
      updated++;
    }
    cursor = rows[rows.length - 1].id;
    if (rows.length < 500) break;
  }
  return { updated };
}
