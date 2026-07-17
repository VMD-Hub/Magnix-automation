import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { appendSalesActivity } from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { activityCommandSchema } from "@/lib/validation/sales-core";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền ghi sales activity.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = activityCommandSchema.parse(await req.json());
    return ok(await appendSalesActivity({ ...body, idempotencyKey }));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
