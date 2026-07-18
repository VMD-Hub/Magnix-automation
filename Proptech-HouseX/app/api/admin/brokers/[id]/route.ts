import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import { patchBrokerTypeAdmin } from "@/lib/broker/telesales-board";
import { adminBrokerTypePatchSchema } from "@/lib/validation/broker-admin";
import { Prisma } from "@prisma/client";

type RouteCtx = { params: Promise<{ id: string }> };

/** PATCH brokerType — Super đánh dấu Nội sàn (INTERNAL) hoặc đổi type. */
export async function PATCH(req: NextRequest, ctx: RouteCtx) {
  try {
    if (!isSuperAdminAuthorized(req)) {
      return fail(403, "FORBIDDEN", "Chỉ Super Admin.");
    }
    const { id } = await ctx.params;
    const body = adminBrokerTypePatchSchema.parse(await req.json());
    const broker = await patchBrokerTypeAdmin(id, body.brokerType);
    return ok({ broker });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return fail(404, "NOT_FOUND", "Không tìm thấy broker.");
    }
    return handleApiError(err);
  }
}
