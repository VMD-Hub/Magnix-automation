import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhDakLakDefs,
  allNoxhDakLakSlugs,
  getNoxhDakLakDef,
} from "../lib/preview/noxh-dak-lak-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Đắk Lắk NOXH: 5 unique slugs", () => {
  const slugs = allNoxhDakLakSlugs();
  assert.equal(slugs.length, 5);
  assert.equal(new Set(slugs).size, 5);
});

test("Đắk Lắk: CENTRAL + Ân Phú enriched", () => {
  for (const def of allNoxhDakLakDefs()) {
    assert.equal(def.province, "Đắk Lắk");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "CENTRAL");
  }
  const ap = getNoxhDakLakDef("nha-o-xa-hoi-an-phu-buon-ma-thuot");
  assert.ok(ap);
  assert.equal(ap!.totalUnits, 330);
  assert.match(ap!.developerName, /Ân Phú/i);
  assert.equal(ap!.status, "DANG_BAN");
  assert.match(ap!.description, /Q3\/2026/i);
  assert.match(ap!.description, /Ecohome Harmony/i);
});
