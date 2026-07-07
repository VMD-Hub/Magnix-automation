import type { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, handleApiError } from "@/lib/api/http";
import { requireCustomerSessionFromRequest } from "@/lib/auth/require-customer";
import { DEFAULT_PROMOTION_SLUG } from "@/lib/promotion/constants";
import {
  PromotionSpinError,
  grantShareBonus,
} from "@/lib/promotion/spin-service";

const bodySchema = z.object({
  slug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireCustomerSessionFromRequest(req);
    if (!session.ok) {
      return fail(session.status, session.code, session.message);
    }

    const body = bodySchema.parse(await req.json().catch(() => ({})));
    const slug = body.slug ?? DEFAULT_PROMOTION_SLUG;

    const result = await grantShareBonus({
      campaignSlug: slug,
      customerId: session.customerId,
      userAccountId: session.profile.id,
    });

    return created(result);
  } catch (err) {
    if (err instanceof PromotionSpinError) {
      return fail(err.status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
