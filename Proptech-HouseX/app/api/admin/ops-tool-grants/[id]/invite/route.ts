import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  OpsToolGrantError,
  resendOpsToolInvite,
} from "@/lib/admin/ops-tool-grants";
import { opsToolGrantResendSchema } from "@/lib/validation/ops-tool-grant";

type RouteCtx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Super Admin được gửi lại lời mời.");
    }
    const { id } = await ctx.params;
    const body = opsToolGrantResendSchema.parse(
      await req.json().catch(() => ({})),
    );
    const result = await resendOpsToolInvite({
      grantId: id,
      inviteEmail: body.inviteEmail,
    });
    return ok(result);
  } catch (err) {
    if (err instanceof OpsToolGrantError) {
      const status =
        err.code === "NOT_FOUND"
          ? 404
          : err.code === "EMAIL_SEND_FAILED"
            ? 502
            : 422;
      return fail(status, err.code, err.message);
    }
    return handleApiError(err);
  }
}
