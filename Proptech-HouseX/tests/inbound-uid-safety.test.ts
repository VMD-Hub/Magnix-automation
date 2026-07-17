import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import type { Prisma } from "@prisma/client";
import { promoteInboundUidLeadInTransaction } from "../lib/data/inbound-uid-lead";
import {
  deriveInboundNormalizedKey,
  isMagnixIngestAuthorized,
  magnixInboundPayloadSchema,
  mergeInboundMetaPreservingReserved,
} from "../lib/validation/inbound-uid";

const repoRoot = new URL("../../", import.meta.url);

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    uid: "external-123",
    uid_source: "partner_csv",
    captured_at: "2026-07-17T10:00:00.000Z",
    ...overrides,
  };
}

async function runN8nCode(
  relativePath: string,
  globals: Record<string, unknown>,
) {
  const source = await readFile(new URL(relativePath, repoRoot), "utf8");
  const names = Object.keys(globals);
  const execute = new Function(...names, source);
  return execute(...names.map((name) => globals[name]));
}

test("server derives normalized_key and rejects a forged key", () => {
  assert.equal(
    deriveInboundNormalizedKey(" partner_csv ", " external-123 "),
    "partner_csv:external-123",
  );

  const parsed = magnixInboundPayloadSchema.parse(validPayload());
  assert.equal(parsed.normalized_key, "partner_csv:external-123");

  assert.throws(() =>
    magnixInboundPayloadSchema.parse(
      validPayload({ normalized_key: "another_source:another_uid" }),
    ),
  );
});

test("external inbound meta cannot set reserved link or ops state", () => {
  const parsed = magnixInboundPayloadSchema.parse(
    validPayload({
      meta: {
        campaign: "campaign-1",
        ops_status: "converted",
        ops_note: "forged",
        platform_lead_id: "lead-forged",
        noxh_case_id: "case-forged",
        noxh_case_code: "HX-FORGED",
      },
    }),
  );
  assert.deepEqual(parsed.meta, { campaign: "campaign-1" });
});

test("re-ingest preserves server-owned meta and refreshes external meta", () => {
  assert.deepEqual(
    mergeInboundMetaPreservingReserved(
      {
        campaign: "old",
        ops_status: "contacted",
        ops_note: "server note",
        platform_lead_id: "lead-1",
        noxh_case_id: "case-1",
      },
      {
        campaign: "new",
        ops_status: "forged",
        platform_lead_id: "lead-forged",
      },
    ),
    {
      campaign: "new",
      ops_status: "contacted",
      ops_note: "server note",
      platform_lead_id: "lead-1",
      noxh_case_id: "case-1",
    },
  );
});

test("House X ingest authorization fails closed", () => {
  const bearer = new Headers({ authorization: "Bearer expected-secret" });
  assert.equal(isMagnixIngestAuthorized(bearer, undefined), false);
  assert.equal(isMagnixIngestAuthorized(bearer, "expected-secret"), true);
  assert.equal(isMagnixIngestAuthorized(bearer, "different-secret"), false);

  const direct = new Headers({
    "x-magnix-ingest-secret": "expected-secret",
  });
  assert.equal(isMagnixIngestAuthorized(direct, "expected-secret"), true);
});

test("n8n UID webhook requires a configured matching token", async () => {
  const input = {
    first: () => ({
      json: {
        headers: { authorization: "Bearer expected-secret" },
        body: { uid: "external-123", uid_source: "partner_csv" },
      },
    }),
  };

  await assert.rejects(
    async () =>
      runN8nCode("n8n-workflows/code/uid-ingest/01-auth-enrich.js", {
        $env: {},
        $input: input,
      }),
    /MAGNIX_WEBHOOK_TOKEN is required/,
  );

  const result = (await runN8nCode(
    "n8n-workflows/code/uid-ingest/01-auth-enrich.js",
    {
      $env: { MAGNIX_WEBHOOK_TOKEN: "expected-secret" },
      $input: input,
    },
  )) as Array<{ json: { normalized_key: string } }>;
  assert.equal(result[0]?.json.normalized_key, "partner_csv:external-123");
});

test("LLM parse failure becomes a complete failed inbound record", async () => {
  const skeleton = {
    uid: "external-123",
    uid_source: "partner_csv",
    normalized_key: "partner_csv:external-123",
    captured_at: "2026-07-17T10:00:00.000Z",
    text: "request",
    meta: { campaign: "safe-campaign-id" },
    consent_basis: "partner",
  };
  const result = (await runN8nCode(
    "n8n-workflows/code/uid-ingest/06-dead-letter-parse.js",
    {
      $: () => ({ first: () => ({ json: skeleton }) }),
      $input: { first: () => ({ json: { parse_error: "INVALID_SEGMENT" } }) },
    },
  )) as Array<{ json: Record<string, unknown> }>;

  assert.deepEqual(
    {
      uid: result[0]?.json.uid,
      normalized_key: result[0]?.json.normalized_key,
      status: result[0]?.json.status,
      classify_method: result[0]?.json.classify_method,
    },
    {
      uid: "external-123",
      normalized_key: "partner_csv:external-123",
      status: "failed",
      classify_method: "llm",
    },
  );
  assert.equal("raw_preview" in result[0]!.json, false);
});

