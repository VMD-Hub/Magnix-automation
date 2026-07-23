import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhBacNinhDefs,
  allNoxhBacNinhSlugs,
  getNoxhBacNinhDef,
} from "../lib/preview/noxh-bac-ninh-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Bắc Ninh NOXH: 15 unique slugs", () => {
  const slugs = allNoxhBacNinhSlugs();
  assert.equal(slugs.length, 15);
  assert.equal(new Set(slugs).size, 15);
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

test("Bắc Ninh: Evergreen Bắc Giang (Nếnh) enriched", () => {
  const eg = getNoxhBacNinhDef("nha-o-xa-hoi-evergreen-bac-giang-van-trung");
  assert.ok(eg);
  assert.equal(eg!.totalUnits, 3300);
  assert.equal(eg!.blocks, 10);
  assert.equal(eg!.totalArea, 32271);
  assert.equal(eg!.status, "DANG_BAN");
  assert.equal(eg!.ward, "Nếnh");
  assert.equal(eg!.unitTypes[0]!.areaMin, 28);
  assert.equal(eg!.unitTypes[0]!.areaMax, 70);
  assert.match(eg!.developerName, /Sài Gòn-Hải Phòng/i);
  assert.match(eg!.developerName, /Evergreen Bắc Giang/i);
  assert.match(eg!.description, /Nếnh/i);
  assert.match(eg!.description, /KCN Vân Trung/i);
  assert.match(eg!.description, /12[,.–-]13[,.]5|12–13/);
  assert.doesNotMatch(eg!.description, /hotline CĐT/i);
  const hud2 = getNoxhBacNinhDef("nha-o-xa-hoi-evergreen-bac-ninh");
  assert.ok(hud2);
  assert.notEqual(hud2!.slug, eg!.slug);
});
