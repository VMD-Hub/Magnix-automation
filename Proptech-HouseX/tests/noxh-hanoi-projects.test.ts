import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhHanoiDefs,
  allNoxhHanoiSlugs,
  getNoxhHanoiDef,
} from "../lib/preview/noxh-hanoi-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Hà Nội NOXH: 17 unique slugs", () => {
  const slugs = allNoxhHanoiSlugs();
  assert.equal(slugs.length, 17);
  assert.equal(new Set(slugs).size, 17);
  assert.ok(getNoxhHanoiDef("nha-o-xa-hoi-udic-eco-tower-ha-dinh"));
  assert.equal(getNoxhHanoiDef("missing"), null);
});

test("Hà Nội skeletons: province Hà Nội; only researched STT-1 may cite provisional price", () => {
  for (const def of allNoxhHanoiDefs()) {
    assert.equal(def.province, "Hà Nội");
    assert.equal(def.projectType, "NHA_O_XA_HOI");
    assert.equal(def.status, "SAP_MO_BAN");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "NORTH");
    for (const u of def.unitTypes) {
      assert.equal(u.priceFrom ?? null, null);
    }
    if (def.slug !== "nha-o-xa-hoi-udic-eco-tower-ha-dinh") {
      assert.doesNotMatch(def.seoDesc, /\d+\s*(triệu|tỷ)/i);
    }
  }
  const udic = getNoxhHanoiDef("nha-o-xa-hoi-udic-eco-tower-ha-dinh");
  assert.ok(udic);
  assert.match(udic!.address, /NO1/);
  assert.match(udic!.developerName, /Haweicco/);
  assert.equal(udic!.totalUnits, 440);
});
