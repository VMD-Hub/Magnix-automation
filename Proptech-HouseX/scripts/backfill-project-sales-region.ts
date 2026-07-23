/**
 * Backfill Project.salesRegion từ province → registry NOXH P0
 * (`inferPrismaSalesRegionFromProvince`).
 *
 * Ops only — không đổi leadLane, không đụng copy public.
 *
 * Usage:
 *   # Dry-run (mặc định)
 *   npm run db:backfill:sales-region
 *
 *   # Ghi Postgres (chỉ hàng salesRegion = null + suy ra được)
 *   npm run db:backfill:sales-region -- --apply
 *
 *   # Ghi cả khi đã có giá trị khác suy luận
 *   npm run db:backfill:sales-region -- --apply --force
 *
 *   # Một project
 *   npm run db:backfill:sales-region -- --apply --project-id=<uuid>
 */
import { PrismaClient, type SalesRegion } from "@prisma/client";
import {
  planProjectSalesRegionBackfill,
  type PrismaSalesRegion,
} from "../lib/content/noxh-province-registry.ts";

const prisma = new PrismaClient();

function argValue(flag: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`${flag}=`));
  return hit?.slice(flag.length + 1);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const force = process.argv.includes("--force");
  const projectId = argValue("--project-id");
  const limit = Number(argValue("--limit") ?? "0") || 0;

  const projects = await prisma.project.findMany({
    where: {
      deletedAt: null,
      ...(projectId ? { id: projectId } : {}),
    },
    select: {
      id: true,
      slug: true,
      name: true,
      province: true,
      salesRegion: true,
    },
    orderBy: { updatedAt: "desc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  const toSet: Array<{
    id: string;
    slug: string;
    province: string;
    from: SalesRegion | null;
    to: SalesRegion;
  }> = [];
  const unmatched = new Map<string, number>();
  let alreadyOk = 0;
  let keepExisting = 0;

  for (const p of projects) {
    const plan = planProjectSalesRegionBackfill(
      p.province,
      p.salesRegion as PrismaSalesRegion | null,
      { force },
    );
    if (plan.action === "set") {
      toSet.push({
        id: p.id,
        slug: p.slug,
        province: p.province,
        from: p.salesRegion,
        to: plan.next as SalesRegion,
      });
      continue;
    }
    if (plan.reason === "already_ok") alreadyOk += 1;
    else if (plan.reason === "keep_existing") keepExisting += 1;
    else {
      const key = p.province.trim() || "(empty)";
      unmatched.set(key, (unmatched.get(key) ?? 0) + 1);
    }
  }

  console.log(
    [
      `mode=${apply ? "APPLY" : "DRY-RUN"}${force ? " force" : ""}`,
      `scanned=${projects.length}`,
      `would_set=${toSet.length}`,
      `already_ok=${alreadyOk}`,
      `keep_existing=${keepExisting}`,
      `no_infer=${[...unmatched.values()].reduce((a, b) => a + b, 0)}`,
    ].join(" · "),
  );

  if (unmatched.size > 0) {
    console.log("\nprovince không map registry (giữ nguyên salesRegion):");
    for (const [prov, n] of [...unmatched.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${n}× ${prov}`);
    }
  }

  if (toSet.length > 0) {
    console.log("\nupdates:");
    for (const row of toSet.slice(0, 40)) {
      console.log(
        `  ${row.slug} | ${row.province} | ${row.from ?? "null"} → ${row.to}`,
      );
    }
    if (toSet.length > 40) {
      console.log(`  … +${toSet.length - 40} nữa`);
    }
  }

  if (!apply) {
    console.log("\nDry-run only. Thêm --apply để ghi DB.");
    return;
  }

  let updated = 0;
  for (const row of toSet) {
    await prisma.project.update({
      where: { id: row.id },
      data: { salesRegion: row.to },
    });
    updated += 1;
  }
  console.log(`\nĐã cập nhật ${updated} project(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
