import { test } from "node:test";
import assert from "node:assert/strict";
import { backoffSeconds } from "../lib/events/handlers";

test("backoff: tăng luỹ thừa theo số lần thử", () => {
  assert.equal(backoffSeconds(1), 30);
  assert.equal(backoffSeconds(2), 60);
  assert.equal(backoffSeconds(3), 120);
});

test("backoff: có trần 3600s", () => {
  assert.equal(backoffSeconds(100), 3600);
});

test("backoff: attempts <= 0 → mức tối thiểu", () => {
  assert.equal(backoffSeconds(0), 30);
  assert.equal(backoffSeconds(-5), 30);
});
