import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adminNavGroupsForRole,
  isAdminNavActive,
} from "../lib/admin/nav.ts";

describe("adminNavGroupsForRole", () => {
  it("ops sees CRM and help groups", () => {
    const groups = adminNavGroupsForRole("ops");
    const ids = groups.map((g) => g.id);
    assert.deepEqual(ids, ["crm", "help"]);
    const crm = groups.find((g) => g.id === "crm")!;
    assert.ok(crm.items.some((i) => i.href === "/admin/ops-leads"));
    assert.ok(!crm.items.some((i) => i.href === "/admin/ctv"));
    const help = groups.find((g) => g.id === "help")!;
    assert.ok(help.items.some((i) => i.href === "/admin/playbook"));
  });

  it("super sees content, crm, help, and sales", () => {
    const ids = adminNavGroupsForRole("super").map((g) => g.id);
    assert.deepEqual(ids, ["content", "crm", "help", "sales"]);
  });
});

describe("isAdminNavActive", () => {
  it("matches child paths when matchPrefix", () => {
    const item = {
      href: "/admin/articles",
      label: "Tin tức",
      title: "",
      roles: ["super"] as const,
      matchPrefix: true,
    };
    assert.equal(isAdminNavActive("/admin/articles/abc", item), true);
    assert.equal(isAdminNavActive("/admin/ctv", item), false);
  });
});
