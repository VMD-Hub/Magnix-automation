/**
 * Tests for Zalo auth validation + error mapping (no network).
 */
import assert from "node:assert/strict";
import { zaloAuthSchema } from "../lib/validation/zalo-auth";
import { ZaloAuthError } from "../lib/zalo/graph";
import { isZaloAuthError } from "../lib/auth/zalo-login";

function testZaloAuthSchema() {
  const a = zaloAuthSchema.parse({
    accessToken: "a".repeat(20),
    phone: "0901234567",
  });
  assert.equal(a.phone, "0901234567");

  const b = zaloAuthSchema.parse({
    zaloUserId: "zalo-dev-1",
    phone: "+84901234567",
    preferredRole: "BROKER",
  });
  assert.equal(b.preferredRole, "BROKER");

  const c = zaloAuthSchema.parse({
    accessToken: "a".repeat(20),
    phoneToken: "b".repeat(20),
  });
  assert.equal(c.phoneToken?.length, 20);
  assert.equal(c.phone, undefined);
}

function testZaloAuthError() {
  const err = new ZaloAuthError("ZALO_TOKEN_INVALID", "bad");
  assert.equal(isZaloAuthError(err), true);
  assert.equal(isZaloAuthError(new Error("x")), false);
}

testZaloAuthSchema();
testZaloAuthError();
console.log("ok — zalo-auth validation");
