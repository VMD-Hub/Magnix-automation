import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EDITORIAL_METHODOLOGY,
} from "@/lib/content/editorial-methodology";
import { HOUSEX_EXPERTS } from "@/lib/content/editorial-trust";

const INTERNAL_MARKERS = [
  "L0",
  "L1",
  "L2",
  "L3",
  "CURRENT_NOXH_RULES",
  "lib/finance",
  "mã nguồn",
  "markdown thô",
  "heading meta",
  "QA L0",
];

function publicCopyBlob(): string {
  const m = EDITORIAL_METHODOLOGY;
  const expert = HOUSEX_EXPERTS["noxh-policy"]!;
  return [
    m.metaDescription,
    m.lead,
    m.disclaimer,
    ...m.steps.flatMap((s) => [s.heading, s.summary, ...s.bullets]),
    ...m.noxhEditorial.sections.flatMap((s) => [s.heading, ...s.bullets]),
    expert.bio,
    ...expert.credentials,
    expert.name,
  ].join("\n");
}

describe("editorial public copy boundary", () => {
  it("methodology and expert profile omit internal QA / codebase markers", () => {
    const blob = publicCopyBlob();
    for (const marker of INTERNAL_MARKERS) {
      assert.equal(
        blob.includes(marker),
        false,
        `public copy must not contain internal marker: ${marker}`,
      );
    }
  });

  it("methodology uses reader-facing step titles", () => {
    const headings = EDITORIAL_METHODOLOGY.steps.map((s) => s.heading);
    assert.ok(headings.includes("Kiểm duyệt biên tập (Con người)"));
    assert.ok(!headings.some((h) => h.includes("QA")));
  });
});