test("generated workflow sends parse failures through House X", async () => {
  const workflow = JSON.parse(
    await readFile(
      new URL("n8n-workflows/uid-ingest.workflow.json", repoRoot),
      "utf8",
    ),
  ) as {
    connections: Record<
      string,
      { main: Array<Array<{ node: string }>> }
    >;
  };

  assert.equal(
    workflow.connections["Dead Letter Parse Fail"]?.main[0]?.[0]?.node,
    "HouseX Postgres Ingest",
  );
});

test("promotion uses the typed link and never treats UID key as phone", async () => {
  const [schema, promotion] = await Promise.all([
    readFile(new URL("Proptech-HouseX/prisma/schema.prisma", repoRoot), "utf8"),
    readFile(
      new URL("Proptech-HouseX/lib/data/inbound-uid-lead.ts", repoRoot),
      "utf8",
    ),
  ]);

  assert.match(schema, /platformLeadId\s+String\?\s+@unique/);
  assert.match(promotion, /FOR UPDATE/);
  assert.match(promotion, /"acquisition\.touch_promoted"/);
  assert.doesNotMatch(promotion, /phone:\s*inbound\.normalizedKey/);
  assert.doesNotMatch(
    promotion,
    /inbound\.platformLeadId\s*\?\?\s*ops\.platform_lead_id/,
  );
});

test("admin inbound serialization exposes only the typed platform lead link", async () => {
  const [listRoute, detailRoute] = await Promise.all([
    readFile(
      new URL(
        "Proptech-HouseX/app/api/admin/inbound-leads/route.ts",
        repoRoot,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "Proptech-HouseX/app/api/admin/inbound-leads/[id]/route.ts",
        repoRoot,
      ),
      "utf8",
    ),
  ]);
  for (const route of [listRoute, detailRoute]) {
    assert.match(route, /platformLeadId: row\.platformLeadId/);
    assert.doesNotMatch(
      route,
      /platformLeadId:\s*(?:row\.platformLeadId\s*\?\?\s*)?ops\.platform_lead_id/,
    );
  }
  assert.match(detailRoute, /meta: sanitizeInboundMetaForAdmin\(row\.meta\)/);
  assert.doesNotMatch(detailRoute, /meta: row\.meta/);
});

test("promotion retries reuse the authoritative typed lead link", async () => {
  const now = new Date("2026-07-17T10:00:00.000Z");
  const inbound = {
    id: "touch-1",
    uid: "external-123",
    uidSource: "partner_csv",
    normalizedKey: "partner_csv:external-123",
    capturedAt: now,
    text: "request",
    segment: "general_inbound",
    score: 70,
    interestKey: "general_request",
    tags: [],
    meta: {},
    classifyMethod: "regex",
    consentBasis: null,
    status: "classified",
    platformLeadId: null as string | null,
    createdAt: now,
    updatedAt: now,
  };
  const lead = {
    id: "lead-1",
    customerId: null,
    listingId: null,
    projectId: null,
    referralId: null,
    assignedBrokerId: null,
    source: "magnix:partner_csv",
    sourceMeta: null,
    opsMeta: {},
    segment: null,
    message: "request",
    status: "NEW" as const,
    createdAt: now,
    updatedAt: now,
  };
  let createCount = 0;
  let outboxCount = 0;

  const tx = {
    $queryRaw: () => Promise.resolve([{ id: inbound.id }]),
    inboundUidLead: {
      findUnique: () => Promise.resolve({ ...inbound }),
      update: ({ data }: { data: { platformLeadId?: string; meta?: unknown } }) => {
        if (data.platformLeadId) inbound.platformLeadId = data.platformLeadId;
        if (data.meta) inbound.meta = data.meta as Record<string, unknown>;
        return Promise.resolve({ ...inbound });
      },
    },
    lead: {
      findUnique: ({ where }: { where: { id: string } }) =>
        Promise.resolve(where.id === lead.id ? lead : null),
      create: () => {
        createCount += 1;
        return Promise.resolve(lead);
      },
    },
    outboxEvent: {
      createMany: () => {
        outboxCount += 1;
        return Promise.resolve({ count: 1 });
      },
    },
  } as unknown as Prisma.TransactionClient;

  const first = await promoteInboundUidLeadInTransaction(tx, inbound.id);
  const retry = await promoteInboundUidLeadInTransaction(tx, inbound.id);

  assert.equal(first?.created, true);
  assert.equal(retry?.created, false);
  assert.equal(retry?.lead.id, lead.id);
  assert.equal(createCount, 1);
  assert.equal(outboxCount, 1);
});
