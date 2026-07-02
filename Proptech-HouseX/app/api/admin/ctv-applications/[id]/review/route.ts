import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { ctvReviewSchema } from "@/lib/validation/auth";
import {
  approveCtvApplication,
  rejectCtvApplication,
} from "@/lib/data/ctv";

/** Admin duyệt / từ chối đơn CTV (cookie phiên hoặc header x-admin-secret). */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền duyệt đơn CTV.");
    }

    const { id } = await params;
    const body = ctvReviewSchema.parse(await req.json());

    if (body.action === "approve") {
      const result = await approveCtvApplication(id);
      return ok({
        approved: true,
        ctvCode: result.ctvCode,
        brokerId: result.brokerId,
      });
    }

    if (!body.rejectReason?.trim()) {
      return fail(422, "REASON_REQUIRED", "Cần lý do từ chối.");
    }

    await rejectCtvApplication(id, body.rejectReason.trim());
    return ok({ rejected: true });
  } catch (err) {
    if (err instanceof Error && err.message === "APPLICATION_NOT_PENDING") {
      return fail(409, "NOT_PENDING", "Đơn không ở trạng thái chờ duyệt.");
    }
    return handleApiError(err);
  }
}
