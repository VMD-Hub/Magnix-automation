import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  assertMarketingDeliveryAllowed,
  resolveEffectiveConsent,
} from "../lib/sales-core/domain";

test("SC-6 nurture consent gate blocks marketing without grant", () => {
  assert.throws(
    () =>
      assertMarketingDeliveryAllowed(
        resolveEffectiveConsent([], "marketing", "zalo"),
      ),
    /requires effective/,
  );
  assert.doesNotThrow(() =>
    assertMarketingDeliveryAllowed(
      resolveEffectiveConsent(
        [
          {
            purpose: "marketing",
            channel: "zalo",
            action: "GRANTED",
            occurredAt: new Date("2026-07-18T01:00:00Z"),
          },
        ],
        "marketing",
        "zalo",
      ),
    ),
  );
  assert.throws(
    () =>
      assertMarketingDeliveryAllowed(
        resolveEffectiveConsent(
          [
            {
              purpose: "marketing",
              channel: "zalo",
              action: "GRANTED",
              occurredAt: new Date("2026-07-18T01:00:00Z"),
            },
            {
              purpose: "marketing",
              channel: "zalo",
              action: "WITHDRAWN",
              occurredAt: new Date("2026-07-18T02:00:00Z"),
            },
          ],
          "marketing",
          "zalo",
        ),
      ),
    /requires effective/,
  );
});

test("SC-6 artifacts: enrollment schema, APIs, events, nurture wrap", async () => {
  const root = new URL("../", import.meta.url);
  const [schema, migration, nurtureAuto, eventTypes, eligibilityRoute, enrollRoute] =
    await Promise.all([
      readFile(new URL("prisma/schema.prisma", root), "utf8"),
      readFile(
        new URL(
          "prisma/migrations/20260718120000_sales_conversion_sc6_nurture/migration.sql",
          root,
        ),
        "utf8",
      ),
      readFile(new URL("lib/leads/nurture-auto.ts", root), "utf8"),
      readFile(new URL("lib/events/types.ts", root), "utf8"),
      readFile(
        new URL(
          "app/api/admin/conversion/nurture/eligibility/route.ts",
          root,
        ),
        "utf8",
      ),
      readFile(
        new URL(
          "app/api/admin/conversion/nurture/enrollments/route.ts",
          root,
        ),
        "utf8",
      ),
    ]);

  assert.match(schema, /model NurtureEnrollment \{/);
  assert.match(schema, /model NurtureDispatch \{/);
  assert.match(migration, /CREATE TABLE "nurture_enrollments"/);
  assert.match(nurtureAuto, /getEffectiveConsent/);
  assert.match(nurtureAuto, /nurtureEnrollment\.findFirst/);
  assert.match(eventTypes, /"nurture\.eligibility_checked"/);
  assert.match(eventTypes, /"nurture\.dispatch_recorded"/);
  assert.match(eligibilityRoute, /checkNurtureEligibility/);
  assert.match(enrollRoute, /enrollNurture/);
});

test("SC-6 smoke script and enroll UI controls exist", async () => {
  const root = new URL("../", import.meta.url);
  const [smoke, pkg, board, service] = await Promise.all([
    readFile(new URL("scripts/smoke-sc6-nurture.ts", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("components/admin/conversion-ops-board.tsx", root), "utf8"),
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
  ]);
  assert.match(smoke, /recordNurtureDispatchResult/);
  assert.match(smoke, /WITHDRAWN/);
  assert.match(pkg, /go-live:smoke-sc6/);
  assert.match(board, /enrollNurtureAction/);
  assert.match(board, /nextTouch/);
  assert.match(service, /nextTouch/);
  assert.match(service, /status: \{ in: \["ENROLLED", "ELIGIBLE"\] \}/);
});

test("Phase 2 conversion board and list APIs exist without PII fields", async () => {
  const root = new URL("../", import.meta.url);
  const [service, board, nav, roles, listRoute] = await Promise.all([
    readFile(new URL("lib/sales-core/service.ts", root), "utf8"),
    readFile(new URL("components/admin/conversion-ops-board.tsx", root), "utf8"),
    readFile(new URL("lib/admin/nav.ts", root), "utf8"),
    readFile(new URL("lib/admin/roles.ts", root), "utf8"),
    readFile(
      new URL("app/api/admin/conversion/opportunities/route.ts", root),
      "utf8",
    ),
  ]);
  assert.match(service, /export async function listOpportunities/);
  assert.match(service, /export async function getOpportunitySummary/);
  assert.match(listRoute, /export async function GET/);
  assert.match(board, /ConversionOpsBoard/);
  assert.match(nav, /\/admin\/conversion/);
  assert.match(roles, /\/api\/admin\/conversion/);
  assert.doesNotMatch(service, /listOpportunities[\s\S]{0,800}phone:/);
});
