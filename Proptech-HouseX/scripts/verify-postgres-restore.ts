import { createHash } from "node:crypto";
import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { mkdir, open, readFile, stat, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { createGunzip } from "node:zlib";
import { fileURLToPath } from "node:url";

const DISPOSABLE_DB_PATTERN = /^housex_restore_verify_[a-z0-9_]{1,35}$/;
const FORBIDDEN_DATABASES = new Set(["housex", "postgres", "template0", "template1"]);
const KEY_TABLES = ["customers", "leads", "outbox_events", "inbound_uid_leads"] as const;

export type RestoreVerifyOptions = {
  backup: string;
  checksum: string;
  adminUrl: URL;
  targetDb: string;
  evidence: string;
  psql: string;
};

export type Evidence = {
  schema_version: "housex.restore-verification.v1";
  started_at: string;
  finished_at?: string;
  result: "running" | "passed" | "failed";
  backup: { file: string; bytes?: number; sha256?: string; gzip_valid?: boolean };
  target: { host: string; port: string; database: string; disposable_guard: boolean };
  checks: Array<{ name: string; ok: boolean; detail?: unknown }>;
  cleanup: {
    attempted: boolean;
    sessions_terminated: boolean;
    drop_command_completed: boolean;
    deletion_verified: boolean;
    database_dropped: boolean;
  };
  errors?: Array<{ code: string; summary: string }>;
};

type PsqlExecutor = (
  psql: string,
  env: NodeJS.ProcessEnv,
  args: string[],
  inputFile?: string,
) => Promise<string>;

export type RestoreVerifyDependencies = {
  runPsql?: PsqlExecutor;
};

class SafeEvidenceError extends Error {
  constructor(
    readonly code: string,
    readonly summary: string,
  ) {
    super(summary);
  }
}

function requireValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

export function parseArgs(argv: string[], env: NodeJS.ProcessEnv = process.env): RestoreVerifyOptions {
  const values = new Map<string, string>();
  const allowed = new Set([
    "--backup",
    "--checksum",
    "--admin-url",
    "--target-db",
    "--confirm-disposable",
    "--evidence",
    "--psql",
  ]);

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (!allowed.has(flag)) throw new Error(`unknown argument: ${flag}`);
    if (values.has(flag)) throw new Error(`duplicate argument: ${flag}`);
    values.set(flag, requireValue(argv, i, flag));
    i += 1;
  }

  const backup = values.get("--backup");
  const targetDb = values.get("--target-db");
  const confirmation = values.get("--confirm-disposable");
  const adminUrlText = values.get("--admin-url") ?? env.HOUSEX_RESTORE_VERIFY_ADMIN_URL;
  if (!backup) throw new Error("--backup is required");
  if (!adminUrlText) throw new Error("--admin-url or HOUSEX_RESTORE_VERIFY_ADMIN_URL is required");
  if (!targetDb) throw new Error("--target-db is required");
  if (confirmation !== targetDb) {
    throw new Error("--confirm-disposable must exactly match --target-db");
  }
  if (!DISPOSABLE_DB_PATTERN.test(targetDb) || FORBIDDEN_DATABASES.has(targetDb)) {
    throw new Error(
      `--target-db must match ${DISPOSABLE_DB_PATTERN} and must be disposable`,
    );
  }

  let adminUrl: URL;
  try {
    adminUrl = new URL(adminUrlText);
  } catch {
    throw new Error("--admin-url must be a valid PostgreSQL URL");
  }
  if (!["postgres:", "postgresql:"].includes(adminUrl.protocol)) {
    throw new Error("--admin-url must use postgres:// or postgresql://");
  }
  if (!["localhost", "127.0.0.1", "::1"].includes(adminUrl.hostname)) {
    throw new Error("--admin-url must point to localhost; external restore proof is a separate operator action");
  }
  const adminDatabase = decodeURIComponent(adminUrl.pathname.replace(/^\//, ""));
  if (!adminDatabase || adminDatabase === targetDb) {
    throw new Error("--admin-url must name an existing admin database, not the disposable target");
  }

  const backupPath = resolve(backup);
  return {
    backup: backupPath,
    checksum: resolve(values.get("--checksum") ?? `${backupPath}.sha256`),
    adminUrl,
    targetDb,
    evidence: resolve(
      values.get("--evidence") ??
        `restore-evidence-${targetDb}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    ),
    psql: values.get("--psql") ?? env.HOUSEX_RESTORE_VERIFY_PSQL ?? "psql",
  };
}

export async function verifyBackupArtifact(
  backupPath: string,
  checksumPath: string,
): Promise<{ bytes: number; sha256: string }> {
  if (!existsSync(backupPath)) throw new Error(`backup not found: ${backupPath}`);
  if (!existsSync(checksumPath)) throw new Error(`checksum not found: ${checksumPath}`);

  const metadata = await stat(backupPath);
  if (!metadata.isFile() || metadata.size === 0) throw new Error("backup must be a non-empty file");

  const checksumText = (await readFile(checksumPath, "utf8")).trim();
  const match = /^([a-fA-F0-9]{64})\s+\*?(.+)$/.exec(checksumText);
  if (!match) throw new Error("checksum file must contain one sha256sum-compatible entry");
  if (basename(match[2]) !== basename(backupPath)) {
    throw new Error("checksum filename does not match backup filename");
  }

  const hash = createHash("sha256");
  await pipeline(createReadStream(backupPath), hash);
  const actualHash = hash.digest("hex");
  if (actualHash.toLowerCase() !== match[1].toLowerCase()) {
    throw new Error("backup SHA-256 does not match checksum");
  }

  let sqlBytes = 0;
  let prefix = "";
  const gunzip = createGunzip();
  gunzip.on("data", (chunk: Buffer) => {
    sqlBytes += chunk.length;
    if (prefix.length < 4096) prefix += chunk.toString("utf8", 0, 4096 - prefix.length);
  });
  await pipeline(createReadStream(backupPath), gunzip, createWriteStream(
    process.platform === "win32" ? "NUL" : "/dev/null",
  ));
  if (sqlBytes === 0) throw new Error("backup decompresses to an empty SQL stream");
  if (!prefix.includes("-- PostgreSQL database dump")) {
    throw new Error("decompressed backup does not contain a pg_dump header");
  }
  return { bytes: metadata.size, sha256: actualHash };
}

function pgEnv(url: URL, database?: string): NodeJS.ProcessEnv {
  return {
    ...process.env,
    PGHOST: url.hostname,
    PGPORT: url.port || "5432",
    PGUSER: decodeURIComponent(url.username),
    PGPASSWORD: decodeURIComponent(url.password),
    PGDATABASE: database ?? decodeURIComponent(url.pathname.replace(/^\//, "")),
  };
}

function sqlLiteral(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlIdentifier(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

async function runPsql(
  psql: string,
  env: NodeJS.ProcessEnv,
  args: string[],
  inputFile?: string,
): Promise<string> {
  const child = spawn(psql, ["-X", "--no-psqlrc", ...args], {
    env,
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });
  let stdout = "";
  child.stdout.setEncoding("utf8").on("data", (chunk) => { stdout += chunk; });
  child.stderr.resume();

  const exit = new Promise<void>((resolveExit, reject) => {
    child.once("error", reject);
    child.once("close", (code) => {
      if (code === 0) resolveExit();
      else reject(new Error(`psql exited with status ${code}`));
    });
  });
  if (inputFile) {
    await Promise.all([
      pipeline(createReadStream(inputFile), createGunzip(), child.stdin),
      exit,
    ]);
  } else {
    child.stdin.end();
    await exit;
  }
  return stdout.trim();
}

async function executePsql(
  executor: PsqlExecutor,
  operation: string,
  psql: string,
  env: NodeJS.ProcessEnv,
  args: string[],
  inputFile?: string,
): Promise<string> {
  try {
    return await executor(psql, env, args, inputFile);
  } catch {
    throw new SafeEvidenceError(
      `PSQL_${operation.toUpperCase()}_FAILED`,
      `psql ${operation.replaceAll("_", " ")} command failed`,
    );
  }
}

function safeFailure(error: unknown): { code: string; summary: string } {
  if (error instanceof SafeEvidenceError) {
    return { code: error.code, summary: error.summary };
  }
  return {
    code: "VERIFICATION_FAILED",
    summary: "restore verification failed; inspect protected operator logs",
  };
}

function addFailure(evidence: Evidence, error: unknown): void {
  const failure = safeFailure(error);
  evidence.errors ??= [];
  if (!evidence.errors.some((item) => item.code === failure.code)) {
    evidence.errors.push(failure);
  }
}

async function writeEvidenceCreateOnly(path: string, evidence: Evidence): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const handle = await open(path, "wx");
  try {
    await writeFile(handle, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  } finally {
    await handle.close();
  }
}

export async function runRestoreVerification(
  options: RestoreVerifyOptions,
  dependencies: RestoreVerifyDependencies = {},
): Promise<Evidence> {
  const evidence: Evidence = {
    schema_version: "housex.restore-verification.v1",
    started_at: new Date().toISOString(),
    result: "running",
    backup: { file: basename(options.backup) },
    target: {
      host: options.adminUrl.hostname,
      port: options.adminUrl.port || "5432",
      database: options.targetDb,
      disposable_guard: true,
    },
    checks: [],
    cleanup: {
      attempted: false,
      sessions_terminated: false,
      drop_command_completed: false,
      deletion_verified: false,
      database_dropped: false,
    },
  };
  const adminEnv = pgEnv(options.adminUrl);
  const psqlExecutor = dependencies.runPsql ?? runPsql;
  let created = false;

  try {
    let artifact: Awaited<ReturnType<typeof verifyBackupArtifact>>;
    try {
      artifact = await verifyBackupArtifact(options.backup, options.checksum);
    } catch {
      throw new SafeEvidenceError(
        "ARTIFACT_VERIFICATION_FAILED",
        "backup checksum, gzip, or pg_dump header verification failed",
      );
    }
    Object.assign(evidence.backup, artifact, { gzip_valid: true });
    evidence.checks.push({ name: "artifact_checksum_and_gzip", ok: true });

    const exists = await executePsql(psqlExecutor, "target_lookup", options.psql, adminEnv, [
      "-At", "-v", "ON_ERROR_STOP=1", "-c",
      `SELECT 1 FROM pg_database WHERE datname = ${sqlLiteral(options.targetDb)};`,
    ]);
    if (exists === "1") {
      throw new SafeEvidenceError(
        "TARGET_ALREADY_EXISTS",
        "refusing to use an existing target database",
      );
    }
    if (exists !== "") {
      throw new SafeEvidenceError("TARGET_LOOKUP_INVALID", "target lookup returned an invalid result");
    }
    evidence.checks.push({ name: "target_did_not_exist", ok: true });

    await executePsql(psqlExecutor, "create_database", options.psql, adminEnv, [
      "-v", "ON_ERROR_STOP=1", "-c",
      `CREATE DATABASE ${sqlIdentifier(options.targetDb)} TEMPLATE template0;`,
    ]);
    created = true;
    await executePsql(
      psqlExecutor,
      "restore",
      options.psql,
      pgEnv(options.adminUrl, options.targetDb),
      ["-v", "ON_ERROR_STOP=1", "--single-transaction"],
      options.backup,
    );
    evidence.checks.push({ name: "restore_completed", ok: true });

    const schemaResult = await executePsql(
      psqlExecutor,
      "schema_check",
      options.psql,
      pgEnv(options.adminUrl, options.targetDb),
      ["-At", "-v", "ON_ERROR_STOP=1", "-c",
       `SELECT current_database() = ${sqlLiteral(options.targetDb)}
          AND to_regnamespace('public') IS NOT NULL;`],
    );
    if (schemaResult !== "t") {
      throw new SafeEvidenceError(
        "SCHEMA_CHECK_FAILED",
        "restored database or public schema integrity check failed",
      );
    }
    evidence.checks.push({ name: "database_and_schema_present", ok: true });

    const tableList = KEY_TABLES.map(sqlLiteral).join(",");
    const rowCounts: Record<string, string> = {};
    for (const table of KEY_TABLES) {
      const count = await executePsql(
        psqlExecutor,
        "table_read",
        options.psql,
        pgEnv(options.adminUrl, options.targetDb),
        ["-At", "-v", "ON_ERROR_STOP=1", "-c",
         `SELECT count(*) FROM ${sqlIdentifier("public")}.${sqlIdentifier(table)};`],
      );
      if (!/^\d+$/.test(count)) {
        throw new SafeEvidenceError("TABLE_COUNT_INVALID", "key table count returned an invalid result");
      }
      rowCounts[table] = count;
    }
    evidence.checks.push({
      name: "key_tables_present_and_readable",
      ok: true,
      detail: rowCounts,
    });

    const constraintResult = await executePsql(
      psqlExecutor,
      "constraint_check",
      options.psql,
      pgEnv(options.adminUrl, options.targetDb),
      ["-At", "-v", "ON_ERROR_STOP=1", "-c",
       `SELECT
          (SELECT count(*) FROM pg_constraint WHERE contype = 'p' AND conrelid IN (
            SELECT to_regclass('public.' || name) FROM unnest(ARRAY[${tableList}]) AS name
          )) = ${KEY_TABLES.length}
          AND to_regclass('public.inbound_uid_leads_normalized_key_key') IS NOT NULL
          AND to_regclass('public.customers_normalized_phone_key') IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conrelid IN (
              SELECT to_regclass('public.' || name) FROM unnest(ARRAY[${tableList}]) AS name
            ) AND NOT convalidated
          );`],
    );
    if (constraintResult !== "t") {
      throw new SafeEvidenceError(
        "CONSTRAINT_CHECK_FAILED",
        "primary-key, unique-key, or validated-constraint integrity check failed",
      );
    }
    evidence.checks.push({ name: "key_constraints_valid", ok: true });
    evidence.result = "passed";
  } catch (error) {
    evidence.result = "failed";
    addFailure(evidence, error);
    evidence.checks.push({
      name: "verification_error",
      ok: false,
      detail: evidence.errors?.at(-1),
    });
  } finally {
    evidence.cleanup.attempted = created;
    if (created) {
      try {
        await executePsql(psqlExecutor, "cleanup_terminate", options.psql, adminEnv, [
          "-v", "ON_ERROR_STOP=1", "-c",
          `SELECT pg_terminate_backend(pid) FROM pg_stat_activity
           WHERE datname = ${sqlLiteral(options.targetDb)} AND pid <> pg_backend_pid();`,
        ]);
        evidence.cleanup.sessions_terminated = true;
      } catch (cleanupError) {
        evidence.result = "failed";
        addFailure(evidence, cleanupError);
      }

      try {
        await executePsql(psqlExecutor, "cleanup_drop", options.psql, adminEnv, [
          "-v", "ON_ERROR_STOP=1", "-c",
          `DROP DATABASE ${sqlIdentifier(options.targetDb)};`,
        ]);
        evidence.cleanup.drop_command_completed = true;
      } catch (cleanupError) {
        evidence.result = "failed";
        addFailure(evidence, cleanupError);
      }

      try {
        const remains = await executePsql(
          psqlExecutor,
          "cleanup_verify",
          options.psql,
          adminEnv,
          [
            "-At", "-v", "ON_ERROR_STOP=1", "-c",
            `SELECT 1 FROM pg_database WHERE datname = ${sqlLiteral(options.targetDb)};`,
          ],
        );
        if (remains !== "") {
          throw new SafeEvidenceError(
            "CLEANUP_DATABASE_REMAINS",
            "disposable database deletion was not verified",
          );
        }
        evidence.cleanup.deletion_verified = true;
        evidence.cleanup.database_dropped = true;
      } catch (cleanupError) {
        evidence.result = "failed";
        addFailure(evidence, cleanupError);
      }
    }
    evidence.finished_at = new Date().toISOString();
    await writeEvidenceCreateOnly(options.evidence, evidence);
  }
  return evidence;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  if (existsSync(options.evidence)) throw new Error(`evidence file already exists: ${options.evidence}`);
  const evidence = await runRestoreVerification(options);
  process.stdout.write(`${JSON.stringify(evidence)}\n`);
  if (evidence.result !== "passed") process.exitCode = 1;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    process.stderr.write(`ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}
