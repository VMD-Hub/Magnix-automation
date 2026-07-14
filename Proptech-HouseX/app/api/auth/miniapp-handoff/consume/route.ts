import { NextRequest, NextResponse } from "next/server";
import {
  isAllowedHandoffNext,
  verifyMiniappHandoffCode,
} from "@/lib/auth/miniapp-handoff";
import { SESSION_COOKIE } from "@/lib/auth/session";
import {
  createSessionToken,
  SESSION_MAX_AGE_SEC,
} from "@/lib/auth/session-token";
import { getSiteUrl } from "@/lib/site-config";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.includes("://") || raw.includes("..")) {
    return "/khach-hang/tai-khoan";
  }
  return isAllowedHandoffNext(raw) ? raw.split("?")[0]! : "/khach-hang/tai-khoan";
}

/**
 * WebView mở URL này → Set-Cookie hx_session + 302 tới hồ sơ web.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim() ?? "";
  const next = safeNext(req.nextUrl.searchParams.get("next"));

  const accountId = code ? verifyMiniappHandoffCode(code) : null;
  if (!accountId) {
    const failUrl = new URL("/dang-nhap", getSiteUrl());
    failUrl.searchParams.set("error", "handoff_expired");
    failUrl.searchParams.set("next", next);
    return NextResponse.redirect(failUrl);
  }

  const dest = new URL(next, getSiteUrl());
  const res = NextResponse.redirect(dest);
  res.cookies.set(SESSION_COOKIE, createSessionToken(accountId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}
