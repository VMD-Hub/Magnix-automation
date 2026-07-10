/**
 * Zalo OA CS — tùy chọn, tách khỏi thông báo in-app CTV.
 * Mặc định production: ZALO_OA_NOTIFY_ENABLED=false (milestone/conflict chỉ in-app).
 * Bật true khi chạy chiến dịch quảng bá qua OA (phase sau).
 */
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

export function formatConflictOaMessage(
  payload: OutboxPayloads["attribution.conflict"],
): string {
  const site = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://timnhaxahoi.com"
  ).replace(/\/$/, "");
  const agentUrl = `${site}/moi-gioi/thong-bao`;
  const masked = payload.normalizedPhoneMasked;
  const customer = payload.customerName?.trim();

  if (payload.phase === "opened") {
    if (payload.kind === "CTV_CLAIM_BLOCKED") {
      return [
        "[House X] Không thể giữ lead affiliate",
        customer ? `Khách: ${customer}` : `SĐT: ${masked}`,
        payload.rejectLabel ? `Lý do: ${payload.rejectLabel}` : null,
        "Khách đang được House X tư vấn. Thử lại sau hoặc liên hệ Ops.",
        `Chi tiết: ${agentUrl}`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    return [
      "[House X] Cảnh báo xung đột attribution",
      customer ? `Khách: ${customer}` : `SĐT: ${masked}`,
      payload.noxhCaseCode ? `Hồ sơ đang giữ: ${payload.noxhCaseCode}` : null,
      payload.platformLeadSource
        ? `Lead Ops mới từ: ${payload.platformLeadSource}`
        : "Lead marketing Ops mới trùng SĐT hồ sơ bạn đang giữ.",
      "Ops đang xử lý — bạn sẽ được thông báo khi có quyết định.",
      `Theo dõi: ${agentUrl}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  const resolutionHint =
    payload.resolution === "KEEP_PLATFORM"
      ? "House X tiếp tục pipeline Ops cho khách này."
      : payload.resolution === "RELEASE_TO_CTV"
        ? "Bạn có thể tiếp tục affiliate theo quyết định Ops."
        : payload.resolution === "SPLIT_LANE"
          ? "Hai intent được tách lane — xem ghi chú Ops trên Mini App."
          : payload.resolution === "DISMISS_BOTH"
            ? "Hồ sơ/lead đã đóng — không giữ quyền affiliate."
            : null;

  return [
    "[House X] Kết quả xử lý xung đột",
    customer ? `Khách: ${customer}` : `SĐT: ${masked}`,
    payload.resolutionLabel
      ? `Quyết định Ops: ${payload.resolutionLabel}`
      : null,
    resolutionHint,
    `Chi tiết: ${agentUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** CRM-R5 — push xung đột attribution tới CTV qua Zalo OA (best-effort / outbox retry). */
export async function notifyBrokerConflictZaloOa(
  payload: OutboxPayloads["attribution.conflict"],
): Promise<void> {
  if (!isZaloOaNotifyEnabled()) return;

  const brokerId = payload.brokerId?.trim();
  if (!brokerId) return;

  const zaloUserId = await resolveBrokerZaloUserId(brokerId);
  if (!zaloUserId) {
    console.log(
      `[zalo-oa] skip attribution.conflict ${payload.conflictId} — broker chưa có zaloUserId`,
    );
    return;
  }

  const result = await sendOaCsText({
    userId: zaloUserId,
    text: formatConflictOaMessage(payload),
  });

  if (result.ok) return;

  if (result.skipPermanent) {
    console.log(
      `[zalo-oa] skip permanent (${result.error}) conflict=${payload.conflictId}`,
    );
    return;
  }

  throw new Error(`Zalo OA conflict notify failed: ${result.error}`);
}
