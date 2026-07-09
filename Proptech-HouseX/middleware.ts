import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildCampaignLaneRedirectUrl } from "@/lib/miniapp/campaign-lane-host";
import { isBlockedScraperUserAgent } from "@/lib/security/scrape-guard";

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
  return NextResponse.next();
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
    "/cho-thue/:path*",
    "/mua-ban/:path*",
    "/tin-dang/:path*",
    "/api/search/:path*",
  ],
};
