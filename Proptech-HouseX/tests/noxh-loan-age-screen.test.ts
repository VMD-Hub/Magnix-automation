import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LOAN_AGE_RULES,
  screenLoanAge,
  ageScreenStatusLabel,
} from "../lib/finance/noxh-loan-age-screen";

const REF = 2026;

test("tuổi 41, vay 20 năm → PROCEED", () => {
  const r = screenLoanAge({ birthYear: 1985, referenceYear: REF });
  assert.equal(r.status, "PROCEED");
  assert.equal(r.currentAge, 41);
  assert.equal(r.ageAtLoanEnd, 61);
});

test("sinh 2010 → NOT_SUITABLE (chưa 18)", () => {
  const r = screenLoanAge({ birthYear: 2010, referenceYear: REF });
  assert.equal(r.status, "NOT_SUITABLE");
});

test("sinh 1970, vay 20 năm → NOT_SUITABLE (cuối kỳ > 75)", () => {
  const r = screenLoanAge({ birthYear: 1970, referenceYear: REF });
  assert.equal(r.currentAge, 56);
  assert.equal(r.ageAtLoanEnd, 76);
  assert.equal(r.status, "NOT_SUITABLE");
});

test("sinh 1975 → NEEDS_REVIEW (cuối kỳ 71)", () => {
  const r = screenLoanAge({ birthYear: 1975, referenceYear: REF });
  assert.equal(r.status, "NEEDS_REVIEW");
  assert.equal(r.ageAtLoanEnd, 71);
});

test("nhãn trạng thái tiếng Việt", () => {
  assert.equal(ageScreenStatusLabel("PROCEED"), "Có thể tiếp tục");
  assert.equal(ageScreenStatusLabel("NEEDS_REVIEW"), "Cần kiểm tra thêm");
});

test("thời hạn vay tùy chỉnh", () => {
  const r = screenLoanAge({
    birthYear: 1978,
    referenceYear: REF,
    loanYears: 15,
  });
  assert.equal(r.ageAtLoanEnd, 48 + 15);
  assert.equal(r.status, "PROCEED");
});
