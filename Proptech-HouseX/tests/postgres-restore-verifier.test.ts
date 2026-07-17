import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { gzipSync } from "node:zlib";
import {
  parseArgs,
  runRestoreVerification,
  type RestoreVerifyOptions,
  verifyBackupArtifact,
} from "../scripts/verify-postgres-restore";

const ADMIN_URL = "postgresql://housex:secret@127.0.0.1:5432/postgres";
const TARGET = "housex_restore_verify_test";

function requiredArgs(extra: string[] = []): string[] {
  return [
    "--backup", "backup.sql.gz",
    "--admin-url", ADMIN_URL,
    "--target-db", TARGET,
    "--confirm-disposable", TARGET,
    ...extra,
  ];
}

async function makeRestoreFixture(directory: string): Promise<RestoreVerifyOptions> {
  const backup = join(directory, "housex-test.sql.gz");
  const checksum = `${backup}.sha256`;
  const compressed = gzipSync("-- PostgreSQL database dump\nCREATE TABLE example(id int);\n");
  await writeFile(backup, compressed);
  await writeFile(
    checksum,
    `${createHash("sha256").update(compressed).digest("hex")}  housex-test.sql.gz\n`,
  );
  return {
    backup,
    checksum,
    adminUrl: new URL(ADMIN_URL),
    targetDb: TARGET,
    evidence: join(directory, "evidence.json"),
    psql: "psql",
  };
}

function successfulPsqlResult(args: string[]): string {
  const commandIndex = args.indexOf("-c");
  const sql = commandIndex >= 0 ? args[commandIndex + 1] : "";
  if (sql.includes("pg_constraint")) return "t";
  if (sql.includes("current_database()")) return "t";
  if (sql.includes("SELECT count(*)")) return "0";
  return "";
}

test("restore verifier accepts an explicitly confirmed disposable localhost target", () => {
  const options = parseArgs(requiredArgs(["--evidence", "evidence.json"]));
  assert.equal(options.targetDb, TARGET);
  assert.equal(options.adminUrl.hostname, "127.0.0.1");
  assert.match(options.evidence, /evidence\.json$/);
});

test("restore verifier rejects target without exact confirmation", () => {
  assert.throws(
    () => parseArgs([
      "--backup", "backup.sql.gz",
      "--admin-url", ADMIN_URL,
      "--target-db", TARGET,
      "--confirm-disposable", "housex_restore_verify_other",
    ]),
    /must exactly match/,
  );
});

test("restore verifier rejects production-like and remote targets", () => {
  assert.throws(
    () => parseArgs([
      "--backup", "backup.sql.gz",
      "--admin-url", ADMIN_URL,
      "--target-db", "housex",
      "--confirm-disposable", "housex",
    ]),
    /must match/,
  );
  assert.throws(
    () => parseArgs(requiredArgs().map((value) =>
      value === ADMIN_URL
        ? "postgresql://housex:secret@db.example.com:5432/postgres"
        : value
    )),
    /must point to localhost/,
  );
});

test("restore verifier rejects unknown and duplicate arguments before DB access", () => {
  assert.throws(() => parseArgs([...requiredArgs(), "--force", "yes"]), /unknown argument/);
  assert.throws(
    () => parseArgs([...requiredArgs(), "--backup", "other.sql.gz"]),
    /duplicate argument/,
  );
});

