import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateNoxhEligibility } from "../lib/finance/noxh-eligibility.ts";
import { assessCreditReadiness } from "../lib/finance/credit-readiness.ts";
import { classifyLead } from "../lib/finance/noxh-lead.ts";
import {
  buildNoxhWizardSnapshot,
  fmtVndFull,
  readNoxhWizardSnapshot,
} from "../lib/leads/noxh-wizard-snapshot.ts";
import { readLeadOpsMeta } from "../lib/leads/ops-meta.ts";

describe("buildNoxhWizardSnapshot", () => {
  it("includes concrete VND income and bilingual tier labels", () => {
    const input = {
      objectGroup: "WORKER" as const,
      ownsHomeInProvince: false,
      everBenefitedHousingPolicy: false,
      maritalStatus: "MARRIED" as const,
      applicantMonthlyIncome: 8_000_000,
      spouseMonthlyIncome: 2_000_000,
      intendToBorrow: true,
      existingMonthlyDebtPayment: 14_000_000,
      creditCardLimitTotal: 0,
      badDebtSelfOrSpouse: "UNKNOWN" as const,
      timeframe: "NOW" as const,
    };

    const evaluation = evaluateNoxhEligibility(input);
    const householdIncome = 10_000_000;
    const credit = assessCreditReadiness({
      intendToBorrow: true,
      householdMonthlyIncome: householdIncome,
      existingMonthlyDebtPayment: input.existingMonthlyDebtPayment,
      creditCardLimitTotal: input.creditCardLimitTotal,
      badDebtSelfOrSpouse: input.badDebtSelfOrSpouse,
    });
    const classification = classifyLead(evaluation, credit, {
      timeframe: input.timeframe,
      hasContact: true,
    });

    const snapshot = buildNoxhWizardSnapshot({
      wizardInput: input,
      evaluation,
      credit,
      classification,
      householdMonthlyIncome: householdIncome,
      capturedAt: "2026-07-10T00:00:00.000Z",
    });

    assert.equal(snapshot.situation.applicantMonthlyIncome, 8_000_000);
    assert.equal(snapshot.situation.householdMonthlyIncome, 10_000_000);
    assert.ok(snapshot.listPreviewVi.includes(fmtVndFull(10_000_000)));
    assert.ok(snapshot.tierLabelVi.length > 0);
    assert.ok(snapshot.tierLabelEn.length > 0);
    assert.ok(snapshot.evaluation.alternativeHints.length >= 0);
    assert.equal(snapshot.credit.dtiPercent, "140%");
    assert.equal(classification.tier, "WARM");
  });

  it("round-trips through opsMeta", () => {
    const input = {
      objectGroup: "LOW_INCOME_URBAN" as const,
      ownsHomeInProvince: false,
      everBenefitedHousingPolicy: false,
      maritalStatus: "SINGLE" as const,
      applicantMonthlyIncome: 18_000_000,
      intendToBorrow: false,
      badDebtSelfOrSpouse: "NONE" as const,
      timeframe: "WITHIN_3M" as const,
    };
    const evaluation = evaluateNoxhEligibility(input);
    const credit = assessCreditReadiness({
      intendToBorrow: false,
      householdMonthlyIncome: 18_000_000,
      badDebtSelfOrSpouse: "NONE",
    });
    const classification = classifyLead(evaluation, credit, {
      timeframe: input.timeframe,
      hasContact: true,
    });
    const snapshot = buildNoxhWizardSnapshot({
      wizardInput: input,
      evaluation,
      credit,
      classification,
      householdMonthlyIncome: 18_000_000,
    });

    const ops = readLeadOpsMeta({ wizardSnapshot: snapshot });
    assert.deepEqual(ops.wizardSnapshot?.situation.applicantMonthlyIncome, 18_000_000);
    assert.equal(readNoxhWizardSnapshot({ wizardSnapshot: snapshot })?.tier, snapshot.tier);
  });
});
