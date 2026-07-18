import assert from "node:assert/strict";
import { test } from "node:test";
import {
  accountHomeForRole,
  postListingHrefForSession,
  resolveAuthPageRedirect,
  resolvePostAuthPath,
  safeNextPath,
} from "../lib/auth/redirect";
import { initialsFromName } from "../lib/auth/client-session";

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

test("postListingHrefForSession maps guest broker customer", () => {
  assert.equal(postListingHrefForSession(null), "/dang-ky/moi-gioi");
  assert.equal(postListingHrefForSession(undefined), "/dang-ky/moi-gioi");
  assert.equal(postListingHrefForSession("BROKER"), "/moi-gioi/dang-tin");
  assert.equal(postListingHrefForSession("CUSTOMER"), "/dang-tin");
});

test("resolveAuthPageRedirect sends logged-in users to hub", () => {
  assert.equal(
    resolveAuthPageRedirect(null, "BROKER"),
    "/moi-gioi/tai-khoan",
  );
  assert.equal(
    resolveAuthPageRedirect("/moi-gioi/dang-tin", "BROKER"),
    "/moi-gioi/dang-tin",
  );
  assert.equal(
    resolveAuthPageRedirect("/", "CUSTOMER"),
    "/khach-hang/tai-khoan",
  );
});

test("initialsFromName", () => {
  assert.equal(initialsFromName("Nguyễn Vũ Gpl"), "NG");
  assert.equal(initialsFromName("An"), "AN");
  assert.equal(initialsFromName("  "), "?");
});
