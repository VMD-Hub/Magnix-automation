import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { boundingBox, haversineKm } from "./haversine";

export interface NearbyParams {
  lat: number;
  lng: number;
  radiusKm: number;
  propertyType?: string;
  transactionType?: "SALE" | "RENT";
  limit?: number;
}

/**
 * Tìm listing ACTIVE quanh một điểm.
 *
 * Mặc định chạy trên Postgres thường: prefilter bằng bounding-box (index lat/lng)
 * rồi tính haversine chính xác trong app. Khi lên quy mô lớn → bật PostGIS và
 * thay bằng ST_DWithin (xem prisma/sql/enable-postgis.sql).
 */
export async function searchListingsNearby(params: NearbyParams) {
  const limit = params.limit ?? 20;
  const box = boundingBox(params.lat, params.lng, params.radiusKm);

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    deletedAt: null,
    lat: { gte: box.minLat, lte: box.maxLat },
    lng: { gte: box.minLng, lte: box.maxLng },
    ...(params.propertyType ? { propertyType: params.propertyType } : {}),
    ...(params.transactionType
      ? { transactionType: params.transactionType }
      : {}),
  };

  // Lấy dư trong hộp rồi lọc theo bán kính tròn (hộp lớn hơn hình tròn).
  const rows = await prisma.listing.findMany({
    where,
    take: limit * 4,
    include: {
      broker: { select: { id: true, fullName: true } },
      media: {
        where: { status: "READY" },
        orderBy: { position: "asc" },
        take: 1,
      },
    },
  });

  return rows
    .map((l) => ({
      ...l,
      distanceKm: haversineKm(params.lat, params.lng, l.lat!, l.lng!),
    }))
    .filter((l) => l.distanceKm <= params.radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
