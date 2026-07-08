import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { updateCaseDocumentAdmin } from "@/lib/data/noxh-case";
import { adminDocPatchSchema } from "@/lib/validation/noxh-case";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id, docId } = await params;
    const body = adminDocPatchSchema.parse(await req.json());

    if (body.status === "REJECTED" && !body.rejectReason?.trim()) {
      return fail(422, "REJECT_REASON_REQUIRED", "Cần ghi lý do khi từ chối giấy tờ.");
    }

    const doc = await updateCaseDocumentAdmin(
      id,
      docId,
      {
        status: body.status,
        rejectReason: body.rejectReason,
      },
      "admin",
    );

    return ok(doc);
  } catch (err) {
    return handleApiError(err);
  }
}
