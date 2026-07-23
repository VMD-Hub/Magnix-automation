import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhGiaLaiDefs,
  allNoxhGiaLaiSlugs,
  getNoxhGiaLaiDef,
} from "../lib/preview/noxh-gia-lai-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Gia Lai NOXH: 7 unique slugs", () => {
  const slugs = allNoxhGiaLaiSlugs();
  assert.equal(slugs.length, 7);
  assert.equal(new Set(slugs).size, 7);
});

test("Gia Lai: CENTRAL + Ecohome Nhơn Bình enriched", () => {
  for (const def of allNoxhGiaLaiDefs()) {
    assert.equal(def.province, "Gia Lai");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "CENTRAL");
  }
  const eco = getNoxhGiaLaiDef("nha-o-xa-hoi-ecohome-nhon-binh");
  assert.ok(eco);
  assert.equal(eco!.totalUnits, 1380);
  assert.equal(eco!.blocks, 5);
  assert.equal(eco!.status, "DA_BAN_GIAO");
  assert.match(eco!.developerName, /Capital House|Ecohome/i);
  assert.match(eco!.description, /Harmony.*Đắk Lắk/i);
});
