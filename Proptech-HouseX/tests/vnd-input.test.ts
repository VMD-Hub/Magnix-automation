import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatVndInputDisplay,
  parseDecimalInput,
  parseVndInput,
} from "../lib/format/vnd-input.ts";

test("parseVndInput strips non-digits", () => {
  assert.equal(parseVndInput("3.000.000.000"), 3_000_000_000);
  assert.equal(parseVndInput("3000000000"), 3_000_000_000);
  assert.equal(parseVndInput(""), 0);
});

test("formatVndInputDisplay groups thousands", () => {
  assert.equal(formatVndInputDisplay(3_000_000_000), "3.000.000.000");
  assert.equal(formatVndInputDisplay(0), "");
});

test("parseDecimalInput parses comma decimal", () => {
  assert.equal(parseDecimalInput("7.2"), 7.2);
  assert.equal(parseDecimalInput("7,"), 7);
});

test("phone digits strip", () => {
  const digits = "090-1234-5678".replace(/\D/g, "").slice(0, 12);
  assert.equal(digits, "09012345678");
});
