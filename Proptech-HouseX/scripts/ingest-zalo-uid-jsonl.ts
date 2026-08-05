/**
 * Bulk ingest Zalo group UID ore → Postgres `inbound_uid_leads` (Magnix SoR).
 *
 * Default: direct Prisma upsert (fast, no Next.js needed).
 * Optional: --via-http → POST /api/ingest/magnix-lead (same path as n8n).
 *
 * Usage:
 *   npm run ingest:zalo-uid-jsonl -- --dry-run
 *   npm run ingest:zalo-uid-jsonl -- --limit 50
 *   npm run ingest:zalo-uid-jsonl
 *   npm run ingest:zalo-uid-jsonl -- --via-http --concurrency 8
 *   npm run ingest:zalo-uid-jsonl -- --file scripts/_tmp-zalo-uids-ingest.jsonl
 *
 * Env: DATABASE_URL (default) · SITE + MAGNIX_INGEST_SECRET (--via-http)
 */
import { createReadStream, writeFileSync, existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseMagnixInboundPayload,
  upsertInboundUidLead,
} from "../lib/data/inbound-uid-lead";
import { prisma } from "../lib/prisma";

const __dirname = dirname(fileURLToPath(import.meta.url));

type Cli = {
  dryRun: boolean;
  viaHttp: boolean;
  freshCapturedAt: boolean;
  limit: number | null;
  offset: number;
  concurrency: number;
  file: string;
};

function flagValue(argv: string[], flag: string): string | undefined {
  const eq = argv.find((a) => a.startsWith(`${flag}=`));
  if (eq) return eq.slice(flag.length + 1);
  const i = argv.indexOf(flag);
  if (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--")) return argv[i + 1];
  return undefined;
}

function parseCli(argv: string[]): Cli {
  const getNum = (flag: string, fallback: number | null) => {
    const raw = flagValue(argv, flag);
    if (raw === undefined) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };

  const fileArg =
    flagValue(argv, "--file") ?? join(__dirname, "_tmp-zalo-uids-ingest.jsonl");

  return {
    dryRun: argv.includes("--dry-run"),
    viaHttp: argv.includes("--via-http"),
    freshCapturedAt: argv.includes("--fresh-captured-at"),
    limit: getNum("--limit", null),
    offset: getNum("--offset", 0) ?? 0,
    concurrency: Math.max(1, getNum("--concurrency", 10) ?? 10),
    file: isAbsolute(fileArg) ? fileArg : resolve(process.cwd(), fileArg),
  };
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      out[i] = await worker(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  );
  return out;
}

async function loadJsonl(path: string): Promise<unknown[]> {
  if (!existsSync(path)) {
    throw new Error(`Không thấy file: ${path}`);
  }
  const rows: unknown[] = [];
  const rl = createInterface({
    input: createReadStream(path, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    rows.push(JSON.parse(trimmed));
  }
  return rows;
}

async function ingestViaHttp(
  payload: ReturnType<typeof parseMagnixInboundPayload>,
  site: string,
  secret: string,
): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const res = await fetch(`${site}/api/ingest/magnix-lead`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-magnix-ingest-secret": secret,
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let json: { data?: { id?: string }; error?: { message?: string } } = {};
  try {
    json = JSON.parse(text) as typeof json;
  } catch {
    return {
      ok: false,
      message: `HTTP ${res.status} non-JSON: ${text.slice(0, 200)}`,
    };
  }
  if (!res.ok) {
    return {
      ok: false,
      message: json.error?.message ?? `HTTP ${res.status}`,
    };
  }
  return { ok: true, id: json.data?.id ?? "" };
}

async function main() {
  const cli = parseCli(process.argv.slice(2));
  const allRows = await loadJsonl(cli.file);
  const sliced = allRows.slice(
    cli.offset,
    cli.limit == null ? undefined : cli.offset + cli.limit,
  );

  console.log(
    JSON.stringify(
      {
        file: cli.file,
        totalInFile: allRows.length,
        offset: cli.offset,
        limit: cli.limit,
        willProcess: sliced.length,
        mode: cli.viaHttp ? "http" : "prisma",
        concurrency: cli.concurrency,
        dryRun: cli.dryRun,
        freshCapturedAt: cli.freshCapturedAt,
      },
      null,
      2,
    ),
  );

  if (cli.dryRun) {
    let valid = 0;
    let invalid = 0;
    for (const row of sliced) {
      try {
        const body =
          cli.freshCapturedAt && row && typeof row === "object"
            ? { ...(row as object), captured_at: new Date().toISOString() }
            : row;
        parseMagnixInboundPayload(body);
        valid += 1;
      } catch {
        invalid += 1;
      }
    }
    console.log(JSON.stringify({ dryRun: true, valid, invalid }, null, 2));
    return;
  }

  let site = "";
  let secret = "";
  if (cli.viaHttp) {
    site = (process.env.SITE ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
      .trim()
      .replace(/\/$/, "");
    secret = (process.env.MAGNIX_INGEST_SECRET ?? "").trim();
    if (!site) throw new Error("Thiếu SITE / NEXT_PUBLIC_SITE_URL");
    if (!secret) throw new Error("Thiếu MAGNIX_INGEST_SECRET");
  }

  const summary = {
    ok: 0,
    failed: 0,
    errors: [] as { normalized_key: string; message: string }[],
  };

  const started = Date.now();
  await mapPool(sliced, cli.concurrency, async (row, index) => {
    let normalizedKey = "(parse-failed)";
    try {
      const body =
        cli.freshCapturedAt && row && typeof row === "object"
          ? { ...(row as object), captured_at: new Date().toISOString() }
          : row;
      const payload = parseMagnixInboundPayload(body);
      normalizedKey = payload.normalized_key;

      if (cli.viaHttp) {
        const result = await ingestViaHttp(payload, site, secret);
        if (!result.ok) throw new Error(result.message);
      } else {
        await upsertInboundUidLead(payload);
      }
      summary.ok += 1;
    } catch (err) {
      summary.failed += 1;
      const message = err instanceof Error ? err.message : String(err);
      if (summary.errors.length < 50) {
        summary.errors.push({ normalized_key: normalizedKey, message });
      }
      console.error(`FAIL ${normalizedKey}: ${message}`);
    }

    if ((index + 1) % 200 === 0 || index + 1 === sliced.length) {
      const elapsed = ((Date.now() - started) / 1000).toFixed(1);
      console.log(
        `progress ${index + 1}/${sliced.length} ok=${summary.ok} fail=${summary.failed} ${elapsed}s`,
      );
    }
  });

  const out = join(__dirname, "_tmp-zalo-uids-ingest-result.json");
  writeFileSync(
    out,
    JSON.stringify(
      {
        ...summary,
        processed: sliced.length,
        elapsedMs: Date.now() - started,
        mode: cli.viaHttp ? "http" : "prisma",
        file: cli.file,
        at: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(
    JSON.stringify(
      {
        ok: summary.ok,
        failed: summary.failed,
        errorSample: summary.errors.length,
        resultFile: out,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
