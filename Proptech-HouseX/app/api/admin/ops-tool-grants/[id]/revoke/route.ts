import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  OpsToolGrantError,
  revokeOpsToolGrant,
} from "@/lib/admin/ops-tool-grants";

type RouteCtx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Super Admin được thu hồi grant.");
    }
    const { id } = await ctx.params;
    const grant = await revokeOpsToolGrant({
      id,
      revokedBy: "admin:super",
    });
    return ok({ grant });
  } catch (err) {
    if (err instanceof OpsToolGrantError) {
      return fail(
        err.code === "NOT_FOUND" ? 404 : 422,
        err.code,
        err.message,
      );
    }
    return handleApiError(err);
  }
}
