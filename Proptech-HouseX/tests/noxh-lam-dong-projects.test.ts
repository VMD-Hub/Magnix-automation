import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhLamDongDefs,
  allNoxhLamDongSlugs,
  getNoxhLamDongDef,
} from "../lib/preview/noxh-lam-dong-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Lâm Đồng NOXH: 6 unique slugs", () => {
  const slugs = allNoxhLamDongSlugs();
  assert.equal(slugs.length, 6);
  assert.equal(new Set(slugs).size, 6);
});

test("Lâm Đồng: SOUTH + Kim Đồng enriched", () => {
  for (const def of allNoxhLamDongDefs()) {
    assert.equal(def.province, "Lâm Đồng");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "SOUTH");
  }
  const kd = getNoxhLamDongDef("nha-o-xa-hoi-kim-dong-da-lat");
  assert.ok(kd);
  assert.equal(kd!.totalUnits, 94);
  assert.match(kd!.developerName, /NNP|Minh Trí/i);
  assert.match(kd!.description, /Khải Thịnh/i);
});
