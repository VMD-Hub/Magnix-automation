import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api/http";
import { isAdminAuthorized } from "@/lib/admin/session";
import { getConversionFunnel } from "@/lib/sales-core/service";
import { handleSalesCoreError } from "@/lib/sales-core/http";
import { funnelQuerySchema } from "@/lib/validation/sales-core";

export async function GET(req: NextRequest) {
  try {
    if (!isAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Không có quyền đọc funnel.");
    }
    const query = funnelQuerySchema.parse({
      journey: req.nextUrl.searchParams.get("journey") ?? undefined,
    });
    return ok(await getConversionFunnel(query));
  } catch (error) {
    return handleSalesCoreError(error);
  }
}
