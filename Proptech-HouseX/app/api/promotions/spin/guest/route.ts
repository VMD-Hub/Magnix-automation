import type { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, handleApiError } from "@/lib/api/http";
import { ipHash } from "@/lib/api/request-meta";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";
import {
  PromotionSpinError,
  executeGuestPromotionSpin,
} from "@/lib/promotion/spin-service";
import { isPromotionPrismaReady } from "@/lib/data/promotion-demo-fallback";

const bodySchema = z.object({
  slug: z.string().optional(),
});

/** Quay thử không cần đăng nhập — kết quả trúng giữ tạm đến khi claim. */
export async function POST(req: NextRequest) {
  try {
    if (!isPromotionPrismaReady()) {
      return fail(503, "NOT_READY", "Hệ thống khuyến mãi chưa sẵn sàng.");
    }

    const body = bodySchema.parse(await req.json());
    const slug = body.slug ?? DEFAULT_PROMOTION_SLUG;
    const hash = ipHash(req) ?? "unknown";

    const result = await executeGuestPromotionSpin({
      campaignSlug: slug,
      ipHash: hash,
    });

    return created(result);
  } catch (err) {
    if (err instanceof PromotionSpinError) {
      return fail(err.status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
