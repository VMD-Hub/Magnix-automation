/**
 * Aggregate Ops cohort KPIs (no PII) for Sales Gap Round 2 Wave 2.
 *
 * Usage:
 *   npm run go-live:kpi-sales-ops-cohort
 *   COHORT_DAYS=5 npm run go-live:kpi-sales-ops-cohort
 *
 * Writes reports/sales-ops-cohort-kpi-<stamp>.json (counts/rates only).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";

function ok(msg: string) {
  console.log(`OK — ${msg}`);
}

async function main() {
  const days = Math.max(
    1,
    Math.min(90, Number(process.env.COHORT_DAYS ?? "5") || 5),
  );
  const since = new Date(Date.now() - days * 86_400_000);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  const leadsCreated = await prisma.lead.count({
    where: { createdAt: { gte: since } },
  });

  const assigned = await prisma.leadAssignment.count({
    where: { assignedAt: { gte: since } },
  });

  const accepted = await prisma.leadAssignment.count({
    where: {
      assignedAt: { gte: since },
      acceptedAt: { not: null },
    },
  });

  const withActivity = await prisma.salesActivity.groupBy({
    by: ["leadId"],
    where: { occurredAt: { gte: since } },
  });

  const withAppointment = await prisma.appointment.groupBy({
    by: ["leadId"],
    where: { createdAt: { gte: since } },
  });

  const qualifiedWithAppt = await prisma.lead.count({
    where: {
      status: { in: ["QUALIFIED", "WON", "LOST"] },
      updatedAt: { gte: since },
      appointments: { some: {} },
    },
  });

  const qualifiedTotal = await prisma.lead.count({
    where: {
      status: { in: ["QUALIFIED", "WON", "LOST"] },
      updatedAt: { gte: since },
    },
  });

  const pct = (n: number, d: number) =>
    d === 0 ? null : Math.round((n / d) * 1000) / 10;

  const evidence = {
    result: "ok",
    at: new Date().toISOString(),
    windowDays: days,
    since: since.toISOString(),
    metrics: {
      leadsCreated,
      assignmentsCreated: assigned,
      assignmentsAccepted: accepted,
      acceptRatePct: pct(accepted, assigned),
      leadsWithActivity: withActivity.length,
      activityCoverageVsLeadsPct: pct(withActivity.length, leadsCreated),
      leadsWithAppointment: withAppointment.length,
      appointmentCoverageVsLeadsPct: pct(withAppointment.length, leadsCreated),
      qualifiedOrTerminal: qualifiedTotal,
      qualifiedWithAppointment: qualifiedWithAppt,
      appointmentAfterQualifyPct: pct(qualifiedWithAppt, qualifiedTotal),
    },
    note: "Aggregate only — no lead/customer identifiers. Wave 2 Ops cohort tracker.",
  };

  const reportsDir = path.join(process.cwd(), "reports");
  await mkdir(reportsDir, { recursive: true });
  const reportPath = path.join(
    reportsDir,
    `sales-ops-cohort-kpi-${stamp}.json`,
  );
  await writeFile(reportPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");

  ok(`Cohort KPI window ${days}d`);
  console.log(JSON.stringify(evidence.metrics, null, 2));
  ok(`evidence → ${reportPath}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => undefined);
  });
