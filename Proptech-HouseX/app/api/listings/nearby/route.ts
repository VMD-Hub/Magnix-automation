import { NextRequest } from "next/server";
import { z } from "zod";
import { handleApiError, ok } from "@/lib/api/http";
import { searchListingsNearby } from "@/lib/geo/nearby";

const querySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().max(100).default(5),
  propertyType: z.string().optional(),
  transactionType: z.enum(["SALE", "RENT"]).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// GET /api/listings/nearby?lat=&lng=&radiusKm= — tìm tin quanh vị trí.
export async function GET(req: NextRequest) {
  try {
    const q = querySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
    const items = await searchListingsNearby(q);
    return ok({ items, center: { lat: q.lat, lng: q.lng }, radiusKm: q.radiusKm });
  } catch (err) {
    return handleApiError(err);
  }
}
