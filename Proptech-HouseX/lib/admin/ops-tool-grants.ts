import type { OpsToolCode, OpsToolGrantStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { maskPhone } from "@/lib/privacy/phone";
import { normalizeEmail } from "@/lib/email/normalize";
import { sendTelesalesInviteEmail } from "@/lib/email/auth-mailer";
import { TELESALES_TOOL } from "@/lib/admin/ops-telesales-access";

export class OpsToolGrantError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "OpsToolGrantError";
  }
}

/** Email Zalo placeholder — không gửi được mail thật. */
export function isPlaceholderHouseXEmail(email: string | null | undefined): boolean {
  if (!email) return true;
  return email.toLowerCase().endsWith("@users.housex.local");
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || !local) return "***";
  if (local.length <= 2) return `${local[0] ?? "*"}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

export async function resolveUserAccountForGrant(input: {
  phone?: string | null;
  zaloUserId?: string | null;
}) {
  const zaloUserId = input.zaloUserId?.trim() || null;
  const phoneRaw = input.phone?.trim() || null;

  if (!zaloUserId && !phoneRaw) {
    throw new OpsToolGrantError(
      "VALIDATION",
      "Cần SĐT hoặc Zalo user id.",
    );
  }

  const select = {
    id: true,
    name: true,
    phone: true,
    normalizedPhone: true,
    zaloUserId: true,
    role: true,
    email: true,
    emailVerified: true,
  } as const;

  if (zaloUserId) {
    const byZalo = await prisma.userAccount.findUnique({
      where: { zaloUserId },
      select,
    });
    if (byZalo) return byZalo;
  }

  if (phoneRaw) {
    const normalizedPhone = normalizeVnPhone(phoneRaw);
    if (!isValidVnPhone(normalizedPhone)) {
      throw new OpsToolGrantError("INVALID_PHONE", "SĐT Việt Nam không hợp lệ.");
    }
    const byPhone = await prisma.userAccount.findUnique({
      where: { normalizedPhone },
      select,
    });
    if (byPhone) return byPhone;
  }

  throw new OpsToolGrantError(
    "USER_NOT_FOUND",
    "Không tìm thấy UserAccount. Người dùng cần mở Mini App (Zalo) hoặc đăng ký SĐT trên House X trước.",
  );
}

export function serializeOpsToolGrant(
  row: {
    id: string;
    tool: OpsToolCode;
    status: OpsToolGrantStatus;
    grantedBy: string;
    note: string | null;
    grantedAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userAccount: {
      id: string;
      name: string;
      phone: string;
      zaloUserId: string | null;
      role: string;
      email: string;
      emailVerified: boolean;
    };
  },
) {
  const placeholder = isPlaceholderHouseXEmail(row.userAccount.email);
  return {
    id: row.id,
    tool: row.tool,
    status: row.status,
    grantedBy: row.grantedBy,
    note: row.note,
    grantedAt: row.grantedAt.toISOString(),
    revokedAt: row.revokedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    user: {
      id: row.userAccount.id,
      name: row.userAccount.name,
      phoneMasked: maskPhone(row.userAccount.phone),
      zaloUserId: row.userAccount.zaloUserId,
      role: row.userAccount.role,
      emailMasked: placeholder ? null : maskEmail(row.userAccount.email),
      emailVerified: row.userAccount.emailVerified,
      needsInviteEmail: placeholder,
    },
  };
}

const grantInclude = {
  userAccount: {
    select: {
      id: true,
      name: true,
      phone: true,
      zaloUserId: true,
      role: true,
      email: true,
      emailVerified: true,
    },
  },
} satisfies Prisma.OpsToolGrantInclude;

export async function listOpsToolGrants(input?: {
  tool?: OpsToolCode;
  status?: OpsToolGrantStatus | "ALL";
}) {
  const tool = input?.tool ?? TELESALES_TOOL;
  const status = input?.status ?? "ACTIVE";
  const where: Prisma.OpsToolGrantWhereInput = {
    tool,
    ...(status === "ALL" ? {} : { status }),
  };
  const rows = await prisma.opsToolGrant.findMany({
    where,
    include: grantInclude,
    orderBy: { grantedAt: "desc" },
    take: 200,
  });
  return rows.map(serializeOpsToolGrant);
}

/**
 * Gắn email công việc (nếu cần) + gửi mail đặt mật khẩu 72h.
 */
export async function attachInviteEmailAndSend(input: {
  userAccountId: string;
  inviteEmail: string;
}): Promise<{
  emailMasked: string;
  sent: boolean;
  emailUpdated: boolean;
}> {
  const email = normalizeEmail(input.inviteEmail);
  if (!email.includes("@") || isPlaceholderHouseXEmail(email)) {
    throw new OpsToolGrantError(
      "INVALID_EMAIL",
      "Cần email công việc thật (không dùng email Zalo placeholder).",
    );
  }

  const account = await prisma.userAccount.findUnique({
    where: { id: input.userAccountId },
    select: { id: true, name: true, email: true },
  });
  if (!account) {
    throw new OpsToolGrantError("USER_NOT_FOUND", "Không tìm thấy tài khoản.");
  }

  let emailUpdated = false;
  const currentIsPlaceholder = isPlaceholderHouseXEmail(account.email);

  if (account.email !== email) {
    const taken = await prisma.userAccount.findUnique({
      where: { email },
      select: { id: true },
    });
    if (taken && taken.id !== account.id) {
      throw new OpsToolGrantError(
        "EMAIL_IN_USE",
        "Email này đã gắn tài khoản khác. Dùng email khác hoặc thu hồi/merge thủ công.",
      );
    }
    if (!currentIsPlaceholder && account.email !== email) {
      // Cho phép Super đổi email khi mời telesales (ghi đè email cũ chưa verify / placeholder)
    }
    await prisma.userAccount.update({
      where: { id: account.id },
      data: {
        email,
        emailVerified: false,
        emailVerifiedAt: null,
      },
    });
    emailUpdated = true;
  }

  let sent = false;
  try {
    const result = await sendTelesalesInviteEmail(account.id, account.name, email);
    sent = result.sent;
  } catch (err) {
    console.error(
      "[ops-tool-grants] invite email failed:",
      err instanceof Error ? err.message : err,
    );
    throw new OpsToolGrantError(
      "EMAIL_SEND_FAILED",
      "Cấp quyền xong nhưng gửi email thất bại. Kiểm tra cấu hình mail rồi bấm Gửi lại lời mời.",
    );
  }

  if (!sent) {
    throw new OpsToolGrantError(
      "EMAIL_SEND_FAILED",
      "Cấp quyền xong nhưng gửi email thất bại. Kiểm tra cấu hình mail rồi bấm Gửi lại lời mời.",
    );
  }

  return { emailMasked: maskEmail(email), sent, emailUpdated };
}

export async function grantOpsTool(input: {
  phone?: string | null;
  zaloUserId?: string | null;
  inviteEmail: string;
  note?: string | null;
  grantedBy: string;
  tool?: OpsToolCode;
}) {
  const tool = input.tool ?? TELESALES_TOOL;
  const account = await resolveUserAccountForGrant(input);
  const now = new Date();

  const row = await prisma.opsToolGrant.upsert({
    where: {
      userAccountId_tool: { userAccountId: account.id, tool },
    },
    create: {
      userAccountId: account.id,
      tool,
      status: "ACTIVE",
      grantedBy: input.grantedBy,
      note: input.note ?? null,
      grantedAt: now,
      revokedAt: null,
    },
    update: {
      status: "ACTIVE",
      grantedBy: input.grantedBy,
      note: input.note ?? null,
      grantedAt: now,
      revokedAt: null,
    },
    include: grantInclude,
  });

  const invite = await attachInviteEmailAndSend({
    userAccountId: account.id,
    inviteEmail: input.inviteEmail,
  });

  // Reload email fields after update
  const refreshed = await prisma.opsToolGrant.findUniqueOrThrow({
    where: { id: row.id },
    include: grantInclude,
  });

  return {
    grant: serializeOpsToolGrant(refreshed),
    invite,
  };
}

export async function resendOpsToolInvite(input: {
  grantId: string;
  inviteEmail?: string | null;
}) {
  const existing = await prisma.opsToolGrant.findUnique({
    where: { id: input.grantId },
    include: grantInclude,
  });
  if (!existing) {
    throw new OpsToolGrantError("NOT_FOUND", "Không tìm thấy grant.");
  }
  if (existing.status !== "ACTIVE") {
    throw new OpsToolGrantError(
      "NOT_ACTIVE",
      "Chỉ gửi lại lời mời khi grant đang ACTIVE.",
    );
  }

  const email =
    input.inviteEmail?.trim() ||
    (isPlaceholderHouseXEmail(existing.userAccount.email)
      ? null
      : existing.userAccount.email);

  if (!email) {
    throw new OpsToolGrantError(
      "INVALID_EMAIL",
      "Tài khoản chưa có email thật — nhập email công việc để gửi lại.",
    );
  }

  const invite = await attachInviteEmailAndSend({
    userAccountId: existing.userAccountId,
    inviteEmail: email,
  });

  const refreshed = await prisma.opsToolGrant.findUniqueOrThrow({
    where: { id: existing.id },
    include: grantInclude,
  });

  return { grant: serializeOpsToolGrant(refreshed), invite };
}

export async function revokeOpsToolGrant(input: {
  id: string;
  revokedBy: string;
}) {
  const existing = await prisma.opsToolGrant.findUnique({
    where: { id: input.id },
    include: grantInclude,
  });
  if (!existing) {
    throw new OpsToolGrantError("NOT_FOUND", "Không tìm thấy grant.");
  }
  if (existing.status === "REVOKED") {
    return serializeOpsToolGrant(existing);
  }

  const row = await prisma.opsToolGrant.update({
    where: { id: input.id },
    data: {
      status: "REVOKED",
      revokedAt: new Date(),
      grantedBy: existing.grantedBy,
      note: existing.note
        ? `${existing.note}\n[revoked by ${input.revokedBy}]`
        : `revoked by ${input.revokedBy}`,
    },
    include: grantInclude,
  });
  return serializeOpsToolGrant(row);
}
