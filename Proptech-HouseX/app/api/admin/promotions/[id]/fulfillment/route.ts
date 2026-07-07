import type { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { updatePromotionWinFulfillment } from "@/lib/data/promotion-admin";
import { promotionFulfillmentSchema } from "@/lib/validation/promotion-admin";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const winId = req.nextUrl.searchParams.get("winId");
    if (!winId) {
      return fail(422, "WIN_ID_REQUIRED", "Thiếu winId.");
    }
    const body = promotionFulfillmentSchema.parse(await req.json());
    const win = await updatePromotionWinFulfillment(winId, body.fulfillmentStatus);
    return ok({ win });
  } catch (err) {
    return handleApiError(err);
  }
}
