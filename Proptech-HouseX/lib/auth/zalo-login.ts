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
  const bypass =
    process.env.ZALO_AUTH_DEV_BYPASS === "true" &&
    process.env.NODE_ENV !== "production";

  if (bypass && input.zaloUserId) {
    return { zaloUserId: input.zaloUserId, displayName: input.name };
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
  let raw = input.phone;
  if (input.phoneToken) {
    const exchanged = await exchangeZaloPhoneToken(input.phoneToken);
    if (exchanged) raw = exchanged;
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
        await tx.broker.create({
          data: {
            userAccountId: created.id,
            fullName: name,
            phone: created.phone,
          },
        });
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
  return err instanceof ZaloAuthError;
}
