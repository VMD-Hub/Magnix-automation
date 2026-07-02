import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import {
  createSessionToken,
  verifySessionToken,
} from "../lib/auth/session-token";

test("password: hash và verify khớp", () => {
  const hash = hashPassword("secret123");
  assert.ok(hash.includes(":"));
  assert.equal(verifyPassword("secret123", hash), true);
  assert.equal(verifyPassword("wrong", hash), false);
});

test("session token: hợp lệ sau khi tạo", () => {
  process.env.AUTH_SECRET = "test-secret-key";
  const token = createSessionToken("customer-uuid-1", 1);
  const user = verifySessionToken(token);
  assert.ok(user);
  assert.equal(user!.id, "customer-uuid-1");
});

test("session token: token bị sửa → null", () => {
  process.env.AUTH_SECRET = "test-secret-key";
  const token = createSessionToken("customer-uuid-1", 1);
  const tampered = token.slice(0, -4) + "xxxx";
  assert.equal(verifySessionToken(tampered), null);
});

test("normalizeEmail: lowercase và trim", async () => {
  const { normalizeEmail } = await import("../lib/email/normalize");
  assert.equal(normalizeEmail("  User@Example.COM  "), "user@example.com");
});

test("safeNextPath: chặn open redirect", async () => {
  const { safeNextPath } = await import("../lib/auth/redirect");
  assert.equal(safeNextPath("/tin-dang/HX-1"), "/tin-dang/HX-1");
  assert.equal(safeNextPath("https://evil.com"), "/");
  assert.equal(safeNextPath("//evil.com"), "/");
  assert.equal(safeNextPath(undefined), "/");
});
