import type { AccountRole } from "@prisma/client";

export type ContactRevealDenyCode =
  | "AUTH_REQUIRED"
  | "EMAIL_NOT_VERIFIED"
  | "CUSTOMER_ONLY";

export type ContactRevealGate =
  | { ok: true }
  | { ok: false; code: ContactRevealDenyCode; message: string };

const MESSAGES: Record<ContactRevealDenyCode, string> = {
  AUTH_REQUIRED: "Vui lòng đăng nhập để xem số điện thoại.",
  EMAIL_NOT_VERIFIED:
    "Vui lòng xác nhận email trước khi xem số điện thoại môi giới.",
  CUSTOMER_ONLY:
    "Chỉ tài khoản khách hàng mới xem được số liên hệ. Vui lòng đăng nhập bằng tài khoản khách.",
};

/** Gate xem SĐT môi giới: đăng nhập + role CUSTOMER + email đã xác nhận. */
export function assertContactRevealAllowed(
  account: { role: AccountRole; emailVerified: boolean } | null | undefined,
): ContactRevealGate {
  if (!account) {
    return { ok: false, code: "AUTH_REQUIRED", message: MESSAGES.AUTH_REQUIRED };
  }
  if (account.role !== "CUSTOMER") {
    return { ok: false, code: "CUSTOMER_ONLY", message: MESSAGES.CUSTOMER_ONLY };
  }
  if (!account.emailVerified) {
    return {
      ok: false,
      code: "EMAIL_NOT_VERIFIED",
      message: MESSAGES.EMAIL_NOT_VERIFIED,
    };
  }
  return { ok: true };
}
