import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isSuperAdminAuthorized,
} from "@/lib/admin/session";
import {
  approveContentQueue,
  getContentQueueById,
  markContentQueuePublished,
  publishContentQueueToWeb,
  rejectContentQueue,
  submitContentQueueL3,
  updateContentQueueItem,
} from "@/lib/data/content-queue";
import {
  contentQueueStatusActionSchema,
  contentQueueUpdateSchema,
} from "@/lib/validation/content-queue";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản truy cập content queue.");
    }
    const { id } = await params;
    const item = await getContentQueueById(id);
    if (!item) return fail(404, "NOT_FOUND", "Không tìm thấy item.");
    return ok(item);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản sửa content queue.");
    }
    const { id } = await params;
    const existing = await getContentQueueById(id);
    if (!existing) return fail(404, "NOT_FOUND", "Không tìm thấy item.");
    if (existing.status === "PUBLISHED") {
      return fail(409, "LOCKED", "Item đã PUBLISHED — không sửa qua API này.");
    }

    const body = contentQueueUpdateSchema.parse(await req.json());
    try {
      const item = await updateContentQueueItem(id, body);
      return ok(item);
    } catch (inner) {
      if (inner instanceof Error && inner.message === "LOCKED") {
        return fail(409, "LOCKED", "Item đã PUBLISHED — không sửa.");
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
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản duyệt content queue.");
    }
    const { id } = await params;
    const body = contentQueueStatusActionSchema.parse(await req.json());
    const session = getAdminSessionFromRequest(req);
    const reviewedBy = session?.role === "super" ? "super" : "admin";

    try {
      if (body.action === "submit_l3") {
        return ok(await submitContentQueueL3(id));
      }
      if (body.action === "approve") {
        return ok(await approveContentQueue(id, reviewedBy));
      }
      if (body.action === "reject") {
        return ok(await rejectContentQueue(id, reviewedBy, body.rejectReason));
      }
      if (body.action === "publish_web") {
        return ok(
          await publishContentQueueToWeb(id, {
            publishNow: body.publishNow,
          }),
        );
      }
      return ok(await markContentQueuePublished(id));
    } catch (inner) {
      if (inner instanceof Error) {
        if (inner.message === "NOT_FOUND") {
          return fail(404, "NOT_FOUND", "Không tìm thấy item.");
        }
        if (inner.message === "NOT_PENDING") {
          return fail(409, "NOT_PENDING", "Item không ở trạng thái chờ L3.");
        }
        if (inner.message === "INVALID_STATUS") {
          return fail(
            409,
            "INVALID_STATUS",
            "Không thể chuyển trạng thái từ status hiện tại.",
          );
        }
        if (inner.message === "ARTICLE_MISSING") {
          return fail(
            409,
            "ARTICLE_MISSING",
            "articleId gắn với queue không còn trong CMS — xóa liên kết hoặc tạo bài mới.",
          );
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
