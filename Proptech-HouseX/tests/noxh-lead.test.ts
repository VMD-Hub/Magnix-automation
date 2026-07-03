import { test } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateNoxhEligibility,
  type NoxhInput,
} from "../lib/finance/noxh-eligibility";
import {
  assessCreditReadiness,
  type CreditInput,
} from "../lib/finance/credit-readiness";
import {
  classifyLead,
  toLeadSummary,
  noxhLeadMessage,
  type LeadIntent,
} from "../lib/finance/noxh-lead";

const eligibleInput: NoxhInput = {
  objectGroup: "WORKER",
  ownsHomeInProvince: false,
  everBenefitedHousingPolicy: false,
  maritalStatus: "MARRIED",
  applicantMonthlyIncome: 20_000_000,
  spouseMonthlyIncome: 15_000_000,
};

const cleanCredit: CreditInput = {
  intendToBorrow: true,
  householdMonthlyIncome: 35_000_000,
  existingMonthlyDebtPayment: 3_000_000,
  expectedNewLoanPayment: 9_000_000,
  badDebtSelfOrSpouse: "NONE",
};

const readyIntent: LeadIntent = { timeframe: "NOW", hasContact: true };

test("đủ điều kiện + tín dụng sạch + sẵn sàng + có liên hệ → HOT", () => {
  const ev = evaluateNoxhEligibility(eligibleInput);
  const cr = assessCreditReadiness(cleanCredit);
  const c = classifyLead(ev, cr, readyIntent);
  assert.equal(c.tier, "HOT");
  assert.ok(c.reasonCodes.includes("eligible_ready"));
});

test("đủ điều kiện nhưng nợ xấu nhóm 2 → WARM (credit_blocker)", () => {
  const ev = evaluateNoxhEligibility(eligibleInput);
  const cr = assessCreditReadiness({
    ...cleanCredit,
    badDebtSelfOrSpouse: "GROUP_2_PLUS",
  });
  const c = classifyLead(ev, cr, readyIntent);
  assert.equal(c.tier, "WARM");
  assert.ok(c.reasonCodes.includes("credit_blocker"));
});

test("sai đối tượng → OUT", () => {
  const ev = evaluateNoxhEligibility({ ...eligibleInput, objectGroup: "NONE" });
  const cr = assessCreditReadiness(cleanCredit);
  const c = classifyLead(ev, cr, readyIntent);
  assert.equal(c.tier, "OUT");
  assert.ok(c.reasonCodes.includes("object_mismatch"));
});

test("thu nhập vượt trần → COLD (income_over_ceiling)", () => {
  const ev = evaluateNoxhEligibility({
    ...eligibleInput,
    applicantMonthlyIncome: 40_000_000,
    spouseMonthlyIncome: 20_000_000,
  });
  const cr = assessCreditReadiness(cleanCredit);
  const c = classifyLead(ev, cr, readyIntent);
  assert.equal(c.tier, "COLD");
  assert.ok(c.reasonCodes.includes("income_over_ceiling"));
});

test("đủ điều kiện nhưng chưa để lại liên hệ → WARM (no_contact)", () => {
  const ev = evaluateNoxhEligibility(eligibleInput);
  const cr = assessCreditReadiness(cleanCredit);
  const c = classifyLead(ev, cr, { timeframe: "NOW", hasContact: false });
  assert.equal(c.tier, "WARM");
  assert.ok(c.reasonCodes.includes("no_contact"));
});

test("toLeadSummary không lộ số thu nhập tuyệt đối, chỉ trạng thái/tier", () => {
  const ev = evaluateNoxhEligibility(eligibleInput);
  const cr = assessCreditReadiness(cleanCredit);
  const c = classifyLead(ev, cr, readyIntent);
  const s = toLeadSummary(ev, cr, c);

  assert.equal(s.tier, "HOT");
  assert.equal(s.overall, "ELIGIBLE");
  assert.equal(s.intendToBorrow, true);
  const serialized = JSON.stringify(s);
  // Không được chứa các con số PII cụ thể.
  assert.doesNotMatch(serialized, /20000000|35000000|15000000/);
  assert.ok(s.dtiBucket && /%$/.test(s.dtiBucket));
});

test("noxhLeadMessage: có tier/trạng thái, KHÔNG lộ số thu nhập tuyệt đối", () => {
  const ev = evaluateNoxhEligibility(eligibleInput);
  const cr = assessCreditReadiness(cleanCredit);
  const c = classifyLead(ev, cr, readyIntent);
  const msg = noxhLeadMessage(toLeadSummary(ev, cr, c));

  assert.match(msg, /\[NOXH check\]/);
  assert.match(msg, /tier=HOT/);
  assert.match(msg, /rules=/);
  assert.doesNotMatch(msg, /20000000|35000000|15000000/);
});
