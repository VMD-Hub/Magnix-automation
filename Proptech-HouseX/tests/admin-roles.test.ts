import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createAdminSessionToken,
  parseAdminSessionToken,
  resolveAdminRoleFromSecret,
  verifyAdminSessionToken,
} from "../lib/admin/session";
import {
  defaultAdminHome,
  isOpsAdminApi,
  isSuperAdminOnlyApi,
  isSuperAdminOnlyPage,
} from "../lib/admin/roles";

test("admin session: token super hợp lệ", () => {
  const token = createAdminSessionToken("super");
  const parsed = parseAdminSessionToken(token);
  assert.equal(parsed?.role, "super");
  assert.equal(verifyAdminSessionToken(token), true);
});

test("admin session: token ops hợp lệ", () => {
  const token = createAdminSessionToken("ops");
  assert.equal(parseAdminSessionToken(token)?.role, "ops");
});

test("admin session: resolve secret super vs ops", () => {
  const prevSuper = process.env.ADMIN_SECRET;
  const prevOps = process.env.ADMIN_OPS_SECRET;
  process.env.ADMIN_SECRET = "super-secret-32-chars-minimum!!";
  process.env.ADMIN_OPS_SECRET = "ops-secret-32-chars-minimum!!!!";

  assert.equal(resolveAdminRoleFromSecret("super-secret-32-chars-minimum!!"), "super");
  assert.equal(resolveAdminRoleFromSecret("ops-secret-32-chars-minimum!!!!"), "ops");
  assert.equal(resolveAdminRoleFromSecret("wrong"), null);

  if (prevSuper === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = prevSuper;
  if (prevOps === undefined) delete process.env.ADMIN_OPS_SECRET;
  else process.env.ADMIN_OPS_SECRET = prevOps;
});

test("admin roles: ops page vs super page", () => {
  assert.equal(isSuperAdminOnlyPage("/admin/ops-leads"), false);
  assert.equal(isSuperAdminOnlyPage("/admin/conflicts"), false);
  assert.equal(isSuperAdminOnlyPage("/admin/listings"), true);
  assert.equal(defaultAdminHome("ops"), "/admin/ops-leads");
});

test("admin roles: ops api vs super api", () => {
  assert.equal(isOpsAdminApi("/api/admin/ops-leads"), true);
  assert.equal(isOpsAdminApi("/api/admin/session"), true);
  assert.equal(isSuperAdminOnlyApi("/api/admin/listings"), true);
  assert.equal(isSuperAdminOnlyApi("/api/admin/ops-leads"), false);
});
