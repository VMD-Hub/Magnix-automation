import assert from "node:assert/strict";
import { test } from "node:test";
import { notifyWaitlistCohortOnLaunch } from "../lib/leads/waitlist-launch";

test("LaunchTrigger no-ops unless SAP_MO_BAN → DANG_BAN", async () => {
  const fakeDb = {
    lead: {
      findMany: async () => {
        throw new Error("should not query leads");
      },
    },
    customerNotification: {
      findUnique: async () => null,
      create: async () => {
        throw new Error("should not create");
      },
    },
  };
  const r = await notifyWaitlistCohortOnLaunch(fakeDb as never, {
    projectId: "p1",
    projectName: "Demo",
    projectSlug: "demo",
    fromStatus: "DANG_BAN",
    toStatus: "DANG_BAN",
  });
  assert.equal(r, null);
});
