import { prisma } from "@/lib/prisma";
import {
  EMAIL_NURTURE_CHANNEL,
  MARKETING_PURPOSE,
} from "@/lib/sales-core/marketing-email-consent";

export type EmailNurtureKpiReport = {
  generatedAt: string;
  windowDays: number;
  since: string;
  enrollments: {
    createdInWindow: number;
    enrolled: number;
    cancelled: number;
    byScript: Record<string, number>;
  };
  dispatches: { sent: number; failed: number; skipped: number };
  engagement: {
    opens: number;
    clicks: number;
    bounces: number;
    complaints: number;
  };
  consent: { withdrawn: number };
  rates: {
    openRatePct: number | null;
    ctrPct: number | null;
    unsubPerSendPct: number | null;
    note: string;
  };
};

export async function buildEmailNurtureKpi(
  windowDays = 30,
): Promise<EmailNurtureKpiReport> {
  const days = Math.min(90, Math.max(1, Math.floor(windowDays)));
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
  const cancelled = emailEnrollments.filter(
    (e) => e.status === "CANCELLED",
  ).length;

  const openRate = sent > 0 ? Number(((opens / sent) * 100).toFixed(1)) : null;
  const ctr = sent > 0 ? Number(((clicks / sent) * 100).toFixed(1)) : null;
  const unsubRate =
    sent > 0 ? Number(((withdrawn / sent) * 100).toFixed(2)) : null;

  return {
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
}
