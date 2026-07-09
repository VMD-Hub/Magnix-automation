import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildWizardHotOpsNote,
  isWizardHotAutoCaseEnabled,
  shouldAutoCreatePlatformCaseForWizardTier,
} from "../lib/noxh-case/wizard-hot-case";

test("shouldAutoCreatePlatformCaseForWizardTier — chỉ HOT khi env bật", () => {
  const prev = process.env.NOXH_WIZARD_HOT_AUTO_CASE;
  process.env.NOXH_WIZARD_HOT_AUTO_CASE = "true";
  assert.equal(shouldAutoCreatePlatformCaseForWizardTier("HOT"), true);
  assert.equal(shouldAutoCreatePlatformCaseForWizardTier("WARM"), false);
  assert.equal(shouldAutoCreatePlatformCaseForWizardTier("COLD"), false);
  process.env.NOXH_WIZARD_HOT_AUTO_CASE = "false";
  assert.equal(shouldAutoCreatePlatformCaseForWizardTier("HOT"), false);
  if (prev === undefined) delete process.env.NOXH_WIZARD_HOT_AUTO_CASE;
  else process.env.NOXH_WIZARD_HOT_AUTO_CASE = prev;
});

test("isWizardHotAutoCaseEnabled — mặc định true khi env trống", () => {
  const prev = process.env.NOXH_WIZARD_HOT_AUTO_CASE;
  delete process.env.NOXH_WIZARD_HOT_AUTO_CASE;
  assert.equal(isWizardHotAutoCaseEnabled(), true);
  if (prev === undefined) delete process.env.NOXH_WIZARD_HOT_AUTO_CASE;
  else process.env.NOXH_WIZARD_HOT_AUTO_CASE = prev;
});

test("buildWizardHotOpsNote — gồm tier và reason", () => {
  const note = buildWizardHotOpsNote({
    reasonCodes: ["eligible_ready"],
    recommendedAction: "Chuyển chuyên gia tư vấn realtime",
    rulesVersion: "2026-04-ND136",
  });
  assert.match(note, /tier HOT/);
  assert.match(note, /eligible_ready/);
  assert.match(note, /2026-04-ND136/);
  assert.match(note, /Chuyển chuyên gia/);
});
