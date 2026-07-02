import assert from "node:assert/strict";
import test from "node:test";
import {
  checkGoLiveEnv,
  summarizeGoLiveEnv,
} from "../lib/deploy/go-live-env";

test("go-live env: pass khi đủ biến production", () => {
  const saved: Record<string, string | undefined> = {};
  const keys = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "AUTH_SECRET",
    "ADMIN_SECRET",
    "CRON_SECRET",
    "REDIS_URL",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "EMAIL_WEBHOOK_URL",
  ];
  for (const k of keys) saved[k] = process.env[k];

  try {
    process.env.DATABASE_URL =
      "postgresql://housex:secret@127.0.0.1:5432/housex?schema=public";
    process.env.NEXT_PUBLIC_SITE_URL = "https://timnhaxahoi.com";
    process.env.AUTH_SECRET = "a".repeat(32);
    process.env.ADMIN_SECRET = "b".repeat(32);
    process.env.CRON_SECRET = "c".repeat(16);
    process.env.REDIS_URL = "redis://127.0.0.1:6379";
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "House X <noreply@timnhaxahoi.com>";

    const summary = summarizeGoLiveEnv(checkGoLiveEnv());
    assert.equal(summary.ok, true);
    assert.equal(summary.requiredFailed.length, 0);
  } finally {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
});

test("go-live env: fail khi thiếu AUTH_SECRET", () => {
  const saved: Record<string, string | undefined> = {};
  const keys = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SITE_URL",
    "AUTH_SECRET",
    "ADMIN_SECRET",
    "CRON_SECRET",
    "REDIS_URL",
    "RESEND_API_KEY",
    "EMAIL_WEBHOOK_URL",
  ];
  for (const k of keys) saved[k] = process.env[k];

  try {
    delete process.env.AUTH_SECRET;
    process.env.DATABASE_URL =
      "postgresql://housex:secret@127.0.0.1:5432/housex?schema=public";
    process.env.NEXT_PUBLIC_SITE_URL = "https://timnhaxahoi.com";
    process.env.ADMIN_SECRET = "b".repeat(32);
    process.env.CRON_SECRET = "c".repeat(16);
    process.env.REDIS_URL = "redis://127.0.0.1:6379";
    process.env.RESEND_API_KEY = "re_test";

    const summary = summarizeGoLiveEnv(checkGoLiveEnv());
    assert.equal(summary.ok, false);
    assert.ok(summary.requiredFailed.some((s) => s.startsWith("AUTH_SECRET")));
  } finally {
    for (const k of keys) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
});
