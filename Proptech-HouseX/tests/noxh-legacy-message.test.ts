import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatLegacyNoxhLeadPreviewVi,
  parseLegacyNoxhLeadMessage,
} from "../lib/leads/noxh-legacy-message.ts";

const SAMPLE =
  "[NOXH check] | tier=WARM | overall=ELIGIBLE | housing=PASS | income=PASS | borrow=yes | credit=CAUTION | dti=150-160% | reasons=credit_caution | rules=2026-04-ND136";

describe("parseLegacyNoxhLeadMessage", () => {
  it("parses pipe-format NOXH message", () => {
    const p = parseLegacyNoxhLeadMessage(SAMPLE);
    assert.ok(p);
    assert.equal(p.tier, "WARM");
    assert.equal(p.overall, "ELIGIBLE");
    assert.equal(p.housing, "PASS");
    assert.equal(p.income, "PASS");
    assert.equal(p.intendToBorrow, true);
    assert.equal(p.creditFlag, "CAUTION");
    assert.equal(p.dtiBucket, "150-160%");
    assert.deepEqual(p.reasonCodes, ["credit_caution"]);
  });

  it("formats Vietnamese preview without raw keys", () => {
    const p = parseLegacyNoxhLeadMessage(SAMPLE);
    assert.ok(p);
    const preview = formatLegacyNoxhLeadPreviewVi(p);
    assert.ok(preview.includes("Tiềm năng"));
    assert.ok(preview.includes("Đủ điều kiện sơ bộ"));
    assert.ok(!preview.includes("tier=WARM"));
    assert.ok(!preview.includes("overall=ELIGIBLE"));
  });
});
