import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assessCreditReadiness,
  CREDIT_CARD_LIABILITY_RATE,
  type CreditInput,
} from "../lib/finance/credit-readiness";

const base: CreditInput = {
  intendToBorrow: true,
  householdMonthlyIncome: 40_000_000,
  badDebtSelfOrSpouse: "NONE",
};

test("không vay → NOT_APPLICABLE", () => {
  const a = assessCreditReadiness({ ...base, intendToBorrow: false });
  assert.equal(a.applicable, false);
  assert.equal(a.flag, "NOT_APPLICABLE");
});

test("hồ sơ sạch, DTI thấp → CLEAN", () => {
  const a = assessCreditReadiness({
    ...base,
    existingMonthlyDebtPayment: 5_000_000,
    expectedNewLoanPayment: 8_000_000,
  });
  assert.equal(a.flag, "CLEAN");
  assert.ok(a.dti != null && a.dti < 0.5);
});

test("nợ xấu nhóm 2 → BLOCKER", () => {
  const a = assessCreditReadiness({
    ...base,
    badDebtSelfOrSpouse: "GROUP_2_PLUS",
  });
  assert.equal(a.flag, "BLOCKER");
});

test("chưa rõ nợ xấu → CAUTION", () => {
  const a = assessCreditReadiness({ ...base, badDebtSelfOrSpouse: "UNKNOWN" });
  assert.equal(a.flag, "CAUTION");
});

test("DTI vượt ngưỡng tight → CAUTION", () => {
  const a = assessCreditReadiness({
    ...base,
    householdMonthlyIncome: 20_000_000,
    expectedNewLoanPayment: 16_000_000,
  });
  assert.ok(a.dti != null && a.dti > 0.7);
  assert.equal(a.flag, "CAUTION");
});

test("hạn mức thẻ quy đổi 5% vào nghĩa vụ tháng", () => {
  const cardLimit = 200_000_000;
  const a = assessCreditReadiness({
    ...base,
    creditCardLimitTotal: cardLimit,
  });
  assert.equal(
    a.estimatedMonthlyObligation,
    Math.round(cardLimit * CREDIT_CARD_LIABILITY_RATE),
  );
});

test("nợ xấu nhóm 2 không bị hạ cấp bởi DTI thấp (vẫn BLOCKER)", () => {
  const a = assessCreditReadiness({
    ...base,
    badDebtSelfOrSpouse: "GROUP_2_PLUS",
    expectedNewLoanPayment: 1_000_000,
  });
  assert.equal(a.flag, "BLOCKER");
});

test("luôn kèm CTA chuyên gia", () => {
  const a = assessCreditReadiness(base);
  assert.match(a.recommendation, /chuyên gia HouseX/);
});
