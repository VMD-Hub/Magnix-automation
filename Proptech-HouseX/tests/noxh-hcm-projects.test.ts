import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhHcmDefs,
  allNoxhHcmSlugs,
  getNoxhHcmDef,
} from "../lib/preview/noxh-hcm-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("TP.HCM mega NOXH: 26 unique slugs (HGX excluded)", () => {
  const slugs = allNoxhHcmSlugs();
  assert.equal(slugs.length, 26);
  assert.equal(new Set(slugs).size, 26);
  assert.ok(!slugs.includes("nha-o-xa-hoi-ho-guom-xanh-thuan-an"));
});

test("TP.HCM mega: SOUTH + three enriched projects", () => {
  for (const def of allNoxhHcmDefs()) {
    assert.equal(def.province, "TP. Hồ Chí Minh");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "SOUTH");
  }

  const happy = getNoxhHcmDef("nha-o-xa-hoi-happy-home-long-phuoc");
  assert.ok(happy);
  assert.equal(happy!.status, "SAP_MO_BAN");
  assert.equal(happy!.totalArea, 441600);
  assert.equal(happy!.totalUnits, undefined);
  assert.match(happy!.description, /Cam Ranh/i);

  const phucDat = getNoxhHcmDef("nha-o-xa-hoi-phuc-dat-tan-uyen");
  assert.ok(phucDat);
  assert.equal(phucDat!.status, "DANG_BAN");
  assert.equal(phucDat!.totalUnits, 936);
  assert.equal(phucDat!.blocks, 3);
  assert.equal(phucDat!.totalArea, 11440.8);
  assert.equal(phucDat!.unitTypes[0]?.areaMin, 32);
  assert.equal(phucDat!.unitTypes[0]?.areaMax, 62);

  const eco = getNoxhHcmDef("nha-o-xa-hoi-eco-home-1-phu-my");
  assert.ok(eco);
  assert.equal(eco!.status, "DANG_BAN");
  assert.equal(eco!.totalUnits, 340);
  assert.equal(eco!.totalArea, 3767.5);
  assert.equal(eco!.unitTypes[0]?.areaMin, 32.32);
  assert.equal(eco!.unitTypes[0]?.areaMax, 59.41);
  assert.match(eco!.address, /Phú Mỹ/i);
  assert.doesNotMatch(eco!.address, /P\.11/i);
});
