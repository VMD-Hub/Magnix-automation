import type { OutboxPayloads } from "@/lib/events/types";
import { prisma } from "@/lib/prisma";
import { MILESTONE_LABEL } from "@/lib/noxh-case/milestone-labels";
import { isZaloOaNotifyEnabled, sendOaCsText } from "@/lib/zalo/oa";

export function formatMilestoneOaMessage(
  payload: OutboxPayloads["noxh_case.milestone_changed"],
): string {
  const site = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://timnhaxahoi.com"
  ).replace(/\/$/, "");
  const label =
    MILESTONE_LABEL[payload.toMilestone as keyof typeof MILESTONE_LABEL] ??
    payload.toMilestone;

  return [
    `[House X] Hồ sơ ${payload.caseCode}`,
    `Tiến độ: ${label}`,
    payload.opsNote ? `Ghi chú Ops: ${payload.opsNote}` : null,
    `Mở Agent: ${site}/moi-gioi/ho-so`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function resolveBrokerZaloUserId(
  brokerId: string,
): Promise<string | null> {
  const broker = await prisma.broker.findUnique({
    where: { id: brokerId },
    select: {
      userAccount: { select: { zaloUserId: true } },
    },
  });
  const zaloUserId = broker?.userAccount?.zaloUserId?.trim();
  return zaloUserId || null;
}

/** DNA-D — push milestone tới CTV qua Zalo OA (best-effort / outbox retry). */
export async function notifyBrokerMilestoneZaloOa(
  payload: OutboxPayloads["noxh_case.milestone_changed"],
): Promise<void> {
  if (!isZaloOaNotifyEnabled()) return;

  const brokerId = payload.brokerId?.trim();
  if (!brokerId) return;

  const zaloUserId = await resolveBrokerZaloUserId(brokerId);
  if (!zaloUserId) {
    console.log(
      `[zalo-oa] skip milestone ${payload.caseCode} — broker chưa có zaloUserId`,
    );
    return;
  }

  const result = await sendOaCsText({
    userId: zaloUserId,
    text: formatMilestoneOaMessage(payload),
  });

  if (result.ok) return;

  if (result.skipPermanent) {
    console.log(
      `[zalo-oa] skip permanent (${result.error}) case=${payload.caseCode}`,
    );
    return;
  }

  throw new Error(`Zalo OA milestone notify failed: ${result.error}`);
}
