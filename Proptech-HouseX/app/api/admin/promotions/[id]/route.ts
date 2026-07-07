import type { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  getPromotionForAdmin,
  updatePromotionCampaign,
} from "@/lib/data/promotion-admin";
import { promotionCampaignAdminSchema } from "@/lib/validation/promotion-admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await params;
    const campaign = await getPromotionForAdmin(id);
    if (!campaign) {
      return fail(404, "NOT_FOUND", "Không tìm thấy chương trình.");
    }
    return ok({ campaign });
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
    const body = promotionCampaignAdminSchema.parse(await req.json());
    const campaign = await updatePromotionCampaign(id, body);
    return ok({ campaign });
  } catch (err) {
    return handleApiError(err);
  }
}
