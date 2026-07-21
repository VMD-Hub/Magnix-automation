import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import {
  getAdminSessionFromRequest,
  isSuperAdminAuthorized,
} from "@/lib/admin/session";
import {
  approveEarlySignal,
  getEarlySignalById,
  markEarlySignalPublished,
  packageEarlySignal,
  rejectEarlySignal,
  submitEarlySignalL3,
  updateEarlySignal,
} from "@/lib/data/early-signal";
import {
  earlySignalStatusActionSchema,
  earlySignalUpdateSchema,
} from "@/lib/validation/early-signal";

type Ctx = { params: Promise<{ id: string }> };

/** Super: chi tiết một tin sớm. */
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản (L3) truy cập tin sớm.");
    }
    const { id } = await params;
    const item = await getEarlySignalById(id);
    if (!item) return fail(404, "NOT_FOUND", "Không tìm thấy tin sớm.");
    return ok(item);
  } catch (err) {
    return handleApiError(err);
  }
}

/** Super: cập nhật dossier / preview (khi chưa APPROVED/PUBLISHED cứng). */
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản (L3) sửa tin sớm.");
    }
    const { id } = await params;
    const existing = await getEarlySignalById(id);
    if (!existing) return fail(404, "NOT_FOUND", "Không tìm thấy tin sớm.");
    if (existing.status === "PUBLISHED") {
      return fail(409, "LOCKED", "Tin đã PUBLISHED — không sửa qua API này.");
    }

    const body = earlySignalUpdateSchema.parse(await req.json());
    const item = await updateEarlySignal(id, body);
    return ok(item);
  } catch (err) {
    return handleApiError(err);
  }
}

/** Super: chuyển trạng thái (package / submit_l3 / approve / reject / mark_published). */
export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản (L3) duyệt tin sớm.");
    }
    const { id } = await params;
    const body = earlySignalStatusActionSchema.parse(await req.json());
    const session = getAdminSessionFromRequest(req);
    const reviewedBy = session?.role === "super" ? "super" : "admin";

    try {
      if (body.action === "package") {
        return ok(await packageEarlySignal(id));
      }
      if (body.action === "submit_l3") {
        return ok(await submitEarlySignalL3(id));
      }
      if (body.action === "approve") {
        return ok(await approveEarlySignal(id, reviewedBy));
      }
      if (body.action === "reject") {
        return ok(await rejectEarlySignal(id, reviewedBy, body.rejectReason));
      }
      return ok(await markEarlySignalPublished(id));
    } catch (inner) {
      if (inner instanceof Error) {
        if (inner.message === "NOT_FOUND") {
          return fail(404, "NOT_FOUND", "Không tìm thấy tin sớm.");
        }
        if (inner.message === "NOT_PENDING") {
          return fail(409, "NOT_PENDING", "Tin không ở trạng thái chờ L3.");
        }
        if (inner.message === "INVALID_STATUS") {
          return fail(409, "INVALID_STATUS", "Không thể chuyển trạng thái từ status hiện tại.");
        }
        if (inner.message === "PACKAGE_INCOMPLETE") {
          return fail(
            422,
            "PACKAGE_INCOMPLETE",
            "Cần readerTitle và readerBody trước khi đóng gói.",
          );
        }
        if (inner.message === "GATE_FAILED") {
          const details = (inner as Error & { details?: string[] }).details;
          return fail(
            422,
            "GATE_FAILED",
            "Chưa đạt L0/L1 trước khi gửi L3.",
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
