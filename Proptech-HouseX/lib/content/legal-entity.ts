/**
 * Chủ thể pháp lý vận hành nền tảng House X — override qua env khi cần.
 * Dùng footer, Điều khoản, Zalo OA bio (minh bạch thương hiệu vs pháp nhân).
 */

const DEFAULT_LEGAL_ENTITY_VI = "Công ty TNHH Minh An Land";
const DEFAULT_LEGAL_ENTITY_EN = "Minh An Land Co., Ltd.";

export function getLegalEntityNameVi(): string {
  return process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim() || DEFAULT_LEGAL_ENTITY_VI;
}

export function getLegalEntityNameEn(): string {
  return (
    process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME_EN?.trim() || DEFAULT_LEGAL_ENTITY_EN
  );
}

/** Một câu disclosure — footer, OA bio cuối. */
export function getLegalEntityDisclosure(): { vi: string; en: string } {
  return {
    vi: `Nền tảng House X do ${getLegalEntityNameVi()} vận hành.`,
    en: `The House X platform is operated by ${getLegalEntityNameEn()}.`,
  };
}

/** Hai câu — Điều khoản mục Giới thiệu (static mirror; cập nhật khi đổi pháp nhân). */
export const LEGAL_ENTITY_TERMS_CLAUSE = {
  id: "1.3",
  vi: "House X là thương hiệu nền tảng Proptech (website, Mini App và các kênh liên quan). Chủ thể vận hành và chịu trách nhiệm pháp lý đối với dịch vụ là Công ty TNHH Minh An Land (“Chúng tôi” trong phạm vi nghĩa vụ pháp lý).",
  en: "House X is the Proptech platform brand (website, Mini App and related channels). The operating entity legally responsible for the services is Minh An Land Co., Ltd. (“we” for legal obligations).",
} as const;
