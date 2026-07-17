#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const codeDir = path.join(
  root,
  "n8n-workflows",
  "code",
  "housex-noxh-lead",
);

function loadCode(file) {
  const code = fs.readFileSync(path.join(codeDir, file), "utf8");
  return Function("$input", "$env", `return (function () {\n${code}\n})();`);
}

const parse = loadCode("01-auth-parse-event.js");
const formatOps = loadCode("ops-event-04-format-telegram.js");
const env = { EVENTS_WEBHOOK_SECRET: "test-secret" };

const samples = [
  [
    "lead.created",
    {
      leadId: "l1",
      source: "web",
      segment: "cctm",
      contact: { name: "Lead", phone: "0900000000" },
      context: { kind: "listing", entityId: "x1", entityName: "Tin X" },
    },
    "inquiry",
  ],
  [
    "lead.affiliate_contact",
    {
      leadId: "l2",
      vertical: "finance",
      contact: { name: "Affiliate", phone: "0900000001" },
    },
    "inquiry",
  ],
  ["account.registered", { userAccountId: "u1", role: "CUSTOMER" }, "supply"],
  [
    "ctv.application_submitted",
    { applicationId: "a1", brokerId: "b1" },
    "supply",
  ],
  [
    "noxh_case.created",
    { caseId: "case1", caseCode: "HX-1", milestone: "M1" },
    "noxh_case",
  ],
  [
    "noxh_case.milestone_changed",
    { caseId: "case1", caseCode: "HX-1", fromMilestone: "M1", toMilestone: "M2" },
    "noxh_case",
  ],
  [
    "noxh_case.ctv_nudge",
    { caseId: "case1", caseCode: "HX-1", brokerId: "b1", message: "Nudge" },
    "noxh_case",
  ],
  [
    "lead.nurture",
    {
      leadId: "l3",
      nurtureScriptId: "s1",
      trigger: "on_create",
      contact: { name: "Nurture", phone: "0900000002" },
    },
    "nurture",
  ],
  [
    "attribution.conflict",
    { conflictId: "cf1", phase: "opened", kind: "CTV_CLAIM_BLOCKED" },
    "attribution_conflict",
  ],
  [
    "lead.noxh_loan_quick_check",
    {
      leadId: "l4",
      tier: "HOT",
      ageStatus: "PROCEED",
      contact: { name: "Loan", phone: "0900000003" },
    },
    "noxh",
  ],
  [
    "lead.noxh_checked",
    {
      leadId: "l5",
      tier: "HOT",
      overall: "ELIGIBLE",
      creditFlag: "CLEAN",
      contact: { name: "NOXH", phone: "0900000004", email: "" },
    },
    "noxh",
  ],
  [
    "ops.request_created",
    { requestId: "r1", kind: "listing_report", title: "Report" },
    "ops_event",
  ],
  ["lead.won", { leadId: "l1", status: "WON" }, "ops_event"],
  [
    "commission.created",
    { commissionId: "c1", leadId: "l1", brokerId: "b1", amount: "100" },
    "ops_event",
  ],
  ["promotion.spin_won", { winId: "w1", prizeLabel: "Gift" }, "ops_event"],
];

for (const [type, payload, expectedPath] of samples) {
  const result = parse(
    {
      first: () => ({
        json: {
          headers: { "x-events-secret": "test-secret" },
          body: { type, payload },
        },
      }),
    },
    env,
  )[0].json;

  if (result.event_path !== expectedPath) {
    throw new Error(`${type} routed to ${result.event_path}; expected ${expectedPath}`);
  }
}

const formatted = formatOps(
  {
    first: () => ({
      json: {
        ops_kind: "listing_report",
        ops_title: "Báo tin",
        request_id: "r1",
        contact_phone: "0900000000",
      },
    }),
  },
  {
    TELEGRAM_BOT_TOKEN: "token",
    TELEGRAM_CHAT_ID_OPS: "123",
  },
)[0].json;

if (
  !formatted.delivery_required ||
  !formatted.telegram_enabled ||
  !formatted.telegram_message.includes("Báo tin")
) {
  throw new Error("Ops Telegram formatter is not ready");
}

console.log(`PASS: ${samples.length} typed event routes + Ops Telegram formatter`);
