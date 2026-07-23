import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhBacNinhDefs,
  allNoxhBacNinhSlugs,
  getNoxhBacNinhDef,
} from "../lib/preview/noxh-bac-ninh-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Bắc Ninh NOXH: 8 unique slugs", () => {
  const slugs = allNoxhBacNinhSlugs();
  assert.equal(slugs.length, 8);
  assert.equal(new Set(slugs).size, 8);
});

test("Bắc Ninh: NORTH + Cát Tường enriched", () => {
  for (const def of allNoxhBacNinhDefs()) {
    assert.equal(def.province, "Bắc Ninh");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "NORTH");
  }
  const ct = getNoxhBacNinhDef("nha-o-xa-hoi-cat-tuong-smart-city");
  assert.ok(ct);
  assert.equal(ct!.totalUnits, 1040);
  assert.equal(ct!.blocks, 9);
  assert.match(ct!.developerName, /Cát Tường/i);
  assert.equal(ct!.status, "DANG_BAN");
  assert.match(ct!.description, /1\.040|1040/);
  assert.match(ct!.description, /Samsung/i);
  assert.match(ct!.description, /15[,.]4|16[,.]3/);
  assert.doesNotMatch(ct!.description, /hotline CĐT/i);
});
