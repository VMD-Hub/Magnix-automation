import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import {
  createOpportunity,
  listOpportunities,
  transitionOpportunity,
} from "@/lib/sales-core/service";
import {
  handleSalesCoreError,
  requireIdempotencyKey,
} from "@/lib/sales-core/http";
import {
  opportunityCommandSchema,
  opportunityListQuerySchema,
} from "@/lib/validation/sales-core";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền đọc opportunity.");
    }
    const query = opportunityListQuerySchema.parse({
      journey: req.nextUrl.searchParams.get("journey") ?? undefined,
      stage: req.nextUrl.searchParams.get("stage") ?? undefined,
      limit: req.nextUrl.searchParams.get("limit") ?? undefined,
    });
    return ok(await listOpportunities(query));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền cập nhật opportunity.");
    }
    const idempotencyKey = requireIdempotencyKey(req);
    const body = opportunityCommandSchema.parse(await req.json());
    if (body.action === "create") {
      const { action, ...input } = body;
      void action;
      return ok(await createOpportunity({ ...input, idempotencyKey }));
    }
    const { action, ...input } = body;
    void action;
    return ok(await transitionOpportunity({ ...input, idempotencyKey }));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
