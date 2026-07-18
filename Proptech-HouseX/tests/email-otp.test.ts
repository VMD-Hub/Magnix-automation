import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateEmailOtpCode,
  hashEmailOtp,
  verifyEmailOtpCode,
} from "../lib/auth/email-otp";

test("email OTP: 6 digits and hash verify", () => {
  const code = generateEmailOtpCode();
  assert.match(code, /^\d{6}$/);
  const h = hashEmailOtp(code);
  assert.equal(verifyEmailOtpCode(code, h), true);
  assert.equal(verifyEmailOtpCode("000000", h), false);
});
