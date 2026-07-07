import type { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, handleApiError } from "@/lib/api/http";
import { ipHash } from "@/lib/api/request-meta";
import { requireCustomerSessionFromRequest } from "@/lib/auth/require-customer";
import { isRateLimited } from "@/lib/redis";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";
import {
  PromotionSpinError,
  executePromotionSpin,
} from "@/lib/promotion/spin-service";
import { executeDemoPromotionSpin } from "@/lib/preview/promotion-demo";
import { shouldUsePromotionDemo, isPromotionPrismaReady, allowPromotionDemoFallback } from "@/lib/data/promotion-demo-fallback";

const bodySchema = z.object({
  slug: z.string().optional(),
  preview: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  let isPreview = false;
  try {
    const body = bodySchema.parse(await req.json());
    const slug = body.slug ?? DEFAULT_PROMOTION_SLUG;
    isPreview = body.preview === true;

    if (isPreview || (!isPromotionPrismaReady() && allowPromotionDemoFallback())) {
      if (!isPromotionPrismaReady()) {
        return created(executeDemoPromotionSpin(true));
      }
      try {
        const result = await executePromotionSpin({
          campaignSlug: slug,
          customerId: "preview-customer",
          userAccountId: "preview-user",
          userName: "Khách preview",
          userEmail: "preview@housex.local",
          isPreview: true,
        });
        return created(result);
      } catch (err) {
        if (shouldUsePromotionDemo(err)) {
          return created(executeDemoPromotionSpin(true));
        }
        throw err;
      }
    }

    const session = await requireCustomerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }
    if (!session.profile.emailVerified) {
      return fail(
        403,
        "EMAIL_NOT_VERIFIED",
        "Vui lòng xác minh email trước khi tham gia vòng quay.",
      );
    }

    if (
      await isRateLimited(`promo:spin:${session.customerId}`, 10, 3600)
    ) {
      return fail(429, "RATE_LIMITED", "Quá nhiều lượt quay. Vui lòng thử lại sau.");
    }

    const result = await executePromotionSpin({
      campaignSlug: slug,
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
    if (isPreview && shouldUsePromotionDemo(err)) {
      return created(executeDemoPromotionSpin(true));
    }
    return handleApiError(err);
  }
}
