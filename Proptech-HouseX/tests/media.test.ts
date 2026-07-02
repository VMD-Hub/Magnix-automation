import { test } from "node:test";
import assert from "node:assert/strict";
import { dctPhash, phashHamming } from "../lib/media/phash";
import { evaluateMediaQuality } from "../lib/media/quality";

// Gradient ngang (giá trị phụ thuộc x).
function hGradient(): number[] {
  const a: number[] = [];
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) a.push(Math.min(255, x * 8));
  return a;
}
// Gradient dọc (giá trị phụ thuộc y) — cấu trúc tần số khác hẳn.
function vGradient(): number[] {
  const a: number[] = [];
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) a.push(Math.min(255, y * 8));
  return a;
}

test("dctPhash: deterministic + identical → distance 0", () => {
  const g = hGradient();
  assert.equal(phashHamming(dctPhash(g), dctPhash(g)), 0);
});

test("dctPhash: đổi độ sáng đồng đều → distance nhỏ; ảnh khác cấu trúc → distance lớn", () => {
  const base = hGradient();
  // Tăng sáng đồng đều chỉ ảnh hưởng hệ số DC (bị loại) → pHash gần như bất biến.
  const brighter = base.map((v) => Math.min(255, v + 4));
  const different = vGradient();
  const dBright = phashHamming(dctPhash(base), dctPhash(brighter));
  const dDiff = phashHamming(dctPhash(base), dctPhash(different));
  assert.ok(dBright < dDiff, `dBright=${dBright} dDiff=${dDiff}`);
});

test("dctPhash: sai số pixel đầu vào → ném lỗi", () => {
  assert.throws(() => dctPhash([1, 2, 3]));
});

test("quality: ảnh nhỏ bị từ chối, ảnh đủ lớn pass", () => {
  assert.equal(evaluateMediaQuality({ kind: "image", width: 800, height: 600 }).ok, false);
  assert.equal(evaluateMediaQuality({ kind: "image", width: 1600, height: 1200 }).ok, true);
});

test("quality: video ngắn/độ phân giải thấp bị từ chối", () => {
  assert.equal(
    evaluateMediaQuality({ kind: "video", height: 480, durationSec: 30 }).ok,
    false,
  );
  assert.equal(
    evaluateMediaQuality({ kind: "video", height: 1080, durationSec: 30 }).ok,
    true,
  );
  assert.equal(
    evaluateMediaQuality({ kind: "video", height: 1080, durationSec: 600 }).ok,
    false,
  );
});
