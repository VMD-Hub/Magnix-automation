import assert from "node:assert/strict";
import test from "node:test";
import {
  isAllowedSearchBot,
  isBlockedScraperUserAgent,
} from "../lib/security/scrape-guard";

test("scrape guard: Googlebot không bị chặn", () => {
  assert.equal(
    isBlockedScraperUserAgent(
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    ),
    false,
  );
  assert.equal(isAllowedSearchBot("Googlebot/2.1"), true);
});

test("scrape guard: scrapy / curl bị chặn", () => {
  const prev = process.env.SCRAPE_GUARD_ENABLED;
  process.env.SCRAPE_GUARD_ENABLED = "true";
  try {
    assert.equal(isBlockedScraperUserAgent("python-requests/2.31.0"), true);
    assert.equal(isBlockedScraperUserAgent("curl/8.4.0"), true);
    assert.equal(isBlockedScraperUserAgent("Scrapy/2.11"), true);
  } finally {
    if (prev === undefined) delete process.env.SCRAPE_GUARD_ENABLED;
    else process.env.SCRAPE_GUARD_ENABLED = prev;
  }
});

test("scrape guard: trình duyệt thật không bị chặn", () => {
  const chrome =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
  assert.equal(isBlockedScraperUserAgent(chrome), false);
});
