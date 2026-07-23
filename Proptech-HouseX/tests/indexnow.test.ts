import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIndexNowPayload,
  INDEXNOW_KEY_COMMITTED,
  INDEXNOW_PRODUCTION_SITE_URL,
  isLocalSiteUrl,
  normalizeIndexNowUrlList,
  resolveIndexNowSiteUrl,
} from "../lib/seo/indexnow";

test("normalizeIndexNowUrlList: relative + absolute same host", () => {
  const site = "https://timnhaxahoi.com";
  const list = normalizeIndexNowUrlList(
    [
      "/du-an/nha-o-xa-hoi/tp-ho-chi-minh",
      "https://timnhaxahoi.com/wiki-nha-o-xa-hoi",
      "https://evil.example/x",
      "/du-an/nha-o-xa-hoi/tp-ho-chi-minh",
    ],
    site,
  );
  assert.deepEqual(list, [
    "https://timnhaxahoi.com/du-an/nha-o-xa-hoi/tp-ho-chi-minh",
    "https://timnhaxahoi.com/wiki-nha-o-xa-hoi",
  ]);
});

test("buildIndexNowPayload includes committed key location", () => {
  const prev = process.env.INDEXNOW_KEY;
  delete process.env.INDEXNOW_KEY;
  const payload = buildIndexNowPayload(
    ["/du-an/nha-o-xa-hoi/dong-nai"],
    { siteUrl: "https://timnhaxahoi.com" },
  );
  assert.ok(payload);
  assert.equal(payload!.host, "timnhaxahoi.com");
  assert.equal(payload!.key, INDEXNOW_KEY_COMMITTED);
  assert.equal(
    payload!.keyLocation,
    `https://timnhaxahoi.com/${INDEXNOW_KEY_COMMITTED}.txt`,
  );
  assert.equal(payload!.urlList.length, 1);
  if (prev === undefined) delete process.env.INDEXNOW_KEY;
  else process.env.INDEXNOW_KEY = prev;
});

test("resolveIndexNowSiteUrl falls back from localhost to production", () => {
  assert.equal(isLocalSiteUrl("http://localhost:3000"), true);
  const prevSite = process.env.NEXT_PUBLIC_SITE_URL;
  const prevIndex = process.env.INDEXNOW_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  delete process.env.INDEXNOW_SITE_URL;
  assert.equal(resolveIndexNowSiteUrl(), INDEXNOW_PRODUCTION_SITE_URL);
  assert.equal(
    resolveIndexNowSiteUrl("http://127.0.0.1:3000"),
    INDEXNOW_PRODUCTION_SITE_URL,
  );
  if (prevSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = prevSite;
  if (prevIndex === undefined) delete process.env.INDEXNOW_SITE_URL;
  else process.env.INDEXNOW_SITE_URL = prevIndex;
});
