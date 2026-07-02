import type { NextRequest } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth/session";
import { brokerIdForSession } from "@/lib/auth/session-profile";

/**
 * Xác định broker đang thao tác:
 * 1. brokerId từ body
 * 2. phiên đăng nhập (tài khoản BROKER)
 * 3. header `x-broker-id` (dev/API)
 */
export async function resolveBrokerId(
  req: NextRequest,
  bodyBrokerId?: string | null,
): Promise<string | null> {
  if (bodyBrokerId) return bodyBrokerId;

  const session = getSessionUserFromRequest(req);
  if (session) {
    const fromSession = await brokerIdForSession(session);
    if (fromSession) return fromSession;
  }

  return req.headers.get("x-broker-id");
}
