import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateLoan } from "../lib/finance/loan";

test("annuity: tổng tiền trả tháng cố định (sai số làm tròn nhỏ)", () => {
  const r = calculateLoan({
    principal: 2_000_000_000,
    annualRate: 8.5,
    months: 240,
    method: "ANNUITY",
  });
  // ~17,36 triệu/tháng theo tham chiếu thị trường.
  assert.ok(Math.abs(r.firstPayment - 17_360_000) < 100_000);
  // Các tháng (trừ tháng cuối) gần như bằng nhau.
  const mid = r.schedule.slice(0, 239).map((x) => x.payment);
  const spread = Math.max(...mid) - Math.min(...mid);
  assert.ok(spread < 1000, `spread quá lớn: ${spread}`);
  assert.equal(r.totalPrincipal, 2_000_000_000);
});

test("declining: tiền trả giảm dần, tổng lãi < annuity", () => {
  const base = {
    principal: 2_000_000_000,
    annualRate: 8.5,
    months: 240,
  };
  const dec = calculateLoan({ ...base, method: "DECLINING" });
  const ann = calculateLoan({ ...base, method: "ANNUITY" });

  assert.ok(dec.schedule[0].payment > dec.schedule[120].payment);
  assert.ok(dec.totalInterest < ann.totalInterest);
  assert.equal(dec.totalPrincipal, 2_000_000_000);
});

test("declining: tổng lãi khớp công thức nhanh S·r·(n+1)/2", () => {
  const principal = 1_000_000_000;
  const months = 12;
  const annualRate = 12;
  const r = calculateLoan({ principal, annualRate, months, method: "DECLINING" });
  const monthly = annualRate / 100 / 12;
  const expected = principal * monthly * ((months + 1) / 2);
  assert.ok(Math.abs(r.totalInterest - expected) < 1000);
});

test("ân hạn gốc: N tháng đầu chỉ trả lãi", () => {
  const r = calculateLoan({
    principal: 1_000_000_000,
    annualRate: 12,
    months: 24,
    method: "DECLINING",
    graceMonths: 3,
  });
  assert.equal(r.schedule[0].principalPaid, 0);
  assert.equal(r.schedule[2].principalPaid, 0);
  assert.ok(r.schedule[3].principalPaid > 0);
  assert.equal(r.totalPrincipal, 1_000_000_000);
});

test("lãi ưu đãi: tháng đầu áp dụng promoRate", () => {
  const r = calculateLoan({
    principal: 1_000_000_000,
    annualRate: 11,
    months: 24,
    method: "DECLINING",
    promoRate: 6,
    promoMonths: 12,
  });
  assert.equal(r.schedule[0].annualRate, 6);
  assert.equal(r.schedule[11].annualRate, 6);
  assert.equal(r.schedule[12].annualRate, 11);
});

test("dư nợ về 0 ở tháng cuối", () => {
  const r = calculateLoan({
    principal: 750_000_000,
    annualRate: 9.3,
    months: 60,
    method: "ANNUITY",
  });
  assert.equal(r.schedule[r.schedule.length - 1].balance, 0);
});
