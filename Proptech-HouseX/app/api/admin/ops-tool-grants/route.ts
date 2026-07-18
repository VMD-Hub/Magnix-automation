import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  grantOpsTool,
  listOpsToolGrants,
  OpsToolGrantError,
} from "@/lib/admin/ops-tool-grants";
import {
  opsToolGrantCreateSchema,
  opsToolGrantListQuerySchema,
} from "@/lib/validation/ops-tool-grant";

function mapGrantError(err: OpsToolGrantError) {
  const status =
    err.code === "USER_NOT_FOUND"
      ? 404
      : err.code === "EMAIL_SEND_FAILED"
        ? 502
        : err.code === "EMAIL_IN_USE" ||
            err.code === "INVALID_EMAIL" ||
            err.code === "INVALID_PHONE" ||
            err.code === "VALIDATION"
          ? 422
          : 400;
  return fail(status, err.code, err.message);
}

export async function GET(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Super Admin được xem ops grants.");
    }
    const parsed = opsToolGrantListQuerySchema.parse({
      status: req.nextUrl.searchParams.get("status") ?? undefined,
      tool: req.nextUrl.searchParams.get("tool") ?? undefined,
    });
    const items = await listOpsToolGrants(parsed);
    return ok({ items, total: items.length });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Super Admin được cấp quyền telesales.");
    }
    const body = opsToolGrantCreateSchema.parse(await req.json());
    const result = await grantOpsTool({
      phone: body.phone,
      zaloUserId: body.zaloUserId,
      inviteEmail: body.inviteEmail,
      note: body.note,
      tool: body.tool,
      grantedBy: "admin:super",
    });
    return ok(result);
  } catch (err) {
    if (err instanceof OpsToolGrantError) return mapGrantError(err);
    return handleApiError(err);
  }
}
