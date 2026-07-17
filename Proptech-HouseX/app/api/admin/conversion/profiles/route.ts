import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { upsertBuyerProfile } from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { buyerProfileCommandSchema } from "@/lib/validation/sales-core";

export async function PUT(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền cập nhật buyer profile.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = buyerProfileCommandSchema.parse(await req.json());
    return ok(await upsertBuyerProfile({ ...body, idempotencyKey }));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
