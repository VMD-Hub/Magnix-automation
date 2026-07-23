import assert from "node:assert/strict";
import test from "node:test";
import {
  buildIndexNowPayload,
  INDEXNOW_KEY_COMMITTED,
  normalizeIndexNowUrlList,
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
