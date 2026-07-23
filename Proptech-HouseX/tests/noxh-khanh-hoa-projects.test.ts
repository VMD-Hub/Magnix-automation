import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhKhanhHoaDefs,
  allNoxhKhanhHoaSlugs,
  getNoxhKhanhHoaDef,
} from "../lib/preview/noxh-khanh-hoa-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Khánh Hòa NOXH: 7 unique slugs", () => {
  const slugs = allNoxhKhanhHoaSlugs();
  assert.equal(slugs.length, 7);
  assert.equal(new Set(slugs).size, 7);
});

test("Khánh Hòa: CENTRAL + Happy Home Cam Ranh enriched", () => {
  for (const def of allNoxhKhanhHoaDefs()) {
    assert.equal(def.province, "Khánh Hòa");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "CENTRAL");
  }
  const hh = getNoxhKhanhHoaDef("nha-o-xa-hoi-happy-home-cam-ranh");
  assert.ok(hh);
  assert.equal(hh!.totalUnits, 3565);
  assert.match(hh!.developerName, /Muối Cam Ranh|Vinhomes/i);
  assert.match(hh!.description, /không nhầm|Nhơn Trạch/i);
});
