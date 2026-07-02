import { NextRequest } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSearchApiRateLimited } from "@/lib/security/api-rate-limit";
import { getSearchClient } from "@/lib/search/provider";
import { listingToSearchDoc } from "@/lib/search/listing-doc";
import { searchListingsNearby } from "@/lib/geo/nearby";

const querySchema = z.object({
  q: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  propertyType: z.string().optional(),
  transactionType: z.enum(["SALE", "RENT"]).optional(),
  tier: z.enum(["FREE", "VIP", "PREMIUM"]).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().max(100).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const quote = (v: string) => `"${v.replace(/"/g, '\\"')}"`;

// GET /api/search/listings — full-text + filter + geo.
// Dùng Meilisearch nếu cấu hình MEILI_HOST; nếu không, fallback truy vấn DB.
export async function GET(req: NextRequest) {
  try {
    if (await isSearchApiRateLimited(req)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }
    const q = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
    const geo =
      q.lat != null && q.lng != null
        ? { lat: q.lat, lng: q.lng, radiusKm: q.radiusKm ?? 5 }
        : undefined;

    const client = getSearchClient();

    if (client) {
      const filters = ["status = ACTIVE"];
      if (q.province) filters.push(`province = ${quote(q.province)}`);
      if (q.district) filters.push(`district = ${quote(q.district)}`);
      if (q.propertyType) filters.push(`propertyType = ${quote(q.propertyType)}`);
      if (q.transactionType) filters.push(`transactionType = ${q.transactionType}`);
      if (q.tier) filters.push(`tier = ${q.tier}`);

      const result = await client.search({
        q: q.q,
        filters,
        geo,
        limit: q.limit,
      });
      return ok({ source: client.name, ...result });
    }

    // Fallback DB (dev / chưa có search server).
    if (geo) {
      const items = await searchListingsNearby({
        lat: geo.lat,
        lng: geo.lng,
        radiusKm: geo.radiusKm,
        propertyType: q.propertyType,
        transactionType: q.transactionType,
        limit: q.limit,
      });
      return ok({ source: "db_nearby", hits: items, total: items.length });
    }

    const where: Prisma.ListingWhereInput = {
      status: "ACTIVE",
      deletedAt: null,
      ...(q.province ? { province: q.province } : {}),
      ...(q.district ? { district: q.district } : {}),
      ...(q.propertyType ? { propertyType: q.propertyType } : {}),
      ...(q.transactionType ? { transactionType: q.transactionType } : {}),
      ...(q.tier ? { tier: q.tier } : {}),
      ...(q.q
        ? {
            OR: [
              { description: { contains: q.q, mode: "insensitive" } },
              { propertyType: { contains: q.q, mode: "insensitive" } },
              { district: { contains: q.q, mode: "insensitive" } },
              { province: { contains: q.q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const rows = await prisma.listing.findMany({
      where,
      orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
      take: q.limit,
      include: {
        project: { select: { name: true } },
        broker: { select: { fullName: true } },
      },
    });

    return ok({
      source: "db",
      hits: rows.map(listingToSearchDoc),
      total: rows.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
