/** Bật chống scrape mặc định; set SCRAPE_GUARD_ENABLED=false để tắt (dev). */
export function scrapeGuardEnabled(): boolean {
  return process.env.SCRAPE_GUARD_ENABLED !== "false";
}

/** Bot tìm kiếm hợp lệ — không chặn. */
const ALLOWED_BOT_UA =
  /googlebot|bingbot|applebot|yandexbot|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot/i;

/** User-Agent scraper phổ biến — chặn ở middleware. */
const BLOCKED_SCRAPER_UA =
  /scrapy|python-requests|aiohttp|httpx|go-http-client|java\/|libwww-perl|wget|curl\/|httpclient|okhttp|postmanruntime|insomnia|headlesschrome|phantomjs|selenium|puppeteer/i;

export function isAllowedSearchBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return ALLOWED_BOT_UA.test(userAgent);
}

/** Trả true nếu nên chặn request (scraper rõ ràng, không phải bot tìm kiếm). */
export function isBlockedScraperUserAgent(userAgent: string | null): boolean {
  if (!scrapeGuardEnabled()) return false;
  if (!userAgent || userAgent.trim().length < 8) return false;
  if (isAllowedSearchBot(userAgent)) return false;
  return BLOCKED_SCRAPER_UA.test(userAgent);
}

export const BROWSE_RATE_MAX = Number(process.env.BROWSE_RATE_MAX ?? "180");
export const BROWSE_RATE_WINDOW_SEC = Number(process.env.BROWSE_RATE_WINDOW_SEC ?? "60");
export const SEARCH_API_RATE_MAX = Number(process.env.SEARCH_API_RATE_MAX ?? "60");
export const SEARCH_API_RATE_WINDOW_SEC = Number(
  process.env.SEARCH_API_RATE_WINDOW_SEC ?? "60",
);
export const LISTINGS_API_RATE_MAX = Number(process.env.LISTINGS_API_RATE_MAX ?? "60");
export const LISTINGS_API_RATE_WINDOW_SEC = Number(
  process.env.LISTINGS_API_RATE_WINDOW_SEC ?? "60",
);
