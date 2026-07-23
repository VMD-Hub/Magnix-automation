import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhAnGiangDefs,
  allNoxhAnGiangSlugs,
  getNoxhAnGiangDef,
} from "../lib/preview/noxh-an-giang-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("An Giang NOXH: 8 unique slugs", () => {
  const slugs = allNoxhAnGiangSlugs();
  assert.equal(slugs.length, 8);
  assert.equal(new Set(slugs).size, 8);
});

test("An Giang: SOUTH + CIC Tây Bắc enriched", () => {
  for (const def of allNoxhAnGiangDefs()) {
    assert.equal(def.province, "An Giang");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "SOUTH");
  }
  const cic = getNoxhAnGiangDef("nha-o-xa-hoi-cic-lan-bien-tay-bac-rach-gia");
  assert.ok(cic);
  assert.equal(cic!.totalUnits, 1011);
  assert.match(cic!.developerName, /CIC/);
  assert.match(cic!.description, /liền kề|trệt/i);
});
