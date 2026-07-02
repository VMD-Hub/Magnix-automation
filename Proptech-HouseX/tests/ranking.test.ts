import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeQualityScore,
  computeRankScore,
  ageInDays,
} from "../lib/rules/ranking";
import { assertPublishGate } from "../lib/rules/listing-publish-gate";

const baseQuality = {
  photoCount: 0,
  hasVideo: false,
  descriptionLength: 0,
  verified: false,
  hasProject: false,
  hasGeo: false,
};

test("quality: nhiều ảnh hơn → điểm cao hơn (tới trần)", () => {
  const a = computeQualityScore({ ...baseQuality, photoCount: 3 });
  const b = computeQualityScore({ ...baseQuality, photoCount: 8 });
  assert.ok(b > a, `${b} > ${a}`);
});

test("quality: video + verified + project + geo đều cộng điểm", () => {
  const bare = computeQualityScore({ ...baseQuality, photoCount: 5 });
  const rich = computeQualityScore({
    photoCount: 5,
    hasVideo: true,
    descriptionLength: 300,
    verified: true,
    hasProject: true,
    hasGeo: true,
  });
  assert.ok(rich > bare);
  assert.ok(rich <= 100 && rich >= 0);
});

test("quality: cực đại = 100", () => {
  const max = computeQualityScore({
    photoCount: 50,
    hasVideo: true,
    descriptionLength: 5000,
    verified: true,
    hasProject: true,
    hasGeo: true,
  });
  assert.equal(max, 100);
});

const baseRank = {
  qualityScore: 80,
  verified: true,
  ageDays: 1,
  leadCount: 0,
};

test("rank: PREMIUM > VIP > FREE khi mọi yếu tố khác bằng nhau", () => {
  const free = computeRankScore({ ...baseRank, tier: "FREE" });
  const vip = computeRankScore({ ...baseRank, tier: "VIP" });
  const prem = computeRankScore({ ...baseRank, tier: "PREMIUM" });
  assert.ok(prem > vip && vip > free, `${prem} > ${vip} > ${free}`);
});

test("rank: tin mới > tin cũ", () => {
  const fresh = computeRankScore({ ...baseRank, tier: "FREE", ageDays: 0 });
  const old = computeRankScore({ ...baseRank, tier: "FREE", ageDays: 60 });
  assert.ok(fresh > old);
});

test("rank: chất lượng thấp bị phạt (FREE quality cao có thể vượt PREMIUM rác)", () => {
  const premJunk = computeRankScore({
    tier: "PREMIUM",
    qualityScore: 20,
    verified: false,
    ageDays: 1,
    leadCount: 0,
  });
  const freeGood = computeRankScore({
    tier: "FREE",
    qualityScore: 95,
    verified: true,
    ageDays: 1,
    leadCount: 5,
  });
  assert.ok(freeGood > premJunk, `${freeGood} > ${premJunk}`);
});

test("ageInDays: không âm", () => {
  const future = new Date(Date.now() + 10_000);
  assert.equal(ageInDays(future), 0);
});

test("publish gate: thiếu ảnh → PHOTO_MIN", () => {
  const r = assertPublishGate({
    readyImageCount: 2,
    totalVideoCount: 0,
    readyVideoCount: 0,
    descriptionLength: 100,
  });
  assert.equal(r.ok, false);
  assert.equal(r.ok === false && r.code, "PHOTO_MIN");
});

test("publish gate: mô tả ngắn → DESC_MIN", () => {
  const r = assertPublishGate({
    readyImageCount: 5,
    totalVideoCount: 0,
    readyVideoCount: 0,
    descriptionLength: 10,
  });
  assert.equal(r.ok === false && r.code, "DESC_MIN");
});

test("publish gate: video chưa READY → VIDEO_NOT_READY", () => {
  const r = assertPublishGate({
    readyImageCount: 5,
    totalVideoCount: 1,
    readyVideoCount: 0,
    descriptionLength: 100,
  });
  assert.equal(r.ok === false && r.code, "VIDEO_NOT_READY");
});

test("publish gate: đủ điều kiện → ok", () => {
  const r = assertPublishGate({
    readyImageCount: 6,
    totalVideoCount: 1,
    readyVideoCount: 1,
    descriptionLength: 120,
  });
  assert.equal(r.ok, true);
});
