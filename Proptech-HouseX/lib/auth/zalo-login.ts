import { randomBytes } from "crypto";
import type { AccountRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import {
  exchangeZaloPhoneToken,
  fetchZaloMe,
  ZaloAuthError,
} from "@/lib/zalo/graph";
import type { ZaloAuthInput } from "@/lib/validation/zalo-auth";
import { createSessionToken } from "@/lib/auth/session-token";
import { loadSessionProfile } from "@/lib/auth/session-profile";

function placeholderEmail(zaloUserId: string): string {
  const safe = zaloUserId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
  return `zalo_${safe}@users.housex.local`;
}

function unusablePasswordHash(): string {
  return hashPassword(`zalo-only:${randomBytes(32).toString("hex")}`);
}

function toDisplayPhone(normalized: string): string {
  return normalized.replace(/^\+84/, "0");
}

async function resolveZaloUserId(input: ZaloAuthInput): Promise<{
  zaloUserId: string;
  displayName?: string;
}> {
  const bypassWanted = process.env.ZALO_AUTH_DEV_BYPASS === "true";
  const isProd = process.env.NODE_ENV === "production";

  // Dev/simulator only — không chặn accessToken thật nếu ai đó quên tắt bypass trên VPS.
  if (bypassWanted && !isProd && input.zaloUserId) {
    return { zaloUserId: input.zaloUserId, displayName: input.name };
  }

  if (bypassWanted && isProd && input.zaloUserId && !input.accessToken) {
    throw new ZaloAuthError(
      "ZALO_BYPASS_FORBIDDEN",
      "Production không cho đăng nhập giả. Trên VPS đặt ZALO_AUTH_DEV_BYPASS=false rồi pm2 restart.",
    );
  }

  if (!input.accessToken) {
    throw new ZaloAuthError(
      "ZALO_TOKEN_REQUIRED",
      "Thiếu accessToken Zalo.",
    );
  }

  const me = await fetchZaloMe(input.accessToken);
  return { zaloUserId: me.id, displayName: me.name ?? input.name };
}

type ResolvedPhone = {
  normalized: string;
  /** true = đổi từ phoneToken Zalo (đã xác minh sở hữu). */
  verified: boolean;
};

/**
 * SĐT Zalo (phoneToken) luôn ưu tiên hơn số nhập tay.
 * Môi giới (BROKER): bắt buộc SĐT xác minh từ Zalo (trừ dev bypass).
 */
async function resolvePhone(
  input: ZaloAuthInput,
  role: AccountRole,
): Promise<ResolvedPhone> {
  const bypass =
    process.env.ZALO_AUTH_DEV_BYPASS === "true" &&
    process.env.NODE_ENV !== "production";

  let verifiedRaw: string | null = null;
  if (input.phoneToken && input.accessToken) {
    verifiedRaw = await exchangeZaloPhoneToken(
      input.phoneToken,
      input.accessToken,
    );
  }

  const manualRaw = input.phone?.trim() || null;

  if (verifiedRaw) {
    const normalized = normalizeVnPhone(verifiedRaw);
    if (!isValidVnPhone(normalized)) {
      throw new ZaloAuthError("INVALID_PHONE", "Số điện thoại Zalo không hợp lệ.");
    }
    return { normalized, verified: true };
  }

  // Có phoneToken nhưng exchange thất bại (thường thiếu secret / quyền App).
  // Không lộ tên biến env cho người dùng cuối.
  if (input.phoneToken && !verifiedRaw) {
    if (role === "BROKER" && !bypass) {
      throw new ZaloAuthError(
        "ZALO_PHONE_REQUIRED",
        "Chưa lấy được số điện thoại từ Zalo. Cho phép chia sẻ SĐT rồi thử lại. Nếu vẫn lỗi, liên hệ House X để cấu hình máy chủ.",
      );
    }
    if (!manualRaw) {
      throw new ZaloAuthError(
        "INVALID_PHONE",
        "Zalo đã kết nối. Vui lòng nhập số điện thoại liên hệ để hoàn tất đăng nhập.",
      );
    }
  }

  if (role === "BROKER" && !bypass) {
    throw new ZaloAuthError(
      "ZALO_PHONE_REQUIRED",
      "Môi giới cần cho phép chia sẻ số điện thoại đang dùng Zalo rồi thử lại.",
    );
  }

  if (!manualRaw) {
    throw new ZaloAuthError(
      "INVALID_PHONE",
      "Nhập số điện thoại liên hệ để hoàn tất đăng nhập.",
    );
  }

  const normalized = normalizeVnPhone(manualRaw);
  if (!isValidVnPhone(normalized)) {
    throw new ZaloAuthError("INVALID_PHONE", "Số điện thoại không hợp lệ.");
  }
  return { normalized, verified: false };
}

export async function loginOrRegisterWithZalo(input: ZaloAuthInput) {
  const { zaloUserId, displayName } = await resolveZaloUserId(input);
  const role: AccountRole = input.preferredRole ?? "CUSTOMER";
  const { normalized: normalizedPhone, verified: phoneVerified } =
    await resolvePhone(input, role);
  const name = (displayName ?? input.name ?? "Người dùng House X").trim();
  const displayPhone = toDisplayPhone(normalizedPhone);

  let account = await prisma.userAccount.findUnique({
    where: { zaloUserId },
  });

  // Đã có tài khoản theo Zalo → danh tính = Zalo. Chỉ cập nhật SĐT khi đã xác minh từ Zalo.
  if (account) {
    if (phoneVerified && account.normalizedPhone !== normalizedPhone) {
      const conflict = await prisma.userAccount.findUnique({
        where: { normalizedPhone },
      });
      if (conflict && conflict.id !== account.id) {
        throw new ZaloAuthError(
          "PHONE_LINKED_OTHER_ZALO",
          "Số điện thoại Zalo đã gắn tài khoản House X khác.",
        );
      }
      account = await prisma.userAccount.update({
        where: { id: account.id },
        data: {
          phone: displayPhone,
          normalizedPhone,
          ...(displayName && !account.name ? { name: displayName } : {}),
        },
      });
      if (account.role === "CUSTOMER") {
        await prisma.customer.updateMany({
          where: { userAccountId: account.id },
          data: { phone: displayPhone, normalizedPhone },
        });
      } else if (account.role === "BROKER") {
        await prisma.broker.updateMany({
          where: { userAccountId: account.id },
          data: { phone: displayPhone },
        });
      }
    } else if (displayName && !account.name) {
      account = await prisma.userAccount.update({
        where: { id: account.id },
        data: { name: displayName },
      });
    }
  }

  // Chưa có theo Zalo: chỉ được gắn vào tài khoản sẵn có nếu SĐT đã xác minh (chống phone-claim).
  if (!account) {
    const byPhone = await prisma.userAccount.findUnique({
      where: { normalizedPhone },
    });
    if (byPhone) {
      if (byPhone.zaloUserId && byPhone.zaloUserId !== zaloUserId) {
        throw new ZaloAuthError(
          "PHONE_LINKED_OTHER_ZALO",
          "Số điện thoại đã gắn tài khoản Zalo khác.",
        );
      }
      if (!phoneVerified && !byPhone.zaloUserId) {
        throw new ZaloAuthError(
          "PHONE_CLAIM_REQUIRES_VERIFY",
          "Số này đã có trên House X (đăng ký web). Cho phép chia sẻ SĐT Zalo để liên kết an toàn, hoặc đăng nhập trên web.",
        );
      }
      account = await prisma.userAccount.update({
        where: { id: byPhone.id },
        data: {
          zaloUserId,
          ...(displayName && !byPhone.name ? { name: displayName } : {}),
          ...(phoneVerified
            ? { phone: displayPhone, normalizedPhone }
            : {}),
        },
      });
    }
  }

  if (!account) {
    account = await prisma.$transaction(async (tx) => {
      const created = await tx.userAccount.create({
        data: {
          role,
          name,
          phone: displayPhone,
          normalizedPhone,
          email: placeholderEmail(zaloUserId),
          emailVerified: false,
          marketingOptIn: true,
          passwordHash: unusablePasswordHash(),
          zaloUserId,
        },
      });

      if (role === "CUSTOMER") {
        await tx.customer.create({
          data: {
            userAccountId: created.id,
            name,
            phone: created.phone,
            normalizedPhone,
            email: created.email,
          },
        });
      } else {
        // Dev Mini App Agent: BROKER mới qua bypass → CTV để test claim.
        const bypass =
          process.env.ZALO_AUTH_DEV_BYPASS === "true" &&
          process.env.NODE_ENV !== "production";
        const suffix = zaloUserId
          .replace(/[^a-zA-Z0-9]/g, "")
          .slice(-6)
          .toUpperCase();
        await tx.broker.create({
          data: {
            userAccountId: created.id,
            fullName: name,
            phone: created.phone,
            ...(bypass
              ? {
                  brokerType: "CTV" as const,
                  ctvCode: `DEV${suffix || "000000"}`,
                }
              : {}),
          },
        });
        if (bypass) {
          const { ensureBrokerEntitlements } = await import(
            "@/lib/data/agent-services"
          );
          const broker = await tx.broker.findUniqueOrThrow({
            where: { userAccountId: created.id },
            select: { id: true },
          });
          await ensureBrokerEntitlements(broker.id, tx);
        }
      }

      return created;
    });
  }

  const profile = await loadSessionProfile({ id: account.id });
  if (!profile) {
    throw new ZaloAuthError("ACCOUNT_LOAD_FAILED", "Không tải được hồ sơ.");
  }

  const token = createSessionToken(account.id);
  return { token, user: profile };
}

export function isZaloAuthError(err: unknown): err is ZaloAuthError {
  if (err instanceof ZaloAuthError) return true;
  // Next/webpack đôi khi làm instanceof fail giữa bundle — duck-type.
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: string }).name === "ZaloAuthError" &&
    typeof (err as { code?: string }).code === "string" &&
    typeof (err as { message?: string }).message === "string"
  );
}
