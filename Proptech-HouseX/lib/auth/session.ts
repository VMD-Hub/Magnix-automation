import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  createSessionToken,
  SESSION_MAX_AGE_SEC,
  verifySessionToken,
} from "@/lib/auth/session-token";

export const SESSION_COOKIE = "hx_session";

export interface SessionUser {
  id: string;
}

function parse(value: string | undefined | null): SessionUser | null {
  if (!value) return null;
  return verifySessionToken(value.trim());
}

/** Dùng trong Server Component / Route Handler (App Router). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return parse(store.get(SESSION_COOKIE)?.value);
}

/** Dùng khi đã có NextRequest (middleware / một số route). */
export function getSessionUserFromRequest(req: NextRequest): SessionUser | null {
  return parse(req.cookies.get(SESSION_COOKIE)?.value);
}

/** Ghi cookie phiên sau đăng nhập / đăng ký. */
export async function setSessionCookie(customerId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(customerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

/** Xoá phiên (đăng xuất). */
export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Trả thông tin user công khai (không PII đầy đủ) cho client. */
export type PublicAuthUser = {
  id: string;
  name: string;
  phoneMasked: string;
};
