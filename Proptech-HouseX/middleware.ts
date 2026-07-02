import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isBlockedScraperUserAgent } from "@/lib/security/scrape-guard";

export function middleware(req: NextRequest) {
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
    "/cho-thue/:path*",
    "/mua-ban/:path*",
    "/tin-dang/:path*",
    "/api/search/:path*",
  ],
};
