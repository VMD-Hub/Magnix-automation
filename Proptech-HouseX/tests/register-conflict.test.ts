import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildRegisterConflict } from "../lib/auth/register-conflict.ts";

describe("buildRegisterConflict", () => {
  it("phone + Zalo without web password → miniapp recovery", () => {
    const { message, details } = buildRegisterConflict({
      kind: "PHONE_REGISTERED",
      role: "CUSTOMER",
      hasZalo: true,
      passwordReady: false,
    });
    assert.match(message, /Mini App Zalo/i);
    assert.deepEqual(details.actions, ["login", "miniapp"]);
  });

  it("phone with password → login + forgot", () => {
    const { details } = buildRegisterConflict({
      kind: "PHONE_REGISTERED",
      role: "BROKER",
      hasZalo: false,
      passwordReady: true,
    });
    assert.equal(details.roleLabel, "môi giới");
    assert.ok(details.actions.includes("login"));
    assert.ok(details.actions.includes("forgot_password"));
  });

  it("email conflict → forgot password path", () => {
    const { message, details } = buildRegisterConflict({
      kind: "EMAIL_REGISTERED",
      role: "CUSTOMER",
      hasZalo: false,
      passwordReady: true,
    });
    assert.match(message, /email/i);
    assert.ok(details.actions.includes("forgot_password"));
  });
});
