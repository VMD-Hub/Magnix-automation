import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { markCommissionPayable } from "@/lib/noxh-case/commission-accrual";

/** Admin — CĐT xác nhận → commission PAYABLE. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền.");
    }

    const { id } = await params;
    const updated = await markCommissionPayable(id);
    return ok(updated);
  } catch (err) {
    if (
      err instanceof Error &&
      (err as { code?: string }).code === "P2025"
    ) {
      return fail(404, "NOT_FOUND", "Không tìm thấy hoặc không ở trạng thái ACCRUED.");
    }
    return handleApiError(err);
  }
}
