import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  adminNavGroupsForRole,
  isAdminNavActive,
} from "../lib/admin/nav.ts";

describe("adminNavGroupsForRole", () => {
  it("ops sees CRM, help, and sales (Conversion only)", () => {
    const groups = adminNavGroupsForRole("ops");
    const ids = groups.map((g) => g.id);
    assert.deepEqual(ids, ["crm", "help", "sales"]);
    const crm = groups.find((g) => g.id === "crm")!;
    // Lead marketing / grants / email marketing = Super only; staff telesales dùng /ops/telesales
    assert.ok(!crm.items.some((i) => i.href === "/admin/ops-leads"));
    assert.ok(!crm.items.some((i) => i.href === "/admin/ops-grants"));
    assert.ok(!crm.items.some((i) => i.href === "/admin/email-marketing"));
    assert.ok(crm.items.some((i) => i.href === "/admin/noxh-cases"));
    assert.ok(crm.items.some((i) => i.href === "/admin/conflicts"));
    assert.ok(crm.items.some((i) => i.href === "/admin/inbound-leads"));
    assert.ok(!crm.items.some((i) => i.href === "/admin/ctv"));
    const sales = groups.find((g) => g.id === "sales")!;
    assert.deepEqual(
      sales.items.map((i) => i.href),
      ["/admin/conversion"],
    );
    const help = groups.find((g) => g.id === "help")!;
    assert.ok(help.items.some((i) => i.href === "/admin/playbook"));
  });

  it("super sees content, crm, help, and sales", () => {
    const ids = adminNavGroupsForRole("super").map((g) => g.id);
    assert.deepEqual(ids, ["content", "crm", "help", "sales"]);
  });

  it("super content includes content-queue then tool-analytics; ops does not", () => {
    const superContent = adminNavGroupsForRole("super").find(
      (g) => g.id === "content",
    )!;
    assert.equal(superContent.items[0]?.href, "/admin/content-queue");
    assert.equal(superContent.items[1]?.href, "/admin/tool-analytics");
    assert.ok(
      superContent.items.some((i) => i.href === "/admin/re-service-orgs"),
    );
    const opsGroups = adminNavGroupsForRole("ops");
    assert.ok(
      !opsGroups.some((g) =>
        g.items.some((i) => i.href === "/admin/re-service-orgs"),
      ),
    );
  });

  it("super CRM includes Email marketing next to Lead marketing", () => {
    const crm = adminNavGroupsForRole("super").find((g) => g.id === "crm")!;
    const hrefs = crm.items.map((i) => i.href);
    assert.ok(hrefs.includes("/admin/email-marketing"));
    assert.ok(hrefs.includes("/admin/ops-leads"));
    const emailIdx = hrefs.indexOf("/admin/email-marketing");
    const leadsIdx = hrefs.indexOf("/admin/ops-leads");
    assert.ok(emailIdx === leadsIdx + 1);
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
