import assert from "node:assert/strict";
import { test } from "node:test";
import {
  accountHomeForRole,
  resolvePostAuthPath,
  safeNextPath,
} from "../lib/auth/redirect";

test("safeNextPath blocks open redirect", () => {
  assert.equal(safeNextPath("https://evil.com"), "/");
  assert.equal(safeNextPath("//evil.com"), "/");
  assert.equal(safeNextPath("/khach-hang/tai-khoan"), "/khach-hang/tai-khoan");
});

test("resolvePostAuthPath defaults empty or home to account hub", () => {
  assert.equal(resolvePostAuthPath(null, "CUSTOMER"), "/khach-hang/tai-khoan");
  assert.equal(resolvePostAuthPath("", "CUSTOMER"), "/khach-hang/tai-khoan");
  assert.equal(resolvePostAuthPath("/", "CUSTOMER"), "/khach-hang/tai-khoan");
  assert.equal(resolvePostAuthPath(null, "BROKER"), "/moi-gioi/tai-khoan");
  assert.equal(resolvePostAuthPath("/", "BROKER"), "/moi-gioi/tai-khoan");
});

test("resolvePostAuthPath keeps deep next paths", () => {
  assert.equal(
    resolvePostAuthPath("/tin-dang/ABC", "CUSTOMER"),
    "/tin-dang/ABC",
  );
  assert.equal(
    resolvePostAuthPath("/ops/telesales", "BROKER"),
    "/ops/telesales",
  );
});

test("accountHomeForRole", () => {
  assert.equal(accountHomeForRole("CUSTOMER"), "/khach-hang/tai-khoan");
  assert.equal(accountHomeForRole("BROKER"), "/moi-gioi/tai-khoan");
});
