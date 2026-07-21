import type { LeadSegment } from "@prisma/client";
import { LEAD_SOURCE } from "@/lib/leads/source";

export type NurtureScriptChannel =
  | "oa"
  | "telegram"
  | "zalo"
  | "manual"
  | "sms"
  | "email";

/** Phase 2 telesales — enroll thủ công từ server-send (không auto-resolve). */
export const TELESALES_MISS_CALLBACK_SCRIPT_ID = "telesales-miss-callback";

/** ADR-017 P0 — Welcome email sau tool NOXH (dispatch E1–E3 = P1). */
export const NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID = "noxh-tool-email-welcome";

/** ADR-017 P0 — Digest email phụ cho waitlist (chỉ khi ConsentRecord email). */
export const WAITLIST_EMAIL_DIGEST_SCRIPT_ID = "waitlist-email-digest";

/** ADR-017 P2 — Newsletter tuần (opt-in marketing email). */
export const WEEKLY_NEWSLETTER_SCRIPT_ID = "weekly-newsletter";

/** ADR-017 P3 — 1-shot re-engage sau ~90 ngày không tương tác. */
export const INACTIVE_REENGAGE_SCRIPT_ID = "email-inactive-reengage";

/** ADR-017 P3 — CCTM / utility BĐS email cohort. */
export const CCTM_UTILITY_EMAIL_SCRIPT_ID = "cctm-utility-email";

export type NurtureScript = {
  id: string;
  label: string;
  description: string;
  channel: NurtureScriptChannel;
  segment?: LeadSegment | null;
  sources?: string[];
};

