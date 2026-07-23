import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhDanangDefs,
  allNoxhDanangSlugs,
  getNoxhDanangDef,
} from "../lib/preview/noxh-danang-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Đà Nẵng NOXH: 5 unique slugs (exclude EcoLife TM)", () => {
  const slugs = allNoxhDanangSlugs();
  assert.equal(slugs.length, 5);
  assert.equal(new Set(slugs).size, 5);
  assert.ok(!slugs.some((s) => s.includes("ecolife")));
});

test("Đà Nẵng: province + CENTRAL; Đại Địa Bảo enriched", () => {
  for (const def of allNoxhDanangDefs()) {
    assert.equal(def.province, "TP. Đà Nẵng");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "CENTRAL");
    for (const u of def.unitTypes) {
      assert.equal(u.priceFrom ?? null, null);
    }
  }
  const ddb = getNoxhDanangDef("nha-o-xa-hoi-dai-dia-bao-son-tra");
  assert.ok(ddb);
  assert.equal(ddb!.totalUnits, 739);
  assert.match(ddb!.developerName, /579/);
});
