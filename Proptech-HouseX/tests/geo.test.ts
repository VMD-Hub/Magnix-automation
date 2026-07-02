import { test } from "node:test";
import assert from "node:assert/strict";
import { boundingBox, haversineKm } from "../lib/geo/haversine";

test("haversineKm: cùng điểm → 0", () => {
  assert.equal(haversineKm(10.776, 106.700, 10.776, 106.700), 0);
});

test("haversineKm: HCM ↔ Hà Nội ≈ 1140km (±30km)", () => {
  // HCM (10.7769, 106.7009) ↔ Hà Nội (21.0278, 105.8342)
  const d = haversineKm(10.7769, 106.7009, 21.0278, 105.8342);
  assert.ok(d > 1110 && d < 1170, `distance=${d}`);
});

test("haversineKm: ~1km theo vĩ độ", () => {
  const d = haversineKm(10.0, 106.0, 10.009, 106.0); // ~1km bắc
  assert.ok(d > 0.9 && d < 1.1, `distance=${d}`);
});

test("boundingBox: bao trùm điểm cách tâm < bán kính", () => {
  const lat = 10.776;
  const lng = 106.700;
  const box = boundingBox(lat, lng, 5);
  // điểm cách ~3km vẫn nằm trong hộp
  const nearLat = lat + 3 / 111.32;
  assert.ok(nearLat >= box.minLat && nearLat <= box.maxLat);
  assert.ok(box.minLng < lng && box.maxLng > lng);
});

test("boundingBox: rộng hơn theo kinh độ khi gần xích đạo", () => {
  const equator = boundingBox(0, 100, 10);
  const high = boundingBox(60, 100, 10);
  const eqWidth = equator.maxLng - equator.minLng;
  const highWidth = high.maxLng - high.minLng;
  assert.ok(highWidth > eqWidth, `eq=${eqWidth} high=${highWidth}`);
});
