import type { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, handleApiError } from "@/lib/api/http";
import { ipHash } from "@/lib/api/request-meta";
import { requireCustomerSessionFromRequest } from "@/lib/auth/require-customer";
import {
  PromotionSpinError,
  claimPendingPromotionSpin,
} from "@/lib/promotion/spin-service";
import { isPromotionPrismaReady } from "@/lib/data/promotion-demo-fallback";

const bodySchema = z.object({
  claimToken: z.string().uuid(),
});

/** Lưu kết quả quay thử vào tài khoản — yêu cầu đăng nhập + NOXH đủ điều kiện. */
export async function POST(req: NextRequest) {
  try {
    if (!isPromotionPrismaReady()) {
      return fail(503, "NOT_READY", "Hệ thống khuyến mãi chưa sẵn sàng.");
    }

    const session = await requireCustomerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }
    if (!session.profile.emailVerified) {
      return fail(
        403,
        "EMAIL_NOT_VERIFIED",
        "Vui lòng xác minh email trước khi lưu kết quả.",
      );
    }

    const body = bodySchema.parse(await req.json());
    const result = await claimPendingPromotionSpin({
      claimToken: body.claimToken,
      customerId: session.customerId,
      userAccountId: session.profile.id,
      userName: session.profile.name,
      userEmail: session.profile.email,
      ipHash: ipHash(req),
    });

    return created(result);
  } catch (err) {
    if (err instanceof PromotionSpinError) {
      return fail(err.status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
