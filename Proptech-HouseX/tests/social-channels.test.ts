import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  getHouseXFacebookPageUrl,
  getHouseXZaloOaPublicUrl,
} from "../lib/site-config.ts";

const KEYS = [
  "NEXT_PUBLIC_SOCIAL_ZALO_URL",
  "NEXT_PUBLIC_ZALO_OA_PUBLIC_URL",
  "SOCIAL_ZALO_URL",
  "ZALO_OA_PUBLIC_URL",
  "NEXT_PUBLIC_ZALO_OA_ID",
  "ZALO_OA_ID",
  "NEXT_PUBLIC_SOCIAL_FACEBOOK_URL",
  "SOCIAL_FACEBOOK_URL",
  "FACEBOOK_PAGE_URL",
  "FACEBOOK_PAGE_ID",
  "FB_PAGE_ID",
  "FANPAGE_ID",
] as const;

const prev = new Map<string, string | undefined>();

function clearSocialEnv() {
  for (const k of KEYS) {
    if (!prev.has(k)) prev.set(k, process.env[k]);
    delete process.env[k];
  }
}

afterEach(() => {
  for (const [k, v] of prev) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  prev.clear();
});

describe("getHouseXZaloOaPublicUrl", () => {
  it("ghép từ ZALO_OA_ID", () => {
    clearSocialEnv();
    process.env.ZALO_OA_ID = "1234567890";
    assert.equal(getHouseXZaloOaPublicUrl(), "https://zalo.me/1234567890");
  });

  it("ưu tiên URL đầy đủ", () => {
    clearSocialEnv();
    process.env.ZALO_OA_ID = "123";
    process.env.NEXT_PUBLIC_SOCIAL_ZALO_URL = "https://zalo.me/housex";
    assert.equal(getHouseXZaloOaPublicUrl(), "https://zalo.me/housex");
  });
});

describe("getHouseXFacebookPageUrl", () => {
  it("ghép từ FACEBOOK_PAGE_ID", () => {
    clearSocialEnv();
    process.env.FACEBOOK_PAGE_ID = "timnhaxahoi";
    assert.equal(
      getHouseXFacebookPageUrl(),
      "https://www.facebook.com/timnhaxahoi",
    );
  });

  it("fallback page timnhaxahoi khi không có env", () => {
    clearSocialEnv();
    assert.equal(
      getHouseXFacebookPageUrl(),
      "https://www.facebook.com/timnhaxahoi",
    );
  });
});
