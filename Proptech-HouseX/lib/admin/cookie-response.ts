import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  ADMIN_MAX_AGE_SEC,
  createAdminSessionToken,
} from "@/lib/admin/session";

export function attachAdminCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SEC,
  });
  return res;
}

export function clearAdminCookie(res: NextResponse): NextResponse {
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
