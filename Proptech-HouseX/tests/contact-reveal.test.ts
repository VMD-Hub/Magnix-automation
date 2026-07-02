import { test } from "node:test";
import assert from "node:assert/strict";
import { assertContactRevealAllowed } from "../lib/auth/contact-reveal";

test("contact reveal: chưa đăng nhập → AUTH_REQUIRED", () => {
  const r = assertContactRevealAllowed(null);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "AUTH_REQUIRED");
});

test("contact reveal: môi giới → CUSTOMER_ONLY", () => {
  const r = assertContactRevealAllowed({ role: "BROKER", emailVerified: true });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "CUSTOMER_ONLY");
});

test("contact reveal: khách chưa verify email → EMAIL_NOT_VERIFIED", () => {
  const r = assertContactRevealAllowed({ role: "CUSTOMER", emailVerified: false });
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.code, "EMAIL_NOT_VERIFIED");
});

test("contact reveal: khách đã verify → ok", () => {
  const r = assertContactRevealAllowed({ role: "CUSTOMER", emailVerified: true });
  assert.equal(r.ok, true);
});
