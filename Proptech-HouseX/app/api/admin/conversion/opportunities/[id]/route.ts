import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { getOpportunitySummary } from "@/lib/sales-core/service";
import { handleSalesCoreError } from "@/lib/sales-core/http";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền đọc opportunity.");
    }
    const { id } = await ctx.params;
    z.string().trim().min(1).max(128).parse(id);
    return ok(await getOpportunitySummary(id));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