test("artifact verification passes gzip and matching sha256", async () => {
  const directory = await mkdtemp(join(tmpdir(), "housex-restore-test-"));
  try {
    const backup = join(directory, "housex-test.sql.gz");
    const checksum = `${backup}.sha256`;
    const compressed = gzipSync("-- PostgreSQL database dump\nCREATE TABLE example(id int);\n");
    await writeFile(backup, compressed);
    await writeFile(
      checksum,
      `${createHash("sha256").update(compressed).digest("hex")}  housex-test.sql.gz\n`,
    );

    const result = await verifyBackupArtifact(backup, checksum);
    assert.equal(result.bytes, compressed.length);
    assert.match(result.sha256, /^[a-f0-9]{64}$/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("artifact verification fails checksum and malformed gzip without DB access", async () => {
  const directory = await mkdtemp(join(tmpdir(), "housex-restore-test-"));
  try {
    const backup = join(directory, "housex-test.sql.gz");
    const checksum = `${backup}.sha256`;
    const invalidGzip = Buffer.from("not-a-gzip");
    await writeFile(backup, invalidGzip);
    await writeFile(checksum, `${"0".repeat(64)}  housex-test.sql.gz\n`);
    await assert.rejects(verifyBackupArtifact(backup, checksum), /does not match/);

    await writeFile(
      checksum,
      `${createHash("sha256").update(invalidGzip).digest("hex")}  housex-test.sql.gz\n`,
    );
    await assert.rejects(verifyBackupArtifact(backup, checksum), /incorrect header check|invalid/i);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("cleanup terminates sessions, drops separately, and verifies deletion", async () => {
  const directory = await mkdtemp(join(tmpdir(), "housex-restore-test-"));
  try {
    const options = await makeRestoreFixture(directory);
    const calls: Array<{ args: string[]; inputFile?: string }> = [];
    const evidence = await runRestoreVerification(options, {
      runPsql: async (_psql, _env, args, inputFile) => {
        calls.push({ args: [...args], inputFile });
        return successfulPsqlResult(args);
      },
    });

    assert.equal(evidence.result, "passed");
    assert.deepEqual(evidence.cleanup, {
      attempted: true,
      sessions_terminated: true,
      drop_command_completed: true,
      deletion_verified: true,
      database_dropped: true,
    });

    const terminateCall = calls.find(({ args }) =>
      args.includes("-c") && args[args.indexOf("-c") + 1].includes("pg_terminate_backend")
    );
    const dropCall = calls.find(({ args }) =>
      args.includes("-c") && args[args.indexOf("-c") + 1].startsWith("DROP DATABASE")
    );
    assert.ok(terminateCall);
    assert.ok(dropCall);
    assert.notEqual(terminateCall, dropCall);
    assert.doesNotMatch(terminateCall.args[terminateCall.args.indexOf("-c") + 1], /DROP DATABASE/);
    assert.doesNotMatch(dropCall.args[dropCall.args.indexOf("-c") + 1], /pg_terminate_backend/);
    assert.ok(!dropCall.args.includes("--single-transaction"));

    const dropIndex = calls.indexOf(dropCall);
    const deletionCheck = calls.slice(dropIndex + 1).find(({ args }) =>
      args.includes("-c") && args[args.indexOf("-c") + 1].includes("FROM pg_database")
    );
    assert.ok(deletionCheck, "cleanup must query pg_database after DROP DATABASE");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("failed cleanup evidence uses bounded codes and redacts psql diagnostics", async () => {
  const directory = await mkdtemp(join(tmpdir(), "housex-restore-test-"));
  try {
    const options = await makeRestoreFixture(directory);
    const rawPii = "psql stdout/stderr: customer@example.com phone +84901234567";
    let databaseLookupCount = 0;
    const evidence = await runRestoreVerification(options, {
      runPsql: async (_psql, _env, args) => {
        const sql = args.includes("-c") ? args[args.indexOf("-c") + 1] : "";
        if (sql.includes("pg_terminate_backend") || sql.startsWith("DROP DATABASE")) {
          throw new Error(rawPii);
        }
        if (sql.includes("FROM pg_database") && sql.includes("SELECT 1")) {
          databaseLookupCount += 1;
          return databaseLookupCount === 1 ? "" : "1";
        }
        if (sql.includes("SELECT count(*)")) return rawPii;
        return successfulPsqlResult(args);
      },
    });

    assert.equal(evidence.result, "failed");
    assert.equal(evidence.cleanup.database_dropped, false);
    assert.equal(evidence.cleanup.deletion_verified, false);
    assert.deepEqual(
      evidence.errors?.map(({ code }) => code),
      [
        "TABLE_COUNT_INVALID",
        "PSQL_CLEANUP_TERMINATE_FAILED",
        "PSQL_CLEANUP_DROP_FAILED",
        "CLEANUP_DATABASE_REMAINS",
      ],
    );

    const serialized = JSON.stringify(evidence);
    const persisted = await readFile(options.evidence, "utf8");
    for (const output of [serialized, persisted]) {
      assert.doesNotMatch(output, /customer@example\.com|\+84901234567|psql stdout\/stderr/);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
