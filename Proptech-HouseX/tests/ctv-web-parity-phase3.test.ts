import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { AGENT_SUPPORT } from "@/lib/content/agent-support";
import { AGENT_CART_PROJECTS } from "@/lib/ctv/agent-cart-projects";
import {
  DEAL_TIER_OPTIONS,
  DEAL_TIER_LABEL,
} from "@/lib/ctv/deal-tiers";
import { AFFILIATE_DEAL_TIER_VALUES } from "@/lib/validation/noxh-case";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function readSrc(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("Phase 3 — web CTV parity (/moi-gioi)", () => {
  it("ships khai-bao, gio-hang, hoa-hong, ho-so/[id] routes", () => {
    for (const rel of [
      "app/moi-gioi/khai-bao/page.tsx",
      "app/moi-gioi/gio-hang/page.tsx",
      "app/moi-gioi/hoa-hong/page.tsx",
      "app/moi-gioi/ho-so/[id]/page.tsx",
    ]) {
      assert.ok(readSrc(rel).length > 50, rel);
    }
  });

  it("declare form posts dealTier + projectLabel", () => {
    const src = readSrc("components/ctv/ctv-case-drop-form.tsx");
    assert.match(src, /dealTier/);
    assert.match(src, /projectLabel/);
    assert.match(src, /POST/);
    assert.match(src, /\/api\/ctv\/cases/);
  });

  it("cart deep-links to khai-bao?project=", () => {
    const src = readSrc("components/ctv/ctv-cart-grid.tsx");
    assert.match(src, /\/moi-gioi\/khai-bao\?project=/);
    assert.ok(AGENT_CART_PROJECTS.length >= 4);
    assert.ok(AGENT_CART_PROJECTS.some((p) => p.lane === "noxh"));
    assert.ok(AGENT_CART_PROJECTS.some((p) => p.lane === "cctm"));
  });

  it("care form uploads then POSTs /care with multiple images", () => {
    const src = readSrc("components/ctv/ctv-care-form.tsx");
    assert.match(src, /care\/upload/);
    assert.match(src, /\/care/);
    assert.match(src, /imageUrls/);
    assert.match(src, /multiple/);
  });

  it("commissions copy mentions HĐMB", () => {
    const panel = readSrc("components/ctv/ctv-commissions-panel.tsx");
    const summary = readSrc("components/ctv/ctv-commission-summary.tsx");
    assert.match(panel, /HĐMB/);
    assert.match(summary, /HĐMB/);
  });

  it("Help FAB uses shared agent-support contacts", () => {
    const src = readSrc("components/ctv/ctv-help-fab.tsx");
    assert.match(src, /AGENT_SUPPORT/);
    assert.ok(AGENT_SUPPORT.phoneTel.length >= 9);
    assert.match(AGENT_SUPPORT.email, /@/);
    assert.match(AGENT_SUPPORT.zaloUrl, /^https:\/\//);
  });

  it("deal tier options match validation enum", () => {
    assert.deepEqual(
      DEAL_TIER_OPTIONS.map((t) => t.id),
      [...AFFILIATE_DEAL_TIER_VALUES],
    );
    assert.equal(DEAL_TIER_LABEL.CONNECTOR, "Connector");
  });

  it("account hub links to Phase 3 routes", () => {
    const src = readSrc("app/moi-gioi/tai-khoan/page.tsx");
    assert.match(src, /\/moi-gioi\/khai-bao/);
    assert.match(src, /\/moi-gioi\/gio-hang/);
    assert.match(src, /\/moi-gioi\/hoa-hong/);
  });
});
