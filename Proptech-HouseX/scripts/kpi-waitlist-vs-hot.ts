/**
 * ADR-016 P4 — KPI slice waitlist vs hot vs conversion (aggregate, no PII).
 *
 * Usage:
 *   npm run go-live:kpi-waitlist
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import { WAITLIST_LEAD_SOURCE } from "../lib/leads/capture-type";
import { LEAD_SOURCE } from "../lib/leads/source";

const HOT_SOURCES = new Set([
  LEAD_SOURCE.HOT_MANUAL,
  LEAD_SOURCE.ADS_OFFLINE,
  LEAD_SOURCE.PARTNER,
  LEAD_SOURCE.OPS_MANUAL,
]);

async function main() {
  const days = Number(process.env.KPI_DAYS ?? "30");
  const since = new Date(Date.now() - days * 24 * 3_600_000);

  const [waitlist, hot, consult, total, launchNotifs, waitlistQualified] =
    await Promise.all([
      prisma.lead.count({
        where: { source: WAITLIST_LEAD_SOURCE, createdAt: { gte: since } },
      }),
      prisma.lead.count({
        where: {
          source: { in: [...HOT_SOURCES] },
          createdAt: { gte: since },
        },
      }),
      prisma.lead.count({
        where: {
          source: {
            in: [LEAD_SOURCE.WEB_LEAD, LEAD_SOURCE.MINIAPP_CONSULT],
          },
          createdAt: { gte: since },
          NOT: { source: WAITLIST_LEAD_SOURCE },
        },
      }),
      prisma.lead.count({ where: { createdAt: { gte: since } } }),
      prisma.customerNotification.count({
        where: {
          type: "waitlist_launch",
          createdAt: { gte: since },
        },
      }),
      prisma.lead.count({
        where: {
          source: WAITLIST_LEAD_SOURCE,
          status: "QUALIFIED",
          createdAt: { gte: since },
        },
      }),
    ]);

  const report = {
    generatedAt: new Date().toISOString(),
    windowDays: days,
    since: since.toISOString(),
    leads: {
      waitlist,
      hotManualLike: hot,
      webOrMiniConsult: consult,
      total,
      waitlistShare:
        total > 0 ? Number(((waitlist / total) * 100).toFixed(1)) : 0,
    },
    waitlist: {
      qualifiedInWindow: waitlistQualified,
      launchNotifications: launchNotifs,
    },
    note: "Aggregate only — no PII. Waitlist must not use HOT call SLA.",
  };

  const stamp = Date.now();
  const dir = path.join(process.cwd(), "reports");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `waitlist-kpi-${stamp}.json`);
  await writeFile(file, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
  console.log(`Wrote ${file}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
