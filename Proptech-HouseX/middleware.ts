import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildCampaignLaneRedirectUrl } from "@/lib/miniapp/campaign-lane-host";
import { isBlockedScraperUserAgent } from "@/lib/security/scrape-guard";
import {
  rewriteLegacyArticleHref,
  topicPath,
} from "@/lib/content/article-routes";
import { LEGACY_NOXH_TOPIC_REDIRECTS } from "@/lib/content/articles/noxh-handbook-tags";
import {
  getNoxhProvinceBySlug,
  NOXH_LEGACY_HUB_REDIRECTS,
  NOXH_PROVINCE_HUB_BASE,
  resolveNoxhLegacyHubRedirectPath,
} from "@/lib/content/noxh-province-registry";

function forwardWithPathname(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

function redirectPath(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 308);
}

function resolveTopicDestination(tagSlug: string): string {
  return LEGACY_NOXH_TOPIC_REDIRECTS[tagSlug] ?? topicPath(tagSlug);
}

/** 308 cứng — URL cũ → canonical mới (unify naming). */
function seoPermanentRedirect(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const path = pathname.replace(/\/$/, "") || "/";

  // Exact hubs / tools
  const exact: Record<string, string> = {
    "/cam-nang-noxh": "/wiki-nha-o-xa-hoi",
    "/tin-tuc/cam-nang-noxh": "/wiki-nha-o-xa-hoi",
    "/tai-chinh": "/vay-mua-nha",
    "/tai-chinh/vay-mua-nha": "/vay-mua-nha/can-ho",
    "/vay-mua-nha/vay-mua-nha": "/vay-mua-nha/can-ho",
    "/noi-that": "/thiet-ke-thi-cong-noi-that",
    "/cong-cu/tinh-khoan-vay": "/tinh-tra-gop",
    "/chuyen-gia": "/doi-ngu",
    "/dang-tin": "/moi-gioi/dang-tin",
  };
  if (exact[path]) {
    return redirectPath(req, exact[path]);
  }

  // Prefix silos
  if (path.startsWith("/tin-tuc/cam-nang-noxh/")) {
    return redirectPath(
      req,
      `/wiki-nha-o-xa-hoi/${path.slice("/tin-tuc/cam-nang-noxh/".length)}`,
    );
  }
  if (path.startsWith("/tai-chinh/")) {
    return redirectPath(req, `/vay-mua-nha/${path.slice("/tai-chinh/".length)}`);
  }
  if (path.startsWith("/noi-that/")) {
    return redirectPath(
      req,
      `/thiet-ke-thi-cong-noi-that/${path.slice("/noi-that/".length)}`,
    );
  }

  // Hub tỉnh NOXH — slug địa giới cũ → canonical (308);
  // hubEnabled=false / slug lạ → HTTP 404 (Next soft-200 không đủ).
  const noxhProvinceSeg = path.match(/^\/du-an\/nha-o-xa-hoi\/([^/]+)\/?$/);
  if (noxhProvinceSeg?.[1]) {
    const provinceSlug = noxhProvinceSeg[1];
    if (provinceSlug in NOXH_LEGACY_HUB_REDIRECTS) {
      return redirectPath(
        req,
        resolveNoxhLegacyHubRedirectPath(provinceSlug) || NOXH_PROVINCE_HUB_BASE,
      );
    }
    const entry = getNoxhProvinceBySlug(provinceSlug);
    if (!entry?.hubEnabled) {
      return new NextResponse("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  }

  const bareChuDe = pathname.match(/^\/chu-de\/([^/]+)\/?$/);
  if (bareChuDe?.[1]) {
    return redirectPath(req, resolveTopicDestination(bareChuDe[1]));
  }

  const legacyTopic = pathname.match(/^\/tin-tuc\/chu-de\/([^/]+)\/?$/);
  if (legacyTopic?.[1]) {
    return redirectPath(req, resolveTopicDestination(legacyTopic[1]));
  }

  const rewritten = rewriteLegacyArticleHref(pathname);
  if (rewritten !== pathname) {
    return redirectPath(req, rewritten);
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
    "/dang-tin",
    "/dang-tin/",
    "/cam-nang-noxh",
    "/cam-nang-noxh/",
    "/tin-tuc/cam-nang-noxh",
    "/tin-tuc/cam-nang-noxh/:path*",
    "/tai-chinh",
    "/tai-chinh/:path*",
    "/noi-that",
    "/noi-that/:path*",
    "/cong-cu/tinh-khoan-vay",
    "/cong-cu/tinh-khoan-vay/",
    "/vay-mua-nha/vay-mua-nha",
    "/vay-mua-nha/vay-mua-nha/",
    "/chu-de/:slug",
    "/tin-tuc/:slug",
    "/tin-tuc/chu-de/:tag",
    "/du-an/nha-o-xa-hoi/:province",
  ],
};
