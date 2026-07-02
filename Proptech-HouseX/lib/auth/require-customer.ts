import type { NextRequest } from "next/server";
import { getSessionUser, getSessionUserFromRequest } from "@/lib/auth/session";
import { loadSessionProfile, type SessionProfile } from "@/lib/auth/session-profile";

type CustomerSession =
  | { ok: true; customerId: string; profile: SessionProfile }
  | { ok: false; status: 401 | 403; code: string; message: string };

async function resolveCustomerSession(
  sessionId: string | null,
): Promise<CustomerSession> {
  if (!sessionId) {
    return {
      ok: false,
      status: 401,
      code: "AUTH_REQUIRED",
      message: "Vui lòng đăng nhập tài khoản khách hàng.",
    };
  }

  const profile = await loadSessionProfile({ id: sessionId });
  if (!profile || profile.role !== "CUSTOMER" || !profile.customerId) {
    return {
      ok: false,
      status: 403,
      code: "CUSTOMER_ONLY",
      message: "Chỉ tài khoản khách hàng mới truy cập được.",
    };
  }

  return { ok: true, customerId: profile.customerId, profile };
}

export async function requireCustomerSession(): Promise<CustomerSession> {
  const session = await getSessionUser();
  return resolveCustomerSession(session?.id ?? null);
}

export async function requireCustomerSessionFromRequest(
  req: NextRequest,
): Promise<CustomerSession> {
  const session = getSessionUserFromRequest(req);
  return resolveCustomerSession(session?.id ?? null);
}
