import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildDocumentChecklist,
  countDocProgress,
} from "../lib/noxh-case/doc-catalog";

test("WORKER + vay → có DOC_INCOME và DOC_CIC", () => {
  const docs = buildDocumentChecklist({
    objectGroup: "WORKER",
    intendToBorrow: true,
  });
  const types = docs.map((d) => d.docType);
  assert.ok(types.includes("DOC_INCOME"));
  assert.ok(types.includes("DOC_CIC"));
  assert.ok(types.includes("DOC_LOAN_APP"));
});

test("ARMED_FORCES → DOC_INCOME NOT_REQUIRED", () => {
  const docs = buildDocumentChecklist({
    objectGroup: "ARMED_FORCES",
    intendToBorrow: false,
  });
  const income = docs.find((d) => d.docType === "DOC_INCOME");
  assert.equal(income?.initialStatus, "NOT_REQUIRED");
});

test("countDocProgress tính % đúng", () => {
  const docs = buildDocumentChecklist({
    objectGroup: "WORKER",
    intendToBorrow: false,
  });
  const required = docs.filter((d) => d.initialStatus !== "NOT_REQUIRED");
  const half = required.map((d, i) => ({
    status: i < Math.floor(required.length / 2) ? ("PASSED" as const) : d.initialStatus,
  }));
  const p = countDocProgress(half);
  assert.ok(p.percent >= 40 && p.percent <= 60);
});
