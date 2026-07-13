/**
 * Deep link form liên hệ — map ?goi=… sang vertical, need và copy form.
 */

export type ContactFormIntent = {
  vertical: string;
  need: string;
  sectionTitle: string;
  sectionLead: string;
  defaultMessage: string;
};

export const CONTACT_FORM_INTENTS = {
  "ra-soat-phap-ly-15-phut": {
    vertical: "tai-chinh",
    need: "ra-soat-phap-ly-15-phut",
    sectionTitle: "Đặt lịch rà soát 15 phút miễn phí",
    sectionLead:
      "Dành cho người đang cân nhắm mua NOXH hoặc BĐS — tập trung rủi ro sổ hồng, hợp đồng và dòng tiền.",
    defaultMessage:
      "Tôi muốn đặt lịch rà soát pháp lý & tài chính 15 phút (miễn phí) trước khi quyết định xuống tiền.",
  },
} as const satisfies Record<string, ContactFormIntent>;

export type ContactFormIntentKey = keyof typeof CONTACT_FORM_INTENTS;

export function resolveContactFormIntent(
  goi?: string | null,
): ContactFormIntent | null {
  if (!goi) return null;
  return (
    (CONTACT_FORM_INTENTS as Record<string, ContactFormIntent>)[goi] ?? null
  );
}

export function getContactFormIntentHref(intent: ContactFormIntentKey): string {
  return `/lien-he?goi=${intent}#tu-van`;
}
