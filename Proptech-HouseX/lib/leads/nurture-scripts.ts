import type { LeadSegment } from "@prisma/client";
import { LEAD_SOURCE } from "@/lib/leads/source";

export type NurtureScriptChannel = "oa" | "telegram" | "zalo" | "manual";

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
    id: "generic-welcome",
    label: "Chung — Chào mừng Ops",
    description: "Script mặc định khi chưa map được segment/source.",
    channel: "manual",
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
      !script.sources || script.sources.length === 0 || script.sources.includes(source);
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
      return n;
    };
    return score(b) - score(a);
  })[0];

  return best?.id ?? "generic-welcome";
}