/** Catalog nội bộ — map segment + source → template nurture Ops. */
export const NURTURE_SCRIPT_CATALOG: NurtureScript[] = [
  {
    id: "noxh-zalo-ads-checklist",
    label: "NOXH — Checklist hồ sơ (Zalo Ads)",
    description:
      "Gửi checklist điều kiện NOXH + hẹn gọi xác nhận thu nhập trong 24h.",
    channel: "zalo",
    segment: "NOXH",
    sources: [LEAD_SOURCE.ZALO_ADS],
  },
  {
    id: "noxh-fanpage-warm",
    label: "NOXH — Nội dung fanpage + form",
    description: "Phản hồi comment/DM + link mini checklist NOXH.",
    channel: "zalo",
    segment: "NOXH",
    sources: [LEAD_SOURCE.FANPAGE],
  },
  {
    id: "noxh-tool-followup",
    label: "NOXH — Sau tool kiểm tra điều kiện",
    description: "Tóm tắt kết quả tool + đề xuất bước gỡ hồ sơ nếu WARM.",
    channel: "oa",
    segment: "NOXH",
    sources: [LEAD_SOURCE.TOOL_NOXH_CHECK, LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK],
  },
  {
    id: NOXH_TOOL_EMAIL_WELCOME_SCRIPT_ID,
    label: "NOXH — Welcome email sau tool (ADR-017)",
    description:
      "Chuỗi Welcome E1–E3: lead magnet / lỗi hồ sơ / dự án SoR. P0 = catalog + consent; gửi = P1.",
    channel: "email",
    segment: "NOXH",
    sources: [LEAD_SOURCE.TOOL_NOXH_CHECK, LEAD_SOURCE.TOOL_NOXH_LOAN_QUICK],
  },
  {
    id: "cctm-zalo-ads-consult",
    label: "CCTM — Tư vấn nhà thương mại (Ads)",
    description: "Giới thiệu utility HouseX + hẹn call 15 phút phân tích nhu cầu.",
    channel: "zalo",
    segment: "CCTM",
    sources: [LEAD_SOURCE.ZALO_ADS, LEAD_SOURCE.FANPAGE],
  },
  {
    id: "miniapp-consult-welcome",
    label: "Mini App — Chào + xác nhận intent",
    description: "Xác nhận segment đã chọn + gợi ý bước tiếp theo trên Mini App.",
    channel: "zalo",
    sources: [LEAD_SOURCE.MINIAPP_CONSULT],
  },
  {
    id: "web-lead-generic",
    label: "Web — Chào mừng + phân loại",
    description: "Email/Zalo chào + hỏi intent NOXH vs CCTM nếu chưa rõ.",
    channel: "manual",
    sources: [LEAD_SOURCE.WEB_LEAD, LEAD_SOURCE.ORGANIC, LEAD_SOURCE.OPS_MANUAL],
  },
  {
    id: "waitlist-progress-updates",
    label: "Waitlist — cập nhật tiến độ (in-app)",
    description:
      "ADR-016: không gọi điện; nurture thưa chính sách/tiến độ qua Mini App / OA khi consent.",
    channel: "manual",
    sources: [LEAD_SOURCE.WAITLIST_PROJECT],
  },
  {
    id: "waitlist-policy-digest",
    label: "Waitlist — tin chính sách / điều kiện",
    description:
      "Cadence thưa: điều kiện NOXH, vay, đối tượng — value-first, không framing mất mát.",
    channel: "manual",
    sources: [LEAD_SOURCE.WAITLIST_PROJECT],
  },
  {
    id: "waitlist-launch-open",
    label: "Waitlist — tín hiệu mở bán",
    description:
      "Khi dự án DANG_BAN: ưu tiên in-app notify (LaunchTrigger); gọi chỉ sau opt-in.",
    channel: "manual",
    sources: [LEAD_SOURCE.WAITLIST_PROJECT],
  },
  {
    id: WAITLIST_EMAIL_DIGEST_SCRIPT_ID,
    label: "Waitlist — email digest phụ (ADR-017)",
    description:
      "ADR-016: in-app mặc định. Email chỉ khi ConsentRecord channel=email; cadence thưa.",
    channel: "email",
    sources: [LEAD_SOURCE.WAITLIST_PROJECT],
  },
  {
    id: WEEKLY_NEWSLETTER_SCRIPT_ID,
    label: "Newsletter tuần — NOXH / House X (ADR-017 P2)",
    description:
      "Bản tin 1 thư/tuần cho cohort opt-in marketing email. A/B subject 10–20%.",
    channel: "email",
  },
  {
    id: INACTIVE_REENGAGE_SCRIPT_ID,
    label: "Inactive — re-engage 1-shot (ADR-017 P3)",
    description:
      "Sau ~90 ngày không open/click: một thư xác nhận; không tương tác → suppress.",
    channel: "email",
  },
  {
    id: CCTM_UTILITY_EMAIL_SCRIPT_ID,
    label: "CCTM — Utility công cụ BĐS (ADR-017 P3)",
    description:
      "Cohort nhà thương mại / CTV quan tâm công cụ — value-first, 1 CTA /cong-cu.",
    channel: "email",
    segment: "CCTM",
  },
  {
    id: "warm-other-projects",
    label: "Ấm lead — dự án khác / chưa khớp",
    description:
      "Khách chưa quan tâm dự án hiện tại; nurture value-first checklist + mời xem option khác khi tiện.",
    channel: "zalo",
  },
  {
    id: "generic-welcome",
    label: "Chung — Chào mừng Ops",
    description: "Script mặc định khi chưa map được segment/source.",
    channel: "manual",
  },
  {
    id: TELESALES_MISS_CALLBACK_SCRIPT_ID,
    label: "Telesales — miss call (OA/SMS server)",
    description:
      "Sau không nghe máy: gửi OA CS hoặc SMS value-first qua server + ghi NurtureDispatch.",
    channel: "oa",
    sources: ["ops:telesales-server"],
  },
];

const catalogById = new Map(NURTURE_SCRIPT_CATALOG.map((s) => [s.id, s]));

export function getNurtureScript(id: string | null | undefined): NurtureScript | null {
  if (!id) return null;
  return catalogById.get(id) ?? null;
}

export function resolveNurtureScriptId(input: {
  segment: LeadSegment | null;
  source: string;
}): string {
  const { segment, source } = input;

  const scored = NURTURE_SCRIPT_CATALOG.filter((script) => {
    const sourceMatch =
      script.sources && script.sources.length > 0
        ? script.sources.includes(source)
        : script.id === "generic-welcome";
    const segmentMatch =
      script.segment === undefined || script.segment === null || script.segment === segment;
    return sourceMatch && segmentMatch;
  });

  const best = scored.sort((a, b) => {
    const score = (s: NurtureScript) => {
      let n = 0;
      if (s.sources?.includes(source)) n += 4;
      if (s.segment === segment) n += 2;
      if (s.id === "generic-welcome") n -= 10;
      // ADR-017 P0: email catalog sẵn nhưng auto-resolve vẫn ưu tiên OA/Zalo;
      // dispatcher Welcome email = P1 (enroll explicit theo script id).
      if (s.channel === "email") n -= 3;
      return n;
    };
    return score(b) - score(a);
  })[0];

  return best?.id ?? "generic-welcome";
}
