import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { convertUnitBookingToDeposit } from "@/lib/data/unit-booking";

/** Admin — chuyển cọc thủ công: lock căn + huỷ suất còn lại. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền thao tác.");
    }

    const { id } = await params;
    const booking = await convertUnitBookingToDeposit(id, "admin");

    if (!booking) {
      return fail(404, "NOT_FOUND", "Không tìm thấy suất giữ.");
    }

    return ok(booking);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "BOOKING_NOT_CONVERTIBLE") {
        return fail(409, "NOT_CONVERTIBLE", "Suất không thể chuyển cọc ở trạng thái hiện tại.");
      }
      if (err.message === "UNIT_ALREADY_LOCKED") {
        return fail(409, "UNIT_LOCKED", "Căn đã được khóa (đã cọc).");
      }
    }
    return handleApiError(err);
  }
}
