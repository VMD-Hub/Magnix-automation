import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  deletePartnerTarget,
  getPartnerTargetById,
  updatePartnerTarget,
} from "@/lib/data/partner-target";
import { partnerTargetUpdateSchema } from "@/lib/validation/partner-target";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xem partner target.");
    }
    const { id } = await params;
    const item = await getPartnerTargetById(id);
    if (!item) return fail(404, "NOT_FOUND", "Không tìm thấy target.");
    return ok(item);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản sửa partner target.");
    }
    const { id } = await params;
    const body = partnerTargetUpdateSchema.parse(await req.json());
    try {
      return ok(await updatePartnerTarget(id, body));
    } catch (inner) {
      if (inner instanceof Error && inner.message === "NOT_FOUND") {
        return fail(404, "NOT_FOUND", "Không tìm thấy target.");
      }
      throw inner;
    }
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Chủ quản xóa partner target.");
    }
    const { id } = await params;
    try {
      await deletePartnerTarget(id);
      return ok({ deleted: true });
    } catch (inner) {
      if (inner instanceof Error && inner.message === "NOT_FOUND") {
        return fail(404, "NOT_FOUND", "Không tìm thấy target.");
      }
      throw inner;
    }
  } catch (err) {
    return handleApiError(err);
  }
}
