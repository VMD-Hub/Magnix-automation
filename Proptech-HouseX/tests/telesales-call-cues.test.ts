import assert from "node:assert/strict";
import { test } from "node:test";
import {
  NOXH_MUST_COVER,
  NOXH_TECHNIQUES,
  buildNoxhCallCuePayload,
  type TelesalesProjectFacts,
} from "../lib/leads/telesales-call-cues";
import { projectTelesalesFactsSchema } from "../lib/leads/telesales-project-facts";

const emptyFacts: TelesalesProjectFacts = {
  projectId: null,
  projectName: null,
  projectSlug: null,
  priceFromLabel: null,
  pricePerSqmLabel: null,
  applicationDeadlineLabel: null,
  promoUnitsRemaining: null,
  promoDiscountLabel: null,
  valueAnchors: [],
  legalProofHint: null,
  bankLoanHint: null,
  missingFields: ["project", "priceFrom", "applicationDeadline", "promoUnitsRemaining"],
};

test("NOXH call cue catalog has must-cover and 4 techniques", () => {
  assert.equal(NOXH_MUST_COVER.length, 5);
  assert.equal(NOXH_TECHNIQUES.length, 4);
  const payload = buildNoxhCallCuePayload(emptyFacts);
  assert.equal(payload.segment, "NOXH");
  assert.equal(payload.softMode, true);
  assert.match(payload.openingLine, /House X/i);
  assert.ok(payload.flowSteps.length >= 5);
});

test("softMode clears when deadline and promo units exist", () => {
  const payload = buildNoxhCallCuePayload({
    ...emptyFacts,
    projectId: "p1",
    projectName: "Demo NOXH",
    applicationDeadlineLabel: "31/08/2026",
    promoUnitsRemaining: 20,
    missingFields: [],
  });
  assert.equal(payload.softMode, false);
});

test("project telesalesFacts schema accepts master fields", () => {
  const parsed = projectTelesalesFactsSchema.parse({
    pricePerSqmLabel: "24–25 triệu/m²",
    applicationDeadline: "2026-08-31",
    promoUnitsRemaining: 20,
    promoDiscountLabel: "chiết khấu đợt 1",
    valueAnchors: ["Pháp lý đủ mở bán", "Gói vay ưu đãi"],
  });
  assert.equal(parsed.promoUnitsRemaining, 20);
  assert.equal(parsed.valueAnchors?.length, 2);
});
