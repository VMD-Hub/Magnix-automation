import type { NoxhMilestone } from "@prisma/client";

export const MILESTONE_LABEL: Record<NoxhMilestone, string> = {
  M1_RECEIVED: "Đã tiếp nhận & liên hệ tư vấn",
  M2_DOCUMENTS: "Hoàn thiện hồ sơ điều kiện",
  M3_SUBMITTED: "Đã nộp hồ sơ CĐT / Sở XD",
  M4_APPROVED: "Phê duyệt — hẹn ký HĐMB",
  M5_SIGNED: "Đã ký HĐMB",
};

export const MILESTONE_ORDER: NoxhMilestone[] = [
  "M1_RECEIVED",
  "M2_DOCUMENTS",
  "M3_SUBMITTED",
  "M4_APPROVED",
  "M5_SIGNED",
];

export function milestoneIndex(m: NoxhMilestone): number {
  return MILESTONE_ORDER.indexOf(m);
}

export function milestoneProgressLabel(m: NoxhMilestone): string {
  const idx = milestoneIndex(m) + 1;
  return `Mốc ${idx}/5`;
}
