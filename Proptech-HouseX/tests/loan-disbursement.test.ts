import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateDisbursementPlan,
  resolveMilestones,
} from "../lib/finance/loan-disbursement.ts";

const BASE = {
  propertyPrice: 3_000_000_000,
  loanPct: 70,
  loanMonths: 240,
  annualRate: 7.2,
  method: "DECLINING" as const,
  mode: "TIME" as const,
};

test("TIME: tự tách vốn tự có trước khi NH giải ngân", () => {
  const resolved = resolveMilestones({
    ...BASE,
    milestones: [
      { id: "1", month: 0, installmentPct: 10 },
      { id: "2", month: 6, installmentPct: 20 },
      { id: "3", month: 12, installmentPct: 50 },
    ],
  });
  assert.equal(resolved[0].customerPct, 10);
  assert.equal(resolved[0].bankPct, 0);
  assert.equal(resolved[1].customerPct, 20);
  assert.equal(resolved[1].bankPct, 0);
  assert.equal(resolved[2].customerPct, 0);
  assert.equal(resolved[2].bankPct, 50);
});

test("PARALLEL: KH và NH theo nhập tay", () => {
  const resolved = resolveMilestones({
    ...BASE,
    mode: "PARALLEL",
    milestones: [
      { id: "1", month: 0, installmentPct: 0, customerPct: 10, bankPct: 0 },
      { id: "2", month: 6, installmentPct: 0, customerPct: 5, bankPct: 25 },
    ],
  });
  assert.equal(resolved[1].customerVnd, 150_000_000);
  assert.equal(resolved[1].bankVnd, 750_000_000);
});

test("trước giải ngân đầu: không tính lãi", () => {
  const r = calculateDisbursementPlan({
    ...BASE,
    milestones: [
      { id: "1", month: 0, installmentPct: 30 },
      { id: "2", month: 12, installmentPct: 40 },
    ],
  });
  const month0 = r.schedule.find((x) => x.month === 0);
  assert.ok(month0);
  assert.equal(month0!.interestPaid, 0);
  assert.equal(month0!.loanBalance, 0);
});

test("cắt trần vay ở đợt cuối", () => {
  const resolved = resolveMilestones({
    ...BASE,
    mode: "PARALLEL",
    milestones: [
      { id: "1", month: 0, customerPct: 10, bankPct: 50, installmentPct: 0 },
      { id: "2", month: 6, customerPct: 5, bankPct: 30, installmentPct: 0 },
    ],
  });
  const totalBank = resolved.reduce((s, m) => s + m.bankVnd, 0);
  assert.ok(totalBank <= 2_100_000_000);
  assert.ok(resolved.some((m) => m.bankTrimmed));
});

test("có giải ngân thì sinh dòng trả NH", () => {
  const r = calculateDisbursementPlan({
    ...BASE,
    milestones: [
      { id: "1", month: 0, installmentPct: 30 },
      { id: "2", month: 3, installmentPct: 40 },
    ],
  });
  assert.ok(r.totalBankDisbursed > 0);
  assert.ok(r.totalInterest >= 0);
  assert.ok(r.schedule.some((row) => row.bankPayment > 0));
});
