import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isSuperAdminAuthorized,
} from "@/lib/admin/session";
import {
  approveContentDraft,
  getContentDraftById,
  markContentDraftPublished,
  rejectContentDraft,
  submitContentDraftL3,
  updateContentDraft,
} from "@/lib/data/content-draft";
import {
  contentDraftStatusActionSchema,
  contentDraftUpdateSchema,
} from "@/lib/validation/content-draft";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản truy cập content draft.");
    }
    const { id } = await params;
    const item = await getContentDraftById(id);
    if (!item) return fail(404, "NOT_FOUND", "Không tìm thấy draft.");
    return ok(item);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản sửa content draft.");
    }
    const { id } = await params;
    const body = contentDraftUpdateSchema.parse(await req.json());
    try {
      return ok(await updateContentDraft(id, body));
    } catch (inner) {
      if (inner instanceof Error) {
        if (inner.message === "NOT_FOUND") {
          return fail(404, "NOT_FOUND", "Không tìm thấy draft.");
        }
        if (inner.message === "LOCKED") {
          return fail(409, "LOCKED", "Draft đã PUBLISHED — không sửa.");
        }
      }
      throw inner;
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản duyệt content draft.");
    }
    const { id } = await params;
    const body = contentDraftStatusActionSchema.parse(await req.json());
    const session = getAdminSessionFromRequest(req);
    const reviewedBy = session?.role === "super" ? "super" : "admin";

    try {
      if (body.action === "submit_l3") {
        return ok(await submitContentDraftL3(id));
      }
      if (body.action === "approve") {
        return ok(await approveContentDraft(id, reviewedBy));
      }
      if (body.action === "reject") {
        return ok(await rejectContentDraft(id, reviewedBy, body.rejectReason));
      }
      return ok(await markContentDraftPublished(id));
    } catch (inner) {
      if (inner instanceof Error) {
        if (inner.message === "NOT_FOUND") {
          return fail(404, "NOT_FOUND", "Không tìm thấy draft.");
        }
        if (inner.message === "NOT_PENDING") {
          return fail(409, "NOT_PENDING", "Draft không ở trạng thái chờ L3.");
        }
        if (inner.message === "INVALID_STATUS") {
          return fail(409, "INVALID_STATUS", "Không thể chuyển trạng thái.");
        }
        if (inner.message === "GATE_FAILED") {
          const details = (inner as Error & { details?: string[] }).details;
          return fail(
            422,
            "GATE_FAILED",
            "Chưa đủ CTA tool NƠXH / checklist L3 — không duyệt.",
            details,
          );
        }
      }
      throw inner;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
