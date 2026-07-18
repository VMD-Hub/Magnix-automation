import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import {
  createAdminSessionToken,
  ADMIN_COOKIE,
} from "../lib/admin/session";
import {
  OpsTelesalesAccessError,
  requireOpsTelesalesAccess,
} from "../lib/admin/ops-telesales-access";
import { OpsToolGrantError, resolveUserAccountForGrant } from "../lib/admin/ops-tool-grants";
import { isAllowedHandoffNext } from "../lib/auth/miniapp-handoff";

test("handoff allowlist includes /ops/telesales", () => {
  assert.equal(isAllowedHandoffNext("/ops/telesales"), true);
  assert.equal(isAllowedHandoffNext("/admin/ops-leads"), false);
});

test("resolveUserAccountForGrant requires phone or zalo id", async () => {
  await assert.rejects(
    () => resolveUserAccountForGrant({}),
    (err: unknown) =>
      err instanceof OpsToolGrantError && err.code === "VALIDATION",
  );
});

test("isPlaceholderHouseXEmail detects zalo local emails", async () => {
  const { isPlaceholderHouseXEmail } = await import(
    "../lib/admin/ops-tool-grants"
  );
  assert.equal(isPlaceholderHouseXEmail("zalo_abc@users.housex.local"), true);
  assert.equal(isPlaceholderHouseXEmail("ops@company.com"), false);
});

test("requireOpsTelesalesAccess: super cookie allowed", async () => {
  const prev = process.env.ADMIN_SECRET;
  process.env.ADMIN_SECRET = "super-secret-32-chars-minimum!!";
  const token = createAdminSessionToken("super");
  const req = new NextRequest("http://localhost/api/admin/ops-leads", {
    headers: { cookie: `${ADMIN_COOKIE}=${token}` },
  });
  const access = await requireOpsTelesalesAccess(req);
  assert.equal(access.mode, "super");
  if (prev === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = prev;
});

test("requireOpsTelesalesAccess: ops secret alone forbidden", async () => {
  const prevSuper = process.env.ADMIN_SECRET;
  const prevOps = process.env.ADMIN_OPS_SECRET;
  process.env.ADMIN_SECRET = "super-secret-32-chars-minimum!!";
  process.env.ADMIN_OPS_SECRET = "ops-secret-32-chars-minimum!!!!";
  const req = new NextRequest("http://localhost/api/admin/ops-leads", {
    headers: { "x-admin-secret": "ops-secret-32-chars-minimum!!!!" },
  });
  await assert.rejects(
    () => requireOpsTelesalesAccess(req),
    (err: unknown) =>
      err instanceof OpsTelesalesAccessError && err.code === "FORBIDDEN",
  );
  if (prevSuper === undefined) delete process.env.ADMIN_SECRET;
  else process.env.ADMIN_SECRET = prevSuper;
  if (prevOps === undefined) delete process.env.ADMIN_OPS_SECRET;
  else process.env.ADMIN_OPS_SECRET = prevOps;
});
