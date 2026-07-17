import { NextRequest } from "next/server";
import { handleApiError, ok } from "@/lib/api/http";
import { cronAuthError } from "@/lib/api/cron-auth";
import { expireUnitBookings } from "@/lib/rules/unit-booking-rules";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/cron/expire-unit-bookings — hết hạn suất giữ (không unlock căn).
export async function POST(req: NextRequest) {
  try {
    const authError = cronAuthError(req);
    if (authError) return authError;

    const result = await expireUnitBookings(prisma);
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
