/**
 * Tests for miniapp handoff code (no network).
 */
import assert from "node:assert/strict";
import {
  createMiniappHandoffCode,
  isAllowedHandoffNext,
  verifyMiniappHandoffCode,
} from "../lib/auth/miniapp-handoff";

function testCreateVerify() {
  const { code, expiresIn } = createMiniappHandoffCode("acc-test-1");
  assert.equal(expiresIn, 60);
  assert.equal(verifyMiniappHandoffCode(code), "acc-test-1");
  assert.equal(verifyMiniappHandoffCode("bad"), null);
  assert.equal(verifyMiniappHandoffCode(`${code}x`), null);
}

function testAllowlist() {
  assert.equal(isAllowedHandoffNext("/khach-hang/tai-khoan"), true);
  assert.equal(isAllowedHandoffNext("/moi-gioi/tai-khoan"), true);
  assert.equal(isAllowedHandoffNext("/admin"), false);
}

testCreateVerify();
testAllowlist();
console.log("ok — miniapp-handoff");
