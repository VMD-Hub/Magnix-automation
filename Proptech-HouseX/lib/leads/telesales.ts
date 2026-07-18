/**
 * CRM telesales Phase 1 — deep-link + activity log + call cooldown.
 * Phase 2 server send: lib/messaging/telesales-server-send.ts (không scrape Zalo).
 */

export const CALL_COOLDOWN_HOURS = 4;
export const CALLBACK_SLA_HOURS = 4;

/** Kết quả chip sau khi gọi / follow-up. */
export const TELESALES_RESULTS = [
  "CONNECTED",
  "SEND_INFO",
  "NO_ANSWER",
  "WRONG_NUMBER",
  "HARD_REJECT",
  "NOT_THIS_PROJECT",
  "SMS_SENT",
  "ZALO_OPENED",
] as const;

export type TelesalesResult = (typeof TELESALES_RESULTS)[number];

export const TELESALES_RESULT_LABEL: Record<TelesalesResult, string> = {
  CONNECTED: "Đàm thoại OK",
  SEND_INFO: "Xin gửi thông tin / kết bạn Zalo",
  NO_ANSWER: "Không nghe / bận",
  WRONG_NUMBER: "Sai số",
  HARD_REJECT: "Từ chối cứng",
  NOT_THIS_PROJECT: "Không quan tâm dự án này",
  SMS_SENT: "Đã mở SMS chào",
  ZALO_OPENED: "Đã mở Zalo",
};

export const WARM_OTHER_PROJECTS_SCRIPT_ID = "warm-other-projects";

export function digitsForDeepLink(phone: string): string {
  const n = phone.replace(/[^\d+]/g, "");
  if (n.startsWith("+84")) return `0${n.slice(3)}`;
  if (n.startsWith("84") && n.length >= 11) return `0${n.slice(2)}`;
  return n.replace(/^\+/, "");
}

/** E.164 or local → tel: URI */
export function telDeepLink(phone: string): string {
  const d = digitsForDeepLink(phone);
  return `tel:${d}`;
}

export function smsDeepLink(phone: string, body?: string): string {
  const d = digitsForDeepLink(phone);
  const text = body
    ? encodeURIComponent(body)
    : encodeURIComponent(
        "Chao anh/chi, em House X. Em vua goi nhung chua lien lac duoc. Anh/chi tien nghe dien thi cho em xin 2 phut, hoac quan tam OA House X de nhan checklist NOXH/du an nhe.",
      );
  return `sms:${d}?body=${text}`;
}

/**
 * Phase 1: copy/open Zalo — không có URL profile ổn định theo SĐT trên mọi thiết bị.
 * Trả về zalo:// hoặc https search hint + số để Ops paste.
 */
export function zaloOpenHint(phone: string): {
  copyPhone: string;
  hint: string;
} {
  const d = digitsForDeepLink(phone);
  return {
    copyPhone: d,
    hint: "Mở Zalo → tìm bằng SĐT đã copy → xem avatar/tên trước khi gọi.",
  };
}

export function mapResultToActivity(result: TelesalesResult): {
  type: "CONNECTED" | "CONTACT_ATTEMPT" | "NOTE" | "TASK";
  channel: string;
  createCallbackTask: boolean;
  assignWarmScript: boolean;
  suggestLeadStatus?: "CONTACTED" | "QUALIFIED" | "LOST";
} {
  switch (result) {
    case "CONNECTED":
      return {
        type: "CONNECTED",
        channel: "phone",
        createCallbackTask: false,
        assignWarmScript: false,
        suggestLeadStatus: "QUALIFIED",
      };
    case "SEND_INFO":
      return {
        type: "CONNECTED",
        channel: "phone",
        createCallbackTask: true,
        assignWarmScript: false,
        suggestLeadStatus: "CONTACTED",
      };
    case "NO_ANSWER":
      return {
        type: "CONTACT_ATTEMPT",
        channel: "phone",
        createCallbackTask: true,
        assignWarmScript: false,
        suggestLeadStatus: "CONTACTED",
      };
    case "WRONG_NUMBER":
    case "HARD_REJECT":
      return {
        type: "CONTACT_ATTEMPT",
        channel: "phone",
        createCallbackTask: false,
        assignWarmScript: false,
        suggestLeadStatus: "LOST",
      };
    case "NOT_THIS_PROJECT":
      return {
        type: "CONNECTED",
        channel: "phone",
        createCallbackTask: false,
        assignWarmScript: true,
        suggestLeadStatus: "CONTACTED",
      };
    case "SMS_SENT":
      return {
        type: "CONTACT_ATTEMPT",
        channel: "sms",
        createCallbackTask: false,
        assignWarmScript: false,
      };
    case "ZALO_OPENED":
      return {
        type: "CONTACT_ATTEMPT",
        channel: "zalo",
        createCallbackTask: false,
        assignWarmScript: false,
      };
  }
}

export function callBlockedUntil(
  lastPhoneAttemptAt: Date | null,
  lastPhoneReason: string | null,
  now = new Date(),
): Date | null {
  if (!lastPhoneAttemptAt) return null;
  if (lastPhoneReason !== "NO_ANSWER") return null;
  const until = new Date(
    lastPhoneAttemptAt.getTime() + CALL_COOLDOWN_HOURS * 3_600_000,
  );
  return until > now ? until : null;
}
