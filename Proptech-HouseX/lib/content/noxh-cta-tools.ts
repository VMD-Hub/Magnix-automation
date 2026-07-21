/**
 * CTA chuẩn NƠXH — mọi content publish phải đổ vào đúng 1 tool.
 * Super L3 không duyệt nếu thiếu cta_tool_id trong allowlist này.
 */

export const NOXH_CTA_TOOL_IDS = ["noxh-check", "noxh-loan-quick"] as const;

export type NoxhCtaToolId = (typeof NOXH_CTA_TOOL_IDS)[number];

export type NoxhCtaTool = {
  id: NoxhCtaToolId;
  /** Khớp ALL_TOOLS.id trong housex-tools-registry. */
  registryId: string;
  href: string;
  title: string;
  /** Khi dùng CTA này. */
  when: string;
  /** Câu CTA gợi ý trên bài. */
  defaultCtaLabel: string;
  /** Khối chốt cuối bài (copy-paste). */
  closingBlock: string;
};

export const NOXH_CTA_TOOLS: readonly NoxhCtaTool[] = [
  {
    id: "noxh-check",
    registryId: "noxh-check",
    href: "/cong-cu/dieu-kien-noxh",
    title: "Kiểm tra điều kiện NOXH",
    when: "Bài điều kiện, hồ sơ, đối tượng, thu nhập, quy trình xét duyệt",
    defaultCtaLabel: "Kiểm tra miễn phí bạn có đủ điều kiện NƠXH không",
    closingBlock:
      "Bạn đang phân vân mình có đủ điều kiện NƠXH không?\n→ Kiểm tra nhanh (miễn phí): /cong-cu/dieu-kien-noxh\nKhông cần để lại SĐT trước khi xem kết quả gợi ý.",
  },
  {
    id: "noxh-loan-quick",
    registryId: "noxh-loan-quick",
    href: "/cong-cu/kiem-tra-vay-noxh",
    title: "Kiểm tra vay NOXH 60 giây",
    when: "Bài vay, lãi, trả góp, chứng minh thu nhập, hạn mức",
    defaultCtaLabel: "Kiểm tra nhanh khả năng vay NƠXH (60 giây)",
    closingBlock:
      "Bạn đang phân vân vay NƠXH được khoảng bao nhiêu?\n→ Kiểm tra nhanh (miễn phí): /cong-cu/kiem-tra-vay-noxh\nKhông cần để lại SĐT trước khi xem kết quả gợi ý.",
  },
] as const;

export function isNoxhCtaToolId(value: string | null | undefined): value is NoxhCtaToolId {
  return NOXH_CTA_TOOL_IDS.includes(value as NoxhCtaToolId);
}

export function getNoxhCtaTool(id: string | null | undefined): NoxhCtaTool | null {
  if (!id) return null;
  return NOXH_CTA_TOOLS.find((t) => t.id === id) ?? null;
}

export type L3ContentChecklist = {
  /** Có nỗi đau NƠXH rõ (1 câu). */
  pain: boolean;
  /** Đã chọn đúng 1 tool CTA trong allowlist. */
  ctaTool: boolean;
  /** Có câu CTA hành động trên bài. */
  ctaCopy: boolean;
};

export const EMPTY_L3_CHECKLIST: L3ContentChecklist = {
  pain: false,
  ctaTool: false,
  ctaCopy: false,
};

export const L3_CHECKLIST_LABELS: Record<keyof L3ContentChecklist, string> = {
  pain: "Nỗi đau NƠXH nào? (1 câu)",
  ctaTool: "Link tool nào? (điều kiện NƠXH hoặc vay NƠXH)",
  ctaCopy: "Câu CTA trên bài là gì? (1 dòng, rõ hành động)",
};

export function parseL3Checklist(raw: unknown): L3ContentChecklist {
  if (!raw || typeof raw !== "object") return { ...EMPTY_L3_CHECKLIST };
  const o = raw as Record<string, unknown>;
  return {
    pain: o.pain === true,
    ctaTool: o.ctaTool === true,
    ctaCopy: o.ctaCopy === true,
  };
}

export function isL3ChecklistComplete(c: L3ContentChecklist): boolean {
  return c.pain && c.ctaTool && c.ctaCopy;
}
