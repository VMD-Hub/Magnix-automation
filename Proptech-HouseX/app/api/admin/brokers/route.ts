import type { NextRequest } from "next/server";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { applyApiCors, corsPreflight } from "@/lib/api/cors";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "@/lib/admin/ops-telesales-access";
import { listInternalBrokers } from "@/lib/broker/telesales-board";
import { prisma } from "@/lib/prisma";

export function OPTIONS(req: NextRequest) {
  return corsPreflight(req);
}

/**
 * Super: list by brokerType.
 * Ops telesales grant: INTERNAL list only (for assign UI).
 */
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("brokerType");
    const wantInternal = !type || type === "INTERNAL";

    if (isSuperAdminAuthorized(req)) {
      if (wantInternal && (!type || type === "INTERNAL")) {
        const items = await listInternalBrokers();
        return applyApiCors(ok({ items, total: items.length }), req);
      }
      const items = await prisma.broker.findMany({
        where: type
          ? { brokerType: type as "CTV" | "FREE" | "AGENCY" | "INTERNAL" }
          : undefined,
        select: {
          id: true,
          fullName: true,
          phone: true,
          brokerType: true,
          ctvCode: true,
          userAccount: { select: { email: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 100,
      });
      return applyApiCors(ok({ items, total: items.length }), req);
    }

    if (wantInternal) {
      await requireOpsTelesalesAccess(req);
      const items = await listInternalBrokers();
      return applyApiCors(ok({ items, total: items.length }), req);
    }

    return applyApiCors(
      fail(403, "FORBIDDEN", "Chỉ Super Admin được list brokerType khác."),
      req,
    );
  } catch (err) {
    if (err instanceof OpsTelesalesAccessError) {
      const status = err.code === "UNAUTHORIZED" ? 401 : 403;
      return applyApiCors(fail(status, err.code, err.message), req);
    }
    return applyApiCors(handleApiError(err), req);
  }
}
