import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  getEffectiveConsent,
  recordConsent,
} from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import { consentCommandSchema } from "@/lib/validation/sales-core";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền xem consent.");
    }
    const query = req.nextUrl.searchParams;
    const subjectType = query.get("subjectType");
    const subjectId = query.get("subjectId")?.trim();
    const purpose = query.get("purpose")?.trim();
    const channel = query.get("channel")?.trim();
    if (
      (subjectType !== "LEAD" && subjectType !== "CUSTOMER") ||
      !subjectId ||
      !purpose ||
      !channel
    ) {
      return fail(422, "VALIDATION_ERROR", "Thiếu consent scope hợp lệ.");
    }
    return ok(
      await getEffectiveConsent({ subjectType, subjectId, purpose, channel }),
    );
  } catch (error) {
    return handleSalesCoreError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền ghi consent.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = consentCommandSchema.parse(await req.json());
    return ok(await recordConsent({ ...body, idempotencyKey }));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
