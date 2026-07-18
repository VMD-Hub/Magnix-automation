/**
 * Access gate for CRM telesales APIs.
 * Super (ADMIN_SECRET) bypass; granted UserAccount via Bearer/hx_session.
 * ADMIN_OPS_SECRET alone is NOT enough.
 */
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSessionFromRequest } from "@/lib/admin/session";
import { getSessionUserFromRequest } from "@/lib/auth/session";

export const TELESALES_TOOL = "TELESALES_CRM" as const;

export type OpsTelesalesAccess = {
  mode: "super" | "grant";
  actorId: string;
};

export class OpsTelesalesAccessError extends Error {
  constructor(
    public readonly code: "FORBIDDEN" | "UNAUTHORIZED",
    message: string,
  ) {
    super(message);
    this.name = "OpsTelesalesAccessError";
  }
}

export async function hasActiveTelesalesGrant(
  userAccountId: string,
): Promise<boolean> {
  const row = await prisma.opsToolGrant.findUnique({
    where: {
      userAccountId_tool: {
        userAccountId,
        tool: TELESALES_TOOL,
      },
    },
    select: { status: true },
  });
  return row?.status === "ACTIVE";
}

/**
 * Resolve telesales API access. Throws OpsTelesalesAccessError if denied.
 */
export async function requireOpsTelesalesAccess(
  req: NextRequest,
): Promise<OpsTelesalesAccess> {
  const admin = getAdminSessionFromRequest(req);
  if (admin?.role === "super") {
    return { mode: "super", actorId: "admin:super" };
  }

  const session = getSessionUserFromRequest(req);
  if (!session) {
    if (admin?.role === "ops") {
      throw new OpsTelesalesAccessError(
        "FORBIDDEN",
        "Ops secret không đủ quyền telesales. Dùng tài khoản đã được Super duyệt hoặc đăng nhập Super.",
      );
    }
    throw new OpsTelesalesAccessError(
      "UNAUTHORIZED",
      "Cần đăng nhập (Zalo/SĐT) hoặc Super admin.",
    );
  }

  const allowed = await hasActiveTelesalesGrant(session.id);
  if (!allowed) {
    throw new OpsTelesalesAccessError(
      "FORBIDDEN",
      "Tài khoản chưa được Super Admin cấp quyền CRM Telesales.",
    );
  }

  return { mode: "grant", actorId: session.id };
}

export async function getTelesalesAccessForSession(
  userAccountId: string | null | undefined,
): Promise<{ allowed: boolean; tool: typeof TELESALES_TOOL }> {
  if (!userAccountId) {
    return { allowed: false, tool: TELESALES_TOOL };
  }
  const allowed = await hasActiveTelesalesGrant(userAccountId);
  return { allowed, tool: TELESALES_TOOL };
}
