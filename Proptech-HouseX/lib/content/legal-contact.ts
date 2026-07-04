/**
 * Liên hệ pháp lý / biên tập — override qua env khi có hộp thư riêng.
 */

import {
  getSupportEmail,
  getSupportPhoneDisplay,
} from "@/lib/site-config";

export const TERMS_LEGAL_ADDRESS =
  "37 Đường số 12, Bình Trưng, TP. Hồ Chí Minh" as const;

export function getLegalContactEmail(): string {
  return process.env.NEXT_PUBLIC_LEGAL_EMAIL?.trim() || getSupportEmail();
}

export function getEditorialContactEmail(): string {
  return process.env.NEXT_PUBLIC_EDITORIAL_EMAIL?.trim() || getSupportEmail();
}

export function getTermsContactBlock(): {
  email: string;
  editorialEmail: string;
  address: string;
  phone: string;
} {
  return {
    email: getLegalContactEmail(),
    editorialEmail: getEditorialContactEmail(),
    address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() || TERMS_LEGAL_ADDRESS,
    phone: getSupportPhoneDisplay(),
  };
}
