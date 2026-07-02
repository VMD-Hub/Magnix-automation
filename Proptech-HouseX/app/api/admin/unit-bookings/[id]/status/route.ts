import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { patchUnitBookingStatus } from "@/lib/data/unit-booking";
import { unitBookingAdminStatusSchema } from "@/lib/validation/unit-booking";

/** Admin — xác nhận / huỷ suất (không lock căn). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền thao tác.");
    }

    const { id } = await params;
    const body = unitBookingAdminStatusSchema.parse(await req.json());

    if (body.status === "CANCELLED" && !body.cancelReason?.trim()) {
      return fail(422, "REASON_REQUIRED", "Cần lý do huỷ suất.");
    }

    const booking = await patchUnitBookingStatus(
      id,
      body.status,
      body.cancelReason?.trim(),
    );

    if (!booking) {
      return fail(404, "NOT_FOUND", "Không tìm thấy suất giữ.");
    }

    return ok(booking);
  } catch (err) {
    if (err instanceof Error && err.message === "BOOKING_NOT_ACTIVE") {
      return fail(409, "NOT_ACTIVE", "Suất không còn ở trạng thái có thể đổi.");
    }
    return handleApiError(err);
  }
}
