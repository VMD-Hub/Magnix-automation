/**
 * Hướng dẫn khôi phục khi đăng ký trùng SĐT/email — không lộ PII.
 */

export type RegisterConflictKind = "PHONE_REGISTERED" | "EMAIL_REGISTERED";

export type RegisterConflictDetails = {
  kind: RegisterConflictKind;
  /** Đã từng gắn Zalo Mini App. */
  hasZalo: boolean;
  /** Đã đặt MK dùng được trên web. */
  passwordReady: boolean;
  roleLabel: "khách hàng" | "môi giới";
  actions: Array<"login" | "forgot_password" | "miniapp">;
};

export function buildRegisterConflict(input: {
  kind: RegisterConflictKind;
  role: string;
  hasZalo: boolean;
  passwordReady: boolean;
}): { message: string; details: RegisterConflictDetails } {
  const roleLabel: "khách hàng" | "môi giới" =
    input.role === "BROKER" ? "môi giới" : "khách hàng";
  const actions: RegisterConflictDetails["actions"] = ["login"];
  if (input.passwordReady) actions.push("forgot_password");
  if (input.hasZalo || !input.passwordReady) actions.push("miniapp");

  const details: RegisterConflictDetails = {
    kind: input.kind,
    hasZalo: input.hasZalo,
    passwordReady: input.passwordReady,
    roleLabel,
    actions,
  };

  if (input.kind === "PHONE_REGISTERED") {
    if (input.hasZalo && !input.passwordReady) {
      return {
        message: `Số điện thoại này đã có tài khoản ${roleLabel} trên House X (thường từ Mini App Zalo). Không cần đăng ký lại — đăng nhập hoặc mở Mini App để đặt mật khẩu web.`,
        details,
      };
    }
    return {
      message: `Số điện thoại này đã đăng ký tài khoản ${roleLabel}. Đăng nhập bằng SĐT + mật khẩu, hoặc dùng Quên mật khẩu nếu còn quản lý email.`,
      details,
    };
  }

  return {
    message:
      "Email này đã gắn tài khoản House X. Đăng nhập hoặc Quên mật khẩu (OTP gửi vào email này) nếu bạn vẫn quản lý hộp thư.",
    details,
  };
}
