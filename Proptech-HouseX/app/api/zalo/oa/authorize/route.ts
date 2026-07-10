import { NextRequest, NextResponse } from "next/server";
import { isSuperAdminAuthorized } from "@/lib/admin/session";
import {
  buildOaPermissionUrl,
  createPkceCookieValue,
  createPkcePair,
  getOaCallbackUrl,
  ZALO_OA_PKCE_COOKIE,
  ZALO_OA_PKCE_MAX_AGE_SEC,
} from "@/lib/zalo/oa-oauth";

/**
 * Bắt đầu OAuth OA (admin) → redirect Zalo permission.
 * Trước đó đăng ký Callback URL trên developers = getOaCallbackUrl().
 */
export async function GET(req: NextRequest) {
  if (!isSuperAdminAuthorized(req)) {
    return NextResponse.json(
      {
        error: {
          code: "ADMIN_REQUIRED",
          message:
            "Đăng nhập /admin/login trước, hoặc gọi với header x-admin-secret.",
        },
      },
      { status: 401 },
    );
  }

  const appId = process.env.ZALO_APP_ID?.trim();
  const appSecret = process.env.ZALO_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    return NextResponse.json(
      {
        error: {
          code: "ZALO_APP_NOT_CONFIGURED",
          message: "Thiếu ZALO_APP_ID / ZALO_APP_SECRET trên server.",
        },
      },
      { status: 503 },
    );
  }

  let callbackUrl: string;
  try {
    callbackUrl = getOaCallbackUrl();
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: "CALLBACK_URL_MISSING",
          message:
            err instanceof Error ? err.message : "Không xác định được callback URL.",
        },
      },
      { status: 503 },
    );
  }

  const { verifier, challenge } = createPkcePair();
  const permissionUrl = buildOaPermissionUrl({
    appId,
    redirectUri: callbackUrl,
    codeChallenge: challenge,
  });

  const res = NextResponse.redirect(permissionUrl);
  res.cookies.set(ZALO_OA_PKCE_COOKIE, createPkceCookieValue(verifier), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/zalo/oa",
    maxAge: ZALO_OA_PKCE_MAX_AGE_SEC,
  });
  return res;
}
