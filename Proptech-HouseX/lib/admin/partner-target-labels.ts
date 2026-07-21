import type { PartnerTargetKind, PartnerTargetStatus } from "@prisma/client";

/** Soft cap — list tay, không CRM. */
export const PARTNER_TARGET_ACTIVE_SOFT_CAP = 40;

export const PARTNER_TARGET_KIND_LABEL: Record<PartnerTargetKind, string> = {
  UNION: "Công đoàn",
  HR: "HR / Nhân sự",
  KCN: "Ban Qlý KCN",
  ENTERPRISE: "Doanh nghiệp",
  OTHER: "Khác",
};

export const PARTNER_TARGET_STATUS_LABEL: Record<PartnerTargetStatus, string> = {
  TARGET: "Đang target",
  CONTACTED: "Đã liên hệ",
  MEETING: "Hẹn gặp / hội thảo",
  PARTNER: "Đã hợp tác",
  PAUSED: "Tạm dừng",
  DROP: "Bỏ",
};
