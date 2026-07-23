import assert from "node:assert/strict";
import test from "node:test";
import {
  allNoxhQuangNinhDefs,
  allNoxhQuangNinhSlugs,
  getNoxhQuangNinhDef,
} from "../lib/preview/noxh-quang-ninh-projects";
import { inferPrismaSalesRegionFromProvince } from "../lib/content/noxh-province-registry";

test("Quảng Ninh NOXH: 7 unique slugs", () => {
  const slugs = allNoxhQuangNinhSlugs();
  assert.equal(slugs.length, 7);
  assert.equal(new Set(slugs).size, 7);
});

test("Quảng Ninh: NORTH + Đồi Ngân Hàng enriched", () => {
  for (const def of allNoxhQuangNinhDefs()) {
    assert.equal(def.province, "Quảng Ninh");
    assert.equal(inferPrismaSalesRegionFromProvince(def.province), "NORTH");
  }
  const dn = getNoxhQuangNinhDef("nha-o-xa-hoi-doi-ngan-hang-ha-long");
  assert.ok(dn);
  assert.equal(dn!.totalUnits, 986);
  assert.equal(dn!.blocks, 3);
  assert.match(dn!.developerName, /Toàn Cầu/i);
  assert.match(dn!.developerName, /nhà số 6/i);
  assert.equal(dn!.status, "DANG_BAN");
  assert.equal(dn!.totalArea, 25900);
  assert.match(dn!.description, /986/);
  assert.match(dn!.description, /16[,.]2/);
  assert.match(dn!.description, /Cao Thắng/i);
  assert.doesNotMatch(dn!.description, /hotline CĐT/i);
  assert.equal(dn!.unitTypes[0]?.areaMin, 45);
  assert.equal(dn!.unitTypes[0]?.areaMax, 70);
});
