import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  getNoxhCaseForAdmin,
  updateNoxhCaseAdmin,
} from "@/lib/data/noxh-case";
import { adminCasePatchSchema } from "@/lib/validation/noxh-case";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";
import { DOC_STATUS_LABEL } from "@/lib/noxh-case/doc-catalog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await params;
    const row = await getNoxhCaseForAdmin(id);
    if (!row) {
      return fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ.");
    }

    return ok({
      ...row,
      milestoneLabel: MILESTONE_LABEL[row.milestone],
      documents: row.documents.map((d) => ({
        ...d,
        statusLabel: DOC_STATUS_LABEL[d.status],
      })),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }

    const { id } = await params;
    const body = adminCasePatchSchema.parse(await req.json());

    try {
      const updated = await updateNoxhCaseAdmin(id, body, "admin");
      if (!updated) {
        return fail(404, "NOT_FOUND", "Không tìm thấy hồ sơ.");
      }
      return ok(updated);
    } catch (err) {
      if (err instanceof Error && err.message === "DOCS_INCOMPLETE") {
        return fail(
          409,
          "DOCS_INCOMPLETE",
          "Chưa đủ giấy tờ PASSED — không thể lên mốc nộp hồ sơ.",
        );
      }
      throw err;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
