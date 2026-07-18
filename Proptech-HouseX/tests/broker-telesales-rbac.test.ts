import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertLeadReadableByBroker,
  BrokerTelesalesAccessError,
} from "../lib/broker/telesales-access";

test("CTV rejects platform pool (assignedBrokerId null, no own case)", () => {
  assert.throws(
    () =>
      assertLeadReadableByBroker(
        { id: "lead-1", assignedBrokerId: null, noxhCases: [] },
        { brokerId: "ctv-1", brokerType: "CTV" },
      ),
    (err: unknown) =>
      err instanceof BrokerTelesalesAccessError &&
      err.code === "SCOPE_DENIED",
  );
});

test("CTV can read own assigned lead", () => {
  assert.doesNotThrow(() =>
    assertLeadReadableByBroker(
      { id: "lead-1", assignedBrokerId: "ctv-1", noxhCases: [] },
      { brokerId: "ctv-1", brokerType: "CTV" },
    ),
  );
});

test("CTV can read lead via own NoxhCase even if assignedBrokerId differs", () => {
  assert.doesNotThrow(() =>
    assertLeadReadableByBroker(
      {
        id: "lead-1",
        assignedBrokerId: "other",
        noxhCases: [{ brokerId: "ctv-1" }],
      },
      { brokerId: "ctv-1", brokerType: "CTV" },
    ),
  );
});

test("INTERNAL rejects platform pool", () => {
  assert.throws(
    () =>
      assertLeadReadableByBroker(
        { id: "lead-1", assignedBrokerId: null },
        { brokerId: "floor-1", brokerType: "INTERNAL" },
      ),
    (err: unknown) =>
      err instanceof BrokerTelesalesAccessError &&
      err.code === "SCOPE_DENIED",
  );
});

test("INTERNAL can read only self-assigned lead", () => {
  assert.doesNotThrow(() =>
    assertLeadReadableByBroker(
      { id: "lead-1", assignedBrokerId: "floor-1" },
      { brokerId: "floor-1", brokerType: "INTERNAL" },
    ),
  );
  assert.throws(
    () =>
      assertLeadReadableByBroker(
        {
          id: "lead-1",
          assignedBrokerId: "other",
          noxhCases: [{ brokerId: "floor-1" }],
        },
        { brokerId: "floor-1", brokerType: "INTERNAL" },
      ),
    BrokerTelesalesAccessError,
  );
});

test("ops pool filter requires assignedBrokerId null", async () => {
  const src = await import("node:fs").then((fs) =>
    fs.readFileSync(
      new URL("../lib/leads/ops-lead-board.ts", import.meta.url),
      "utf8",
    ),
  );
  assert.match(src, /assignedBrokerId:\s*null/);
  assert.match(src, /OPS_EXCLUDED_SOURCES/);
});

test("BrokerType.INTERNAL present in prisma schema", async () => {
  const src = await import("node:fs").then((fs) =>
    fs.readFileSync(
      new URL("../prisma/schema.prisma", import.meta.url),
      "utf8",
    ),
  );
  assert.match(src, /enum BrokerType[\s\S]*INTERNAL/);
});
