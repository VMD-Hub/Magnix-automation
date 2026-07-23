import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhDongThapDefs,
  allNoxhDongThapSlugs,
  getNoxhDongThapDef,
} from "../lib/preview/noxh-dong-thap-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Đồng Tháp NOXH: 6 unique slugs", () => {
  const slugs = allNoxhDongThapSlugs();
  assert.equal(slugs.length, 6);
  assert.equal(new Set(slugs).size, 6);
});

test("Đồng Tháp: SOUTH + Rivera Garden enriched", () => {
  for (const def of allNoxhDongThapDefs()) {
    assert.equal(def.province, "Đồng Tháp");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "SOUTH");
  }
  const rg = getNoxhDongThapDef("nha-o-xa-hoi-rivera-garden-my-tho");
  assert.ok(rg);
  assert.equal(rg!.totalUnits, 216);
  assert.match(rg!.developerName, /Long Giang/);
  assert.match(rg!.address, /Nguyễn Tri Phương/);
});
