import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildCampaignLaneRedirectUrl } from "@/lib/miniapp/campaign-lane-host";
import { isBlockedScraperUserAgent } from "@/lib/security/scrape-guard";
import { rewriteLegacyArticleHref } from "@/lib/content/article-routes";

function forwardWithPathname(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

/** 308 cứng — tránh Ahrefs thấy 200 shell RSC không có `<a>` (orphan / no outlinks). */
function seoPermanentRedirect(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;

  if (pathname === "/chuyen-gia" || pathname === "/chuyen-gia/") {
    const url = req.nextUrl.clone();
    url.pathname = "/doi-ngu";
    return NextResponse.redirect(url, 308);
  }

  const rewritten = rewriteLegacyArticleHref(pathname);
  if (rewritten !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = rewritten;
    return NextResponse.redirect(url, 308);
  }

  return null;
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const campaignRedirect = buildCampaignLaneRedirectUrl(host);
  if (campaignRedirect) {
    return NextResponse.redirect(campaignRedirect, 308);
  }

  const seoRedirect = seoPermanentRedirect(req);
  if (seoRedirect) return seoRedirect;

  const ua = req.headers.get("user-agent");
  if (isBlockedScraperUserAgent(ua)) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Auth admin: (dashboard)/layout + route handlers (Node có ADMIN_SECRET).
  // Không verify cookie ở middleware — Edge runtime VPS thường thiếu secret → redirect loop.

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
    "/cho-thue",
    "/cho-thue/:path*",
    "/mua-ban",
    "/mua-ban/:path*",
    "/tin-dang/:path*",
    "/api/search/:path*",
    "/chuyen-gia",
    "/chuyen-gia/",
    "/tin-tuc/:slug",
  ],
};
