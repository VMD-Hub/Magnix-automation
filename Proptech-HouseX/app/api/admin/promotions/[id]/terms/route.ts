import type { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  getPromotionForAdmin,
  updatePromotionTermsMarkdown,
} from "@/lib/data/promotion-admin";
import { promotionTermsUpdateSchema } from "@/lib/validation/promotion-admin";
import { buildPromotionTermsMarkdown } from "@/lib/content/promotion-terms";
import type { PromotionPrizeTermsRow } from "@/lib/content/promotion-terms";
import type { PromotionPrize } from "@prisma/client";

function prizeRowsFromCampaign(prizes: PromotionPrize[]): PromotionPrizeTermsRow[] {

  const tierRank: Record<string, string> = {
    SPECIAL: "Giải Đặc Biệt",
    FIRST: "Giải Nhất",
    SECOND: "Giải Nhì",
    THIRD: "Giải Ba",
    CONSOLATION: "Giải Khuyến khích",
    EMPTY: "Chúc may mắn",
  };

  return prizes
    .filter((p) => p.prizeType !== "EMPTY")
    .map((p) => ({
      rank: tierRank[p.tier] ?? p.tier,
      name: p.label,
      detail: p.description ?? p.label,
      quantity: p.totalQty > 0 ? String(p.totalQty) : "Không giới hạn",
      validity:
        p.prizeType === "SERVICE"
          ? "**Áp dụng ngay** khi làm hồ sơ mua bán qua HouseX"
          : "Khi ký HĐMB & hoàn thành nghĩa vụ tài chính đợt đầu",
    }));
}

/** PATCH — cập nhật thể lệ markdown (team pháp lý). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền truy cập admin.");
    }
    const { id } = await params;
    const body = promotionTermsUpdateSchema.parse(await req.json());
    const campaign = await getPromotionForAdmin(id);
    if (!campaign) {
      return fail(404, "NOT_FOUND", "Không tìm thấy chương trình.");
    }

    const updated = await updatePromotionTermsMarkdown(id, body.termsMarkdown);
    return ok({ campaign: updated });
  } catch (err) {
    return handleApiError(err);
  }
}

/** POST — khôi phục thể lệ mẫu từ dữ liệu campaign hiện tại. */
export async function POST(
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

    const termsMarkdown = buildPromotionTermsMarkdown({
      campaignName: campaign.name,
      startAt: campaign.startAt,
      endAt: campaign.endAt,
      maxSpinsPerAccount: campaign.maxSpinsPerAccount,
      maxSpinsPerDay: campaign.maxSpinsPerDay,
      prizeTableRows: prizeRowsFromCampaign(campaign.prizes),
    });

    const updated = await updatePromotionTermsMarkdown(id, termsMarkdown);
    return ok({ campaign: updated, termsMarkdown });
  } catch (err) {
    return handleApiError(err);
  }
}
