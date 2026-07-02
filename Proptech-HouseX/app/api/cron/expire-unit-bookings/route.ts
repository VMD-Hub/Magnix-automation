import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { expireUnitBookings } from "@/lib/rules/unit-booking-rules";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// POST /api/cron/expire-unit-bookings — hết hạn suất giữ (không unlock căn).
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${secret}`) {
        return fail(401, "UNAUTHORIZED", "Cron secret không hợp lệ.");
      }
    }

    const result = await expireUnitBookings(prisma);
    return ok(result);
  } catch (err) {
    return handleApiError(err);
  }
}
