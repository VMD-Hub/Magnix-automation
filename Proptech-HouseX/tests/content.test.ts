import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeText, shingles } from "../lib/content/normalize";
import { simhash, hammingDistance } from "../lib/content/simhash";
import { computeFingerprint } from "../lib/content/fingerprint";
import { evaluateContent } from "../lib/rules/listing-content-gate";

test("normalizeText strips url, phone, punctuation", () => {
  const out = normalizeText("Bán GẤP!! Gọi 0901234567 http://x.com nhà đẹp.");
  assert.ok(!out.includes("0901234567"));
  assert.ok(!out.includes("http"));
  assert.ok(!out.includes("!"));
  assert.ok(out.includes("nhà đẹp"));
});

test("shingles produce 2-grams", () => {
  assert.deepEqual(shingles("a b c", 2), ["a b", "b c"]);
});

test("simhash: identical text → distance 0", () => {
  const a = simhash(shingles(normalizeText("căn hộ 2 phòng ngủ view sông đẹp")));
  const b = simhash(shingles(normalizeText("căn hộ 2 phòng ngủ view sông đẹp")));
  assert.equal(hammingDistance(a, b), 0);
});

test("simhash: reworded near text → small distance; different text → larger", () => {
  const base = simhash(shingles(normalizeText("căn hộ 2 phòng ngủ view sông thoáng mát đầy đủ nội thất")));
  const near = simhash(shingles(normalizeText("căn hộ 2 phòng ngủ view sông thoáng mát nội thất đầy đủ")));
  const far = simhash(shingles(normalizeText("bán đất nền khu công nghiệp giá rẻ sổ đỏ riêng")));
  assert.ok(hammingDistance(base, near) < hammingDistance(base, far));
});

test("fingerprint: same broker+BĐS → same dupeKey; khác broker → khác dupeKey, cùng canonicalKey", () => {
  const common = {
    propertyType: "can_ho",
    province: "HCM",
    district: "Q7",
    price: 3_900_000_000,
    area: 68,
    projectId: "proj-1",
    unitTypeId: "unit-1",
    description: "căn hộ đẹp",
  };
  const a = computeFingerprint({ brokerId: "B1", ...common });
  const a2 = computeFingerprint({ brokerId: "B1", ...common });
  const b = computeFingerprint({ brokerId: "B2", ...common });

  assert.equal(a.dupeKey, a2.dupeKey);
  assert.notEqual(a.dupeKey, b.dupeKey);
  assert.equal(a.canonicalKey, b.canonicalKey); // cùng 1 BĐS, 2 broker
});

test("gate: exact dupeKey → hard_dupe", () => {
  const fp = computeFingerprint({
    brokerId: "B1",
    propertyType: "can_ho",
    province: "HCM",
    district: "Q7",
    price: 1_000_000_000,
    area: 50,
    description: "abc",
  });
  const res = evaluateContent({
    brokerId: "B1",
    fingerprint: fp,
    candidates: [
      { listingId: "L1", brokerId: "B1", dupeKey: fp.dupeKey, contentHash: fp.contentHash },
    ],
  });
  assert.equal(res.decision, "hard_dupe");
});

test("gate: near-dupe khác broker → ok (không chặn, để gom canonical)", () => {
  const fp = computeFingerprint({
    brokerId: "B1",
    propertyType: "can_ho",
    province: "HCM",
    district: "Q7",
    price: 1_000_000_000,
    area: 50,
    description: "căn hộ view đẹp đầy đủ nội thất",
  });
  const res = evaluateContent({
    brokerId: "B1",
    fingerprint: fp,
    candidates: [
      { listingId: "L2", brokerId: "B2", dupeKey: "other", contentHash: fp.contentHash },
    ],
  });
  assert.equal(res.decision, "ok");
});
