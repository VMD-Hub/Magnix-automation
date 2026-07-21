/**
 * ADR-017 P2 — KPI email nurture (aggregate, no PII).
 *
 * Usage:
 *   npm run go-live:kpi-email-nurture
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { buildEmailNurtureKpi } from "../lib/email/email-nurture-kpi";

async function main() {
  const days = Number(process.env.KPI_DAYS ?? "30");
  const report = await buildEmailNurtureKpi(days);

  const stamp = Date.now();
  const dir = path.join(process.cwd(), "reports");
  await mkdir(dir, { recursive: true });
  const out = path.join(dir, `email-nurture-kpi-${stamp}.json`);
  await writeFile(out, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Wrote ${out}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
