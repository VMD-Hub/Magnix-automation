import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  computeAffiliateCommission,
  DEAL_TIER_COMMISSION_RATE,
} from "@/lib/affiliate/commission-calc";
import {
  computeExtendedExclusiveExpiry,
  EXCLUSIVE_MAX_CALENDAR_DAYS,
  EXTEND_MAX_CALENDAR_DAYS,
  SILENT_RELEASE_CALENDAR_DAYS,
} from "@/lib/affiliate/exclusivity";
import {
  adminCareRejectSchema,
  adminExclusiveExtendSchema,
  adminHdmbSchema,
} from "@/lib/validation/noxh-case";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function readSrc(rel: string) {
  return readFileSync(path.join(root, rel), "utf8");
}

describe("Phase 4 — Ops Admin affiliate", () => {
  it("ships admin API routes for HĐMB, care reject, +15, site-visit", () => {
    for (const rel of [
      "app/api/admin/noxh-cases/[id]/hdmb/route.ts",
      "app/api/admin/noxh-cases/[id]/care/[activityId]/reject/route.ts",
      "app/api/admin/noxh-cases/[id]/exclusive/extend/route.ts",
      "app/api/admin/noxh-cases/[id]/site-visit/verify/route.ts",
      "app/api/ctv/cases/[id]/exclusive/extend/route.ts",
    ]) {
      assert.ok(readSrc(rel).length > 80, rel);
    }
  });

  it("validates HĐMB / reject / extend bodies", () => {
    assert.equal(adminHdmbSchema.parse({ hdmbBaseAmount: 980_000_000 }).hdmbBaseAmount, 980_000_000);
    assert.throws(() => adminHdmbSchema.parse({ hdmbBaseAmount: 0 }));
    assert.equal(
      adminCareRejectSchema.parse({ reason: "Ảnh giả" }).reason,
      "Ảnh giả",
    );
    assert.equal(
      adminExclusiveExtendSchema.parse({ action: "approve" }).action,
      "approve",
    );
  });

  it("HH preview matches SoT % × HĐMB × tier", () => {
    const hdmb = 1_000_000_000;
    const c = computeAffiliateCommission({
      dealTier: "CONNECTOR",
      hdmbBaseAmount: hdmb,
      siteVisitBonusVerified: true,
    });
    assert.equal(c.rate, DEAL_TIER_COMMISSION_RATE.CONNECTOR);
    assert.equal(c.baseCommission, 5_000_000);
    assert.equal(c.siteVisitBonus, 500_000);
    assert.equal(c.totalAmount, 5_500_000);
  });

  it("exclusive constants are 60 / 30 / +15", () => {
    assert.equal(EXCLUSIVE_MAX_CALENDAR_DAYS, 60);
    assert.equal(SILENT_RELEASE_CALENDAR_DAYS, 30);
    assert.equal(EXTEND_MAX_CALENDAR_DAYS, 15);
    const base = new Date("2026-08-01T00:00:00");
    const next = computeExtendedExclusiveExpiry(base, base);
    assert.equal(next.getDate(), 16);
  });

  it("M5 accrual passes affiliate fields; assist does not auto-extend", () => {
    const src = readSrc("lib/data/noxh-case.ts");
    assert.match(src, /hdmbBaseAmount:\s*existing\.hdmbBaseAmount/);
    assert.match(src, /siteVisitBonusVerified:\s*existing\.siteVisitBonusVerified/);
    assert.match(src, /EXTEND_REQUESTED/);
    assert.doesNotMatch(
      src,
      /data:\s*\{\s*lockExpiresAt:\s*nextExpiry\s*\}/,
    );
  });

  it("admin board wires affiliate ops panel", () => {
    const board = readSrc("components/admin/noxh-case-board.tsx");
    const panel = readSrc("components/admin/noxh-affiliate-ops-panel.tsx");
    assert.match(board, /NoxhAffiliateOpsPanel/);
    assert.match(panel, /\/hdmb/);
    assert.match(panel, /site-visit\/verify/);
    assert.match(panel, /exclusive\/extend/);
    assert.match(panel, /care\/.*\/reject/);
    assert.match(panel, /partnerContractStatus/);
  });

  it("playbooks no longer say 20 ngày LV as lock rule", () => {
    const playbook = readSrc("lib/admin/ops-playbook-sections.ts");
    const ops = readSrc("docs/OPS_PLAYBOOK.md");
    assert.match(playbook, /60 ngày/);
    assert.match(playbook, /\+15/);
    assert.doesNotMatch(playbook, /Lock CTV hết 20 ngày LV/);
    assert.match(ops, /60 ngày dương lịch/);
  });
});
