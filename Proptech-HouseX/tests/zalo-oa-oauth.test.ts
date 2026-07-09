import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildOaPermissionUrl,
  createPkceCookieValue,
  createPkcePair,
  getOaCallbackUrl,
  readPkceVerifierFromCookie,
} from "../lib/zalo/oa-oauth";

test("createPkcePair — challenge là SHA256 base64url của verifier", () => {
  const { verifier, challenge } = createPkcePair();
  assert.ok(verifier.length >= 43);
  assert.ok(challenge.length >= 43);
  assert.notEqual(verifier, challenge);
});

test("getOaCallbackUrl — từ NEXT_PUBLIC_SITE_URL", () => {
  const prevSite = process.env.NEXT_PUBLIC_SITE_URL;
  const prevOverride = process.env.ZALO_OA_CALLBACK_URL;
  delete process.env.ZALO_OA_CALLBACK_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://timnhaxahoi.com/";

  assert.equal(
    getOaCallbackUrl(),
    "https://timnhaxahoi.com/api/zalo/oa/callback",
  );

  process.env.ZALO_OA_CALLBACK_URL = "https://timnhaxahoi.com/custom/cb";
  assert.equal(getOaCallbackUrl(), "https://timnhaxahoi.com/custom/cb");

  if (prevSite === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = prevSite;
  if (prevOverride === undefined) delete process.env.ZALO_OA_CALLBACK_URL;
  else process.env.ZALO_OA_CALLBACK_URL = prevOverride;
});

test("buildOaPermissionUrl — encode redirect_uri", () => {
  const url = buildOaPermissionUrl({
    appId: "1837365611738849660",
    redirectUri: "https://timnhaxahoi.com/api/zalo/oa/callback",
    codeChallenge: "abc123",
  });
  assert.match(url, /^https:\/\/oauth\.zaloapp\.com\/v4\/oa\/permission\?/);
  assert.match(url, /app_id=1837365611738849660/);
  assert.match(url, /redirect_uri=https%3A%2F%2Ftimnhaxahoi\.com%2Fapi%2Fzalo%2Foa%2Fcallback/);
});

test("PKCE cookie round-trip", () => {
  const prev = process.env.ADMIN_SECRET;
  process.env.ADMIN_SECRET = "a".repeat(32);

  const { verifier } = createPkcePair();
  const cookie = createPkceCookieValue(verifier);
  assert.equal(readPkceVerifierFromCookie(cookie), verifier);
  assert.equal(readPkceVerifierFromCookie("tampered"), null);

  if (prev === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = prev;
});
