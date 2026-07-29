import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateRentalCashflow,
  DEFAULT_RENTAL_TAX_RATE,
} from "../lib/finance/rental-cashflow";
import { formatRentalCommissionNote } from "../lib/leads/rental-commission-deal";
import { landlordSlaState } from "../lib/leads/ops-lead-board";

test("rental cashflow: thuế 10% + 1 tháng trống", () => {
  const r = calculateRentalCashflow({
    rentMonthly: 12_000_000,
    opexMonthly: 1_200_000,
    vacancyMonthsPerYear: 1,
    taxRate: DEFAULT_RENTAL_TAX_RATE,
  });
  // occupied 11/12 → effective rent 11M
  assert.equal(r.effectiveRentMonthly, 11_000_000);
  assert.equal(r.taxMonthly, 1_100_000);
  assert.equal(r.netMonthly, 11_000_000 - 1_200_000 - 1_100_000);
  assert.ok(r.netAnnual === r.netMonthly * 12);
});

test("rental cashflow: không âm thuế rate ngoài biên", () => {
  const r = calculateRentalCashflow({
    rentMonthly: 5_000_000,
    opexMonthly: 0,
    vacancyMonthsPerYear: 0,
    taxRate: 2,
  });
  assert.equal(r.taxRate, 1);
  assert.equal(r.taxMonthly, 5_000_000);
});

test("formatRentalCommissionNote WON", () => {
  const note = formatRentalCommissionNote({
    outcome: "WON",
    feeVnd: 5_000_000.4,
    monthsFee: 1,
    listingCode: "MX-R1",
  });
  assert.match(note, /^RENTAL_COMMISSION\|status=WON\|fee=5000000\|months=1\|listing=MX-R1$/);
});

test("landlord SLA overdue after 4h when NEW", () => {
  const createdAt = new Date(Date.now() - 5 * 60 * 60 * 1000);
  assert.equal(
    landlordSlaState({
      rentalIntent: "LANDLORD",
      status: "NEW",
      createdAt,
    }),
    "overdue",
  );
  assert.equal(
    landlordSlaState({
      rentalIntent: "LANDLORD",
      status: "CONTACTED",
      createdAt,
    }),
    "ok",
  );
  assert.equal(
    landlordSlaState({
      rentalIntent: "TENANT",
      status: "NEW",
      createdAt,
    }),
    null,
  );
});
