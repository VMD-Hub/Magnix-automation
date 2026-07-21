/**
 * ADR-017 P2 — KPI email nurture (aggregate, no PII).
 *
 * Usage:
 *   npm run go-live:kpi-email-nurture
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "../lib/prisma";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
} from "../lib/sales-core/marketing-email-consent";

async function main() {
  const days = Number(process.env.KPI_DAYS ?? "30");
  const since = new Date(Date.now() - days * 24 * 3_600_000);

  const emailEnrollments = await prisma.nurtureEnrollment.findMany({
    where: {
      purpose: MARKETING_PURPOSE,
      channel: EMAIL_NURTURE_CHANNEL,
      createdAt: { gte: since },
    },
    select: { id: true, status: true, scriptId: true },
  });
  const enrollmentIds = emailEnrollments.map((e) => e.id);

  const [sent, failed, skipped, withdrawn, opens, clicks, bounces, complaints] =
    await Promise.all([
      enrollmentIds.length
        ? prisma.nurtureDispatch.count({
            where: {
              enrollmentId: { in: enrollmentIds },
              status: "SENT",
              occurredAt: { gte: since },
            },
          })
        : Promise.resolve(0),
      enrollmentIds.length
        ? prisma.nurtureDispatch.count({
            where: {
              enrollmentId: { in: enrollmentIds },
              status: "FAILED",
              occurredAt: { gte: since },
            },
          })
        : Promise.resolve(0),
      enrollmentIds.length
        ? prisma.nurtureDispatch.count({
            where: {
              enrollmentId: { in: enrollmentIds },
              status: "SKIPPED",
              occurredAt: { gte: since },
            },
          })
        : Promise.resolve(0),
      prisma.consentRecord.count({
        where: {
          purpose: MARKETING_PURPOSE,
          channel: EMAIL_NURTURE_CHANNEL,
          action: "WITHDRAWN",
          occurredAt: { gte: since },
        },
      }),
      prisma.emailEngagementEvent.count({
        where: { type: "open", occurredAt: { gte: since } },
      }),
      prisma.emailEngagementEvent.count({
        where: { type: "click", occurredAt: { gte: since } },
      }),
      prisma.emailEngagementEvent.count({
        where: { type: "bounce", occurredAt: { gte: since } },
      }),
      prisma.emailEngagementEvent.count({
        where: { type: "complaint", occurredAt: { gte: since } },
      }),
    ]);

  const enrolled = emailEnrollments.filter((e) => e.status === "ENROLLED").length;
  const cancelled = emailEnrollments.filter((e) => e.status === "CANCELLED").length;

  const openRate = sent > 0 ? Number(((opens / sent) * 100).toFixed(1)) : null;
  const ctr = sent > 0 ? Number(((clicks / sent) * 100).toFixed(1)) : null;
  const unsubRate =
    sent > 0 ? Number(((withdrawn / sent) * 100).toFixed(2)) : null;

  // OA convert proxy: Welcome E1 CTA is Zalo — count clicks tagged waitlist/welcome later;
  // P2 uses click/sent as engagement proxy.
  const report = {
    generatedAt: new Date().toISOString(),
    windowDays: days,
    since: since.toISOString(),
    enrollments: {
      createdInWindow: emailEnrollments.length,
      enrolled,
      cancelled,
      byScript: emailEnrollments.reduce<Record<string, number>>((acc, e) => {
        const key = e.scriptId ?? "unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}),
    },
    dispatches: { sent, failed, skipped },
    engagement: { opens, clicks, bounces, complaints },
    consent: { withdrawn },
    rates: {
      openRatePct: openRate,
      ctrPct: ctr,
      unsubPerSendPct: unsubRate,
      note: "Open/CTR cần webhook provider; không có Resend vẫn đo sent/unsub.",
    },
  };

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
