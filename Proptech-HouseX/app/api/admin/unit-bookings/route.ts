import type { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { listUnitBookingsForAdmin } from "@/lib/data/unit-booking";
import { ACTIVE_UNIT_BOOKING_STATUSES } from "@/lib/rules/unit-booking-rules";

const querySchema = z.object({
  status: z.enum(["ACTIVE", "ALL"]).optional().default("ACTIVE"),
});

/** Admin: danh sách suất giữ mua (giữ suất — chưa lock căn). */
export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const parsed = querySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
    });

    const items = await listUnitBookingsForAdmin(parsed.status);
    const all = parsed.status === "ALL" ? items : await listUnitBookingsForAdmin("ALL");

    const counts = {
      active: all.filter((i) =>
        ACTIVE_UNIT_BOOKING_STATUSES.includes(i.status),
      ).length,
      converted: all.filter((i) => i.status === "CONVERTED_TO_DEPOSIT").length,
      cancelled: all.filter((i) => i.status === "CANCELLED").length,
      expired: all.filter((i) => i.status === "EXPIRED").length,
      total: all.length,
    };

    return ok({ items, counts });
  } catch (err) {
    return handleApiError(err);
  }
}
