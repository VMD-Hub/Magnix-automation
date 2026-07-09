import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildAppSecretProof,
  buildOaOpenApiHeaders,
} from "../lib/zalo/oa-api-headers";

test("buildAppSecretProof — deterministic hex", () => {
  const proof = buildAppSecretProof("token-abc", "secret-xyz");
  assert.match(proof, /^[a-f0-9]{64}$/);
  assert.equal(proof, buildAppSecretProof("token-abc", "secret-xyz"));
});

test("buildOaOpenApiHeaders — kèm appsecret_proof khi có secret", () => {
  const prev = process.env.ZALO_APP_SECRET;
  process.env.ZALO_APP_SECRET = "my-secret";
  const h = buildOaOpenApiHeaders("tok123");
  assert.equal(h.access_token, "tok123");
  assert.equal(h.appsecret_proof, buildAppSecretProof("tok123", "my-secret"));
  if (prev === undefined) delete process.env.ZALO_APP_SECRET;
  else process.env.ZALO_APP_SECRET = prev;
});
