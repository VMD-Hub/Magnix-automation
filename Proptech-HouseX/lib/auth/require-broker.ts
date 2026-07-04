import type { NextRequest } from "next/server";
import { getSessionUser, getSessionUserFromRequest } from "@/lib/auth/session";
import { loadSessionProfile, type SessionProfile } from "@/lib/auth/session-profile";

type BrokerSession =
  | { ok: true; brokerId: string; profile: SessionProfile }
  | { ok: false; status: 401 | 403; code: string; message: string };

async function resolveBrokerSession(
  sessionId: string | null,
): Promise<BrokerSession> {
  if (!sessionId) {
    return {
      ok: false,
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Vui lòng đăng nhập tài khoản môi giới.",
    };
  }

  const profile = await loadSessionProfile({ id: sessionId });
  if (!profile || profile.role !== "BROKER" || !profile.brokerId) {
    return {
      ok: false,
      status: 403,
      code: "BROKER_ONLY",
      message: "Chỉ tài khoản môi giới mới truy cập được.",
    };
  }

  return { ok: true, brokerId: profile.brokerId, profile };
}

export async function requireBrokerSession(): Promise<BrokerSession> {
  const session = await getSessionUser();
  return resolveBrokerSession(session?.id ?? null);
}

export async function requireBrokerSessionFromRequest(
  req: NextRequest,
): Promise<BrokerSession> {
  const session = getSessionUserFromRequest(req);
  return resolveBrokerSession(session?.id ?? null);
}
