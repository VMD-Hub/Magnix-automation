import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateAffordability,
  cardMonthlyObligation,
  householdLivingCost,
  maxNewLoanPayment,
  principalFromFirstPayment,
  propertyFromLoan,
} from "../lib/finance/loan-affordability";
import { calculateLoan } from "../lib/finance/loan";

test("hạn mức thẻ quy đổi 5%/tháng", () => {
  assert.equal(cardMonthlyObligation(200_000_000), 10_000_000);
});

test("maxNewLoanPayment = thu nhập × DTI − nghĩa vụ", () => {
  const p = maxNewLoanPayment(40_000_000, 0.5, 5_000_000, 2_000_000);
  assert.equal(p, 13_000_000);
});

test("principalFromFirstPayment khớp calculateLoan (dư nợ giảm dần)", () => {
  const principal = 2_000_000_000;
  const loan = calculateLoan({
    principal,
    annualRate: 8.5,
    months: 240,
    method: "DECLINING",
  });
  const recovered = principalFromFirstPayment(
    loan.firstPayment,
    8.5,
    240,
    "DECLINING",
  );
  assert.ok(Math.abs(recovered - principal) <= 10_000);
});

test("principalFromFirstPayment khớp calculateLoan (trả góp đều)", () => {
  const principal = 1_500_000_000;
  const loan = calculateLoan({
    principal,
    annualRate: 9,
    months: 180,
    method: "ANNUITY",
  });
  const recovered = principalFromFirstPayment(
    loan.firstPayment,
    9,
    180,
    "ANNUITY",
  );
  assert.ok(Math.abs(recovered - principal) <= 10_000);
});

test("propertyFromLoan theo LTV 70%", () => {
  const { maxPropertyPrice, requiredDownPayment } = propertyFromLoan(
    700_000_000,
    70,
  );
  assert.equal(maxPropertyPrice, 1_000_000_000);
  assert.equal(requiredDownPayment, 300_000_000);
});

test("kịch bản tiêu chuẩn — thu nhập 40tr, không nợ", () => {
  const r = calculateAffordability({
    householdMonthlyIncome: 40_000_000,
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
    ltvPct: 70,
  });
  const std = r.scenarios.find((s) => s.profile === "STANDARD")!;
  assert.equal(std.maxMonthlyPayment, 20_000_000);
  assert.ok(std.maxLoanAmount > 0);
  assert.ok(std.maxPropertyPrice > std.maxLoanAmount);
  assert.equal(r.creditAssessment.flag, "CLEAN");
});

test("nợ xấu nhóm 2 → hạn mức = 0", () => {
  const r = calculateAffordability({
    householdMonthlyIncome: 50_000_000,
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
    badDebtSelfOrSpouse: "GROUP_2_PLUS",
  });
  for (const s of r.scenarios) {
    assert.equal(s.maxLoanAmount, 0);
  }
  assert.equal(r.creditAssessment.flag, "BLOCKER");
});

test("nghĩa vụ hiện tại chiếm hết DTI → maxLoan = 0", () => {
  const r = calculateAffordability({
    householdMonthlyIncome: 20_000_000,
    existingMonthlyDebtPayment: 12_000_000,
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
  });
  const std = r.scenarios.find((s) => s.profile === "STANDARD")!;
  assert.equal(std.maxMonthlyPayment, 0);
  assert.equal(std.maxLoanAmount, 0);
});

test("chi phí sinh hoạt ràng buộc khi hộ nhiều người phụ thuộc", () => {
  const r = calculateAffordability({
    householdMonthlyIncome: 30_000_000,
    dependentChildren: 2,
    dependentElderly: 1,
    isMarried: true,
    livingCostRegion: "URBAN",
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
  });
  const std = r.scenarios.find((s) => s.profile === "STANDARD")!;
  assert.equal(std.bindingMethod, "RESIDUAL");
  assert.ok(std.residualBasedPayment < std.dtiBasedPayment);
});

test("đồng vay vợ/chồng cộng thu nhập", () => {
  const solo = calculateAffordability({
    householdMonthlyIncome: 30_000_000,
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
  });
  const joint = calculateAffordability({
    householdMonthlyIncome: 30_000_000,
    isMarried: true,
    coBorrower: { monthlyIncome: 20_000_000 },
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
  });
  const soloStd = solo.scenarios.find((s) => s.profile === "STANDARD")!;
  const jointStd = joint.scenarios.find((s) => s.profile === "STANDARD")!;
  assert.ok(jointStd.maxLoanAmount > soloStd.maxLoanAmount);
  assert.equal(joint.totalIncome, 50_000_000);
});

test("nợ xấu vợ/chồng → BLOCKER", () => {
  const r = calculateAffordability({
    householdMonthlyIncome: 50_000_000,
    isMarried: true,
    applicantBadDebt: "NONE",
    spouseBadDebt: "GROUP_2_PLUS",
    annualRate: 8.5,
    years: 20,
    method: "DECLINING",
  });
  assert.equal(r.creditAssessment.flag, "BLOCKER");
});

test("householdLivingCost đếm thành viên", () => {
  const { reserve, memberCount } = householdLivingCost({
    perCapita: 4_000_000,
    borrowerHeadcount: 2,
    dependentChildren: 1,
    dependentElderly: 1,
  });
  assert.equal(memberCount, 4);
  assert.equal(reserve, 16_000_000);
});
