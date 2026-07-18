import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { recordNurtureDispatchResult } from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { nurtureDispatchCommandSchema } from "@/lib/validation/sales-core";

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền ghi nurture dispatch.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = nurtureDispatchCommandSchema.parse(await req.json());
    return ok(
      await recordNurtureDispatchResult({ ...body, idempotencyKey }),
    );
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
