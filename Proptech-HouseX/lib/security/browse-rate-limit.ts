import { headers } from "next/headers";
import { isRateLimited } from "@/lib/redis";
import { ipHashFromHeaders } from "@/lib/security/client-ip";
import {
  BROWSE_RATE_MAX,
  BROWSE_RATE_WINDOW_SEC,
  scrapeGuardEnabled,
} from "@/lib/security/scrape-guard";

/** Rate limit trang browse SSR (mua-ban, cho-thue, tin-dang). Trả true nếu vượt ngưỡng. */
export async function isBrowseRateLimited(): Promise<boolean> {
  if (!scrapeGuardEnabled()) return false;
  const h = await headers();
  const ip = ipHashFromHeaders(h);
  return isRateLimited(`browse:${ip}`, BROWSE_RATE_MAX, BROWSE_RATE_WINDOW_SEC);
}
