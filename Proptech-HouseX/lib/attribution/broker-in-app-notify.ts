import type {
  AttributionConflictKind,
  AttributionConflictResolution,
  Prisma,
} from "@prisma/client";
import { createBrokerNotification } from "@/lib/data/broker-notification";
import {
  CONFLICT_KIND_LABEL,
  CONFLICT_REJECT_LABEL,
  CONFLICT_RESOLUTION_LABEL,
} from "@/lib/attribution/conflict";

type Tx = Prisma.TransactionClient;

export type AttributionInAppNotifyInput = {
  brokerId: string;
  phase: "opened" | "resolved";
  conflictId: string;
  kind: AttributionConflictKind;
  rejectReason?: string | null;
  resolution?: AttributionConflictResolution | null;
  customerName?: string | null;
  phoneMasked: string;
  noxhCaseId?: string | null;
  noxhCaseCode?: string | null;
};

export function formatAttributionConflictNotification(
  input: AttributionInAppNotifyInput,
): { type: string; title: string; body: string } {
  const who = input.customerName?.trim() || `SĐT ${input.phoneMasked}`;

  if (input.phase === "opened") {
    if (input.kind === "CTV_CLAIM_BLOCKED") {
      const reason = input.rejectReason
        ? (CONFLICT_REJECT_LABEL[input.rejectReason] ?? input.rejectReason)
        : null;
      return {
        type: "attribution.claim_blocked",
        title: "Không thể giữ lead",
        body: [
          `Khách ${who} không claim được.`,
          reason ? `Lý do: ${reason}.` : null,
          "House X đang tư vấn khách này — thử lại sau hoặc liên hệ Ops.",
        ]
          .filter(Boolean)
          .join(" "),
      };
    }

    return {
      type: "attribution.conflict_opened",
      title: "Xung đột attribution",
      body: [
        `Lead Ops mới trùng ${who}.`,
        input.noxhCaseCode ? `Hồ sơ đang giữ: ${input.noxhCaseCode}.` : null,
        CONFLICT_KIND_LABEL[input.kind],
        "Ops đang xử lý — bạn sẽ được báo khi có quyết định.",
      ]
        .filter(Boolean)
        .join(" "),
    };
  }

  const resolutionLabel = input.resolution
    ? CONFLICT_RESOLUTION_LABEL[input.resolution]
    : null;
  const hint =
    input.resolution === "KEEP_PLATFORM"
      ? "House X tiếp tục pipeline Ops."
      : input.resolution === "RELEASE_TO_CTV"
        ? "Bạn có thể tiếp tục affiliate theo quyết định Ops."
        : input.resolution === "SPLIT_LANE"
          ? "Hai intent được tách lane — xem ghi chú Ops."
          : input.resolution === "DISMISS_BOTH"
            ? "Hồ sơ/lead đã đóng."
            : null;

  return {
    type: "attribution.conflict_resolved",
    title: "Kết quả xung đột",
    body: [
      `Khách ${who}.`,
      resolutionLabel ? `Quyết định: ${resolutionLabel}.` : null,
      hint,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

/** In-app notification cho CTV — song song Zalo OA (CRM-R5). */
export async function createAttributionConflictBrokerNotification(
  tx: Tx,
  input: AttributionInAppNotifyInput,
): Promise<void> {
  if (!input.brokerId.trim()) return;

  const { type, title, body } = formatAttributionConflictNotification(input);
  const refSuffix = ` [${input.conflictId.slice(0, 8)}]`;

  const exists = await tx.brokerNotification.findFirst({
    where: {
      brokerId: input.brokerId,
      type,
      body: { endsWith: refSuffix },
    },
    select: { id: true },
  });
  if (exists) return;

  await createBrokerNotification(tx, {
    brokerId: input.brokerId,
    type,
    title,
    body: `${body}${refSuffix}`,
    caseId: input.noxhCaseId ?? undefined,
  });
}
