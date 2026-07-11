import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adminNavGroupsForRole,
  isAdminNavActive,
} from "../lib/admin/nav.ts";

describe("adminNavGroupsForRole", () => {
  it("ops sees CRM group only", () => {
    const groups = adminNavGroupsForRole("ops");
    assert.ok(groups.every((g) => g.id === "crm"));
    assert.ok(groups[0].items.some((i) => i.href === "/admin/ops-leads"));
    assert.ok(!groups[0].items.some((i) => i.href === "/admin/ctv"));
  });

  it("super sees content, crm, and sales", () => {
    const ids = adminNavGroupsForRole("super").map((g) => g.id);
    assert.deepEqual(ids, ["content", "crm", "sales"]);
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
