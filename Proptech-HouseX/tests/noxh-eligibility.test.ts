import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateNoxhEligibility,
  type NoxhInput,
} from "../lib/finance/noxh-eligibility";
import { CURRENT_NOXH_RULES } from "../lib/finance/noxh-rules";

const base: NoxhInput = {
  objectGroup: "LOW_INCOME_URBAN",
  ownsHomeInProvince: false,
  everBenefitedHousingPolicy: false,
  maritalStatus: "SINGLE",
  applicantMonthlyIncome: 18_000_000,
};

test("đủ 3 trụ → ELIGIBLE (thu nhập thấp đô thị, chưa có nhà, dưới trần)", () => {
  const ev = evaluateNoxhEligibility(base);
  assert.equal(ev.object.status, "PASS");
  assert.equal(ev.housing.status, "PASS");
  assert.equal(ev.income.status, "PASS");
  assert.equal(ev.overall, "ELIGIBLE");
  assert.equal(ev.rulesVersion, CURRENT_NOXH_RULES.version);
});

test("sai đối tượng → object FAIL, overall NOT_ELIGIBLE", () => {
  const ev = evaluateNoxhEligibility({ ...base, objectGroup: "NONE" });
  assert.equal(ev.object.status, "FAIL");
  assert.equal(ev.overall, "NOT_ELIGIBLE");
});

test("chưa chọn đối tượng → UNKNOWN → CONDITIONAL", () => {
  const ev = evaluateNoxhEligibility({ ...base, objectGroup: null });
  assert.equal(ev.object.status, "UNKNOWN");
  assert.equal(ev.overall, "CONDITIONAL");
});

test("độc thân vượt trần 25tr → income FAIL", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    applicantMonthlyIncome: 26_000_000,
  });
  assert.equal(ev.income.status, "FAIL");
  assert.equal(ev.income.ceiling, 25_000_000);
  assert.equal(ev.overall, "NOT_ELIGIBLE");
});

test("độc thân nuôi con nhỏ dùng trần 35tr", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    maritalStatus: "SINGLE_WITH_MINOR",
    applicantMonthlyIncome: 30_000_000,
  });
  assert.equal(ev.income.ceiling, 35_000_000);
  assert.equal(ev.income.status, "PASS");
});

test("đã kết hôn dùng tổng thu nhập, trần 50tr", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    maritalStatus: "MARRIED",
    applicantMonthlyIncome: 30_000_000,
    spouseMonthlyIncome: 25_000_000,
  });
  assert.equal(ev.income.ceiling, 50_000_000);
  assert.equal(ev.income.effectiveIncome, 55_000_000);
  assert.equal(ev.income.status, "FAIL");
});

test("thu nhập sát trần → PASS nhưng nearCeiling=true", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    applicantMonthlyIncome: 24_000_000, // > 25tr*0.9
  });
  assert.equal(ev.income.status, "PASS");
  assert.equal(ev.income.nearCeiling, true);
});

test("nhóm miễn thu nhập (người có công) → income PASS dù thu nhập cao", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    objectGroup: "MERIT",
    applicantMonthlyIncome: 80_000_000,
  });
  assert.equal(ev.income.ceiling, null);
  assert.equal(ev.income.status, "PASS");
  assert.equal(ev.overall, "ELIGIBLE");
});

test("lực lượng vũ trang (K7) không áp trần 25/35/50 — income PASS dù thu nhập cao", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    objectGroup: "ARMED_FORCES",
    applicantMonthlyIncome: 40_000_000,
  });
  assert.equal(ev.income.ceiling, null);
  assert.equal(ev.income.status, "PASS");
  assert.equal(ev.overall, "ELIGIBLE");
});

test("đã hưởng chính sách nhà ở → housing FAIL", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    everBenefitedHousingPolicy: true,
  });
  assert.equal(ev.housing.status, "FAIL");
  assert.equal(ev.overall, "NOT_ELIGIBLE");
});

test("có nhà nhưng < 15 m²/người → housing PASS", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    ownsHomeInProvince: true,
    areaPerPersonSqm: 10,
  });
  assert.equal(ev.housing.status, "PASS");
});

test("có nhà ≥ 15 m²/người → housing FAIL", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    ownsHomeInProvince: true,
    areaPerPersonSqm: 20,
  });
  assert.equal(ev.housing.status, "FAIL");
});

test("có nhà nhưng chưa rõ diện tích → housing UNKNOWN → CONDITIONAL", () => {
  const ev = evaluateNoxhEligibility({
    ...base,
    ownsHomeInProvince: true,
    areaPerPersonSqm: undefined,
  });
  assert.equal(ev.housing.status, "UNKNOWN");
  assert.equal(ev.overall, "CONDITIONAL");
});
