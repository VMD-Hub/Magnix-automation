import { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  approveListing,
  formatRejectReason,
  rejectListing,
} from "@/lib/data/listing-admin";
import { listingReviewSchema } from "@/lib/validation/listing-admin";

/** Admin duyệt / từ chối tin đăng. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền duyệt tin đăng.");
    }

    const { id } = await params;
    const body = listingReviewSchema.parse(await req.json());

    if (body.action === "approve") {
      const result = await approveListing(id);
      return ok({ approved: true, code: result.code });
    }

    const reasonText = formatRejectReason(body.reasonCode, body.rejectReason ?? "");
    if (reasonText.length < 5) {
      return fail(422, "REASON_REQUIRED", "Cần lý do từ chối (tối thiểu 5 ký tự).");
    }

    await rejectListing(id, reasonText, body.reasonCode);
    return ok({ rejected: true });
  } catch (err) {
    if (err instanceof Error && err.message === "LISTING_NOT_PENDING") {
      return fail(409, "NOT_PENDING", "Tin không ở trạng thái chờ duyệt.");
    }
    if (err instanceof Error && err.message.startsWith("GATE_")) {
      const code = err.message.replace("GATE_", "");
      return fail(422, code, "Tin chưa đạt điều kiện đăng (ảnh/mô tả).");
    }
    return handleApiError(err);
  }
}
