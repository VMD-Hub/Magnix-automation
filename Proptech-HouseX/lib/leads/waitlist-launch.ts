/**
 * ADR-016 P3 — LaunchTrigger: SAP_MO_BAN → DANG_BAN
 * Notify waitlist cohort in-app (idempotent per customer+project).
 */
import type { Prisma } from "@prisma/client";
import {
  createCustomerNotification,
  CUSTOMER_NOTIFY_TYPE,
} from "@/lib/data/customer-notification";
import { WAITLIST_LEAD_SOURCE } from "@/lib/leads/capture-type";
import { isWaitlistCapture } from "@/lib/leads/capture-type";
import { readLeadOpsMeta } from "@/lib/leads/ops-meta";
import { WAITLIST_NO_COLD_CALL } from "@/lib/content/messaging/interest-waitlist-copy";

type Db = Prisma.TransactionClient;

export type WaitlistLaunchResult = {
  projectId: string;
  notified: number;
  skipped: number;
};

export async function notifyWaitlistCohortOnLaunch(
  db: Db,
  input: {
    projectId: string;
    projectName: string;
    projectSlug: string;
    fromStatus: string;
    toStatus: string;
  },
): Promise<WaitlistLaunchResult | null> {
  if (input.fromStatus !== "SAP_MO_BAN" || input.toStatus !== "DANG_BAN") {
    return null;
  }

  const leads = await db.lead.findMany({
    where: {
      projectId: input.projectId,
      status: { in: ["NEW", "CONTACTED", "QUALIFIED"] },
      source: WAITLIST_LEAD_SOURCE,
    },
    select: {
      id: true,
      customerId: true,
      source: true,
      opsMeta: true,
    },
    take: 2000,
  });

  let notified = 0;
  let skipped = 0;

  for (const lead of leads) {
    if (!lead.customerId) {
      skipped += 1;
      continue;
    }
    const ops = readLeadOpsMeta(lead.opsMeta);
    if (!isWaitlistCapture(ops.captureType, lead.source)) {
      skipped += 1;
      continue;
    }

    const { created } = await createCustomerNotification(db, {
      customerId: lead.customerId,
      type: CUSTOMER_NOTIFY_TYPE.WAITLIST_LAUNCH,
      title: `${input.projectName} đã mở bán`,
      body: `Dự án bạn đăng ký nhận tin đã chuyển sang đang bán. Xem chi tiết trên Mini App / web. ${WAITLIST_NO_COLD_CALL} Bấm «Tôi muốn được tư vấn» nếu cần gọi.`,
      projectId: input.projectId,
      leadId: lead.id,
      href: `/du-an/${input.projectSlug}`,
      dedupeKey: `waitlist_launch:${input.projectId}:${lead.customerId}`,
    });
    if (created) notified += 1;
    else skipped += 1;
  }

  return { projectId: input.projectId, notified, skipped };
}
