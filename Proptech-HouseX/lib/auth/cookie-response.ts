import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import {
  createSessionToken,
  SESSION_MAX_AGE_SEC,
} from "@/lib/auth/session-token";

/** Set cookie trên NextResponse (dùng trong route handler). */
export function attachSessionCookie(
  res: NextResponse,
  customerId: string,
): NextResponse {
  res.cookies.set(SESSION_COOKIE, createSessionToken(customerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}

export function clearSessionOnResponse(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
