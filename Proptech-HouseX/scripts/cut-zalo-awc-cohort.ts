/**
 * Cut A/W/C pilot cohort from inbound_uid_leads (zalo_group_raw).
 *
 * Usage:
 *   npm run cohort:zalo-awc -- --dry-run
 *   npm run cohort:zalo-awc -- --size 300
 *   npm run cohort:zalo-awc -- --size 300 --apply
 *
 * Writes local staging (gitignored via scripts/_tmp-*):
 *   _tmp-zalo-awc-cohort.json  — ids + masked uid + normalized_key
 *   _tmp-zalo-awc-kpi.json     — empty A/W/C counters for D0–D14
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { maskInboundUid } from "../lib/inbound/ops-meta";

const __dirname = dirname(fileURLToPath(import.meta.url));

function argNum(flag: string, fallback: number): number {
  const argv = process.argv.slice(2);
  const eq = argv.find((a) => a.startsWith(`${flag}=`));
  if (eq) return Number(eq.slice(flag.length + 1)) || fallback;
  const i = argv.indexOf(flag);
  if (i >= 0 && argv[i + 1]) return Number(argv[i + 1]) || fallback;
  return fallback;
}

function todayStamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function main() {
  const size = Math.max(1, argNum("--size", 300));
  const version = Math.max(1, argNum("--version", 1));
  const dryRun = process.argv.includes("--dry-run");
  const apply = process.argv.includes("--apply");
  if (!dryRun && !apply) {
    throw new Error("Chỉ định --dry-run hoặc --apply");
  }
  const cohortId = `zalo-awc-${todayStamp()}-v${version}`;
  const hookId = "H1";
  const measureUntil = new Date();
  measureUntil.setDate(measureUntil.getDate() + 14);

  const pool = await prisma.inboundUidLead.findMany({
    where: { uidSource: "zalo_group_raw" },
    select: {
      id: true,
      uid: true,
      normalizedKey: true,
      score: true,
      segment: true,
      meta: true,
      status: true,
    },
    take: 50_000,
  });

  const eligible = pool.filter((row) => {
    const m =
      row.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
        ? (row.meta as Record<string, unknown>)
        : {};
    return !m.cohort_id;
  });

  if (eligible.length < size) {
    throw new Error(
      `Pool thiếu UID chưa gắn cohort: có ${eligible.length}, cần ${size}`,
    );
  }

  const picked = shuffle(eligible).slice(0, size);

  console.log(
    JSON.stringify(
      {
        cohortId,
        hookId,
        size,
        poolEligible: eligible.length,
        poolFetched: pool.length,
        measureUntil: measureUntil.toISOString().slice(0, 10),
        apply,
        dryRun,
      },
      null,
      2,
    ),
  );

  if (dryRun) {
    const out = {
      cohortId,
      hookId,
      size: picked.length,
      dryRun: true,
      members: picked.map((r) => ({
        id: r.id,
        normalized_key: r.normalizedKey,
        uid_masked: maskInboundUid(r.uid),
        score: r.score,
      })),
    };
    const path = join(__dirname, "_tmp-zalo-awc-cohort.json");
    writeFileSync(path, JSON.stringify(out, null, 2), "utf8");
    console.log(`Wrote dry-run cohort → ${path}`);
    return;
  }

  let updated = 0;
  for (const row of picked) {
    const prev =
      row.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
        ? { ...(row.meta as Record<string, unknown>) }
        : {};
    const meta = {
      ...prev,
      cohort_id: cohortId,
      hook_id: hookId,
      awc_tier: "pool",
      awc_measure_until: measureUntil.toISOString().slice(0, 10),
      quality: prev.quality ?? "raw_ore",
      group_hint: prev.group_hint ?? "zalo_group_members",
    };
    await prisma.inboundUidLead.update({
      where: { id: row.id },
      data: { meta: meta as Prisma.InputJsonValue },
    });
    updated += 1;
  }

  const cohortPath = join(__dirname, "_tmp-zalo-awc-cohort.json");
  const kpiPath = join(__dirname, "_tmp-zalo-awc-kpi.json");

  writeFileSync(
    cohortPath,
    JSON.stringify(
      {
        cohortId,
        hookId,
        size: picked.length,
        measureUntil: measureUntil.toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        members: picked.map((r) => ({
          id: r.id,
          normalized_key: r.normalizedKey,
          uid_masked: maskInboundUid(r.uid),
          score: r.score,
        })),
      },
      null,
      2,
    ),
    "utf8",
  );

  writeFileSync(
    kpiPath,
    JSON.stringify(
      {
        cohortId,
        hookId,
        N: picked.length,
        d0: new Date().toISOString().slice(0, 10),
        d14: measureUntil.toISOString().slice(0, 10),
        A: 0,
        W: 0,
        C: 0,
        notes: [],
        thresholds: { aRate: 0.08, wRate: 0.02, cRate: 0.005 },
        playbook: "docs/ops/ZALO_UID_AWC_HOOK_PLAYBOOK.md",
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    JSON.stringify(
      { updated, cohortPath, kpiPath, cohortId, hookId },
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
