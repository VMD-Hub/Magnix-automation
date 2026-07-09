import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  fromPrismaLeadSegment,
  projectTypeToLeadSegment,
  toPrismaLeadSegment,
} from "../lib/rules/lead-segment.ts";

describe("lead-segment", () => {
  it("maps project type to lane input", () => {
    assert.equal(projectTypeToLeadSegment("NHA_O_XA_HOI"), "noxh");
    assert.equal(projectTypeToLeadSegment("THUONG_MAI"), "cctm");
  });

  it("round-trips prisma enum", () => {
    assert.equal(toPrismaLeadSegment("noxh"), "NOXH");
    assert.equal(toPrismaLeadSegment("cctm"), "CCTM");
    assert.equal(fromPrismaLeadSegment("NOXH"), "noxh");
    assert.equal(fromPrismaLeadSegment("CCTM"), "cctm");
    assert.equal(fromPrismaLeadSegment(null), null);
  });
});
