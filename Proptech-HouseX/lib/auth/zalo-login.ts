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

async function resolvePhone(input: ZaloAuthInput): Promise<string> {
  let raw = input.phone?.trim();
  if (input.phoneToken && input.accessToken) {
    const exchanged = await exchangeZaloPhoneToken(
      input.phoneToken,
      input.accessToken,
    );
    if (exchanged) raw = exchanged;
  }
  if (!raw) {
    throw new ZaloAuthError(
      "INVALID_PHONE",
      "Không lấy được số điện thoại. Cho phép chia sẻ SĐT trong Zalo, hoặc nhập SĐT rồi thử lại.",
    );
  }
  const normalized = normalizeVnPhone(raw);
  if (!isValidVnPhone(normalized)) {
    throw new ZaloAuthError("INVALID_PHONE", "Số điện thoại không hợp lệ.");
  }
  return normalized;
}

export async function loginOrRegisterWithZalo(input: ZaloAuthInput) {
  const { zaloUserId, displayName } = await resolveZaloUserId(input);
  const normalizedPhone = await resolvePhone(input);
  const role: AccountRole = input.preferredRole ?? "CUSTOMER";
  const name = (displayName ?? input.name ?? "Người dùng House X").trim();

  let account = await prisma.userAccount.findUnique({
    where: { zaloUserId },
  });

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
      account = await prisma.userAccount.update({
        where: { id: byPhone.id },
        data: {
          zaloUserId,
          ...(displayName && !byPhone.name ? { name: displayName } : {}),
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
          phone: normalizedPhone.replace(/^\+84/, "0"),
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
        const suffix = zaloUserId.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase();
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
