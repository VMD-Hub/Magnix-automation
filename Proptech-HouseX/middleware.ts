import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildCampaignLaneRedirectUrl } from "@/lib/miniapp/campaign-lane-host";
import {
  defaultAdminHome,
  isSuperAdminOnlyApi,
  isSuperAdminOnlyPage,
} from "@/lib/admin/roles";
import { getAdminSessionFromRequest } from "@/lib/admin/session";
import { isBlockedScraperUserAgent } from "@/lib/security/scrape-guard";

function adminForbiddenApi() {
  return NextResponse.json(
    {
      error: {
        code: "FORBIDDEN",
        message: "Chỉ chủ quản (Super Admin) mới truy cập mục này.",
      },
    },
    { status: 403 },
  );
}

function forwardWithPathname(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const campaignRedirect = buildCampaignLaneRedirectUrl(host);
  if (campaignRedirect) {
    return NextResponse.redirect(campaignRedirect, 308);
  }

  const ua = req.headers.get("user-agent");
  if (isBlockedScraperUserAgent(ua)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const pathname = req.nextUrl.pathname;
  const session = getAdminSessionFromRequest(req);

  if (pathname.startsWith("/api/admin") && isSuperAdminOnlyApi(pathname)) {
    if (!session) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Không có quyền truy cập admin." } },
        { status: 403 },
      );
    }
    if (session.role === "ops") {
      return adminForbiddenApi();
    }
  }

  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    isSuperAdminOnlyPage(pathname)
  ) {
    if (!session) {
      const login = new URL("/admin/login", req.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    if (session.role === "ops") {
      return NextResponse.redirect(new URL(defaultAdminHome("ops"), req.url));
    }
  }

  return forwardWithPathname(req);
}

export const config = {
  matcher: [
    {
      source: "/:path*",
      has: [{ type: "host", value: "noxh.timnhaxahoi.com" }],
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: "cctm.timnhaxahoi.com" }],
    },
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/cho-thue/:path*",
    "/mua-ban/:path*",
    "/tin-dang/:path*",
    "/api/search/:path*",
  ],
};
