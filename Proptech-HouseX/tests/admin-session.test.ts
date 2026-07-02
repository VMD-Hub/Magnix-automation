import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "../lib/admin/session";

test("admin session: token hợp lệ sau khi tạo", () => {
  const token = createAdminSessionToken();
  assert.equal(verifyAdminSessionToken(token), true);
});

test("admin session: token bị sửa → false", () => {
  const token = createAdminSessionToken();
  assert.equal(verifyAdminSessionToken(`${token}x`), false);
});

test("admin session: token rỗng → false", () => {
  assert.equal(verifyAdminSessionToken(""), false);
  assert.equal(verifyAdminSessionToken(null), false);
});
