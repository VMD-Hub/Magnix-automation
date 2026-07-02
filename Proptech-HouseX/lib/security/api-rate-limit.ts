import type { NextRequest } from "next/server";
import { isRateLimited } from "@/lib/redis";
import { ipHashFromRequest } from "@/lib/security/client-ip";
import {
  LISTINGS_API_RATE_MAX,
  LISTINGS_API_RATE_WINDOW_SEC,
  SEARCH_API_RATE_MAX,
  SEARCH_API_RATE_WINDOW_SEC,
  scrapeGuardEnabled,
} from "@/lib/security/scrape-guard";

export async function isSearchApiRateLimited(req: NextRequest): Promise<boolean> {
  if (!scrapeGuardEnabled()) return false;
  const ip = ipHashFromRequest(req);
  return isRateLimited(
    `api:search:${ip}`,
    SEARCH_API_RATE_MAX,
    SEARCH_API_RATE_WINDOW_SEC,
  );
}

export async function isListingsApiRateLimited(req: NextRequest): Promise<boolean> {
  if (!scrapeGuardEnabled()) return false;
  const ip = ipHashFromRequest(req);
  return isRateLimited(
    `api:listings:${ip}`,
    LISTINGS_API_RATE_MAX,
    LISTINGS_API_RATE_WINDOW_SEC,
  );
}
