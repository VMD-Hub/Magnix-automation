import type { OpsToolCode, OpsToolGrantStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { maskPhone } from "@/lib/privacy/phone";
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

  if (zaloUserId) {
    const byZalo = await prisma.userAccount.findUnique({
      where: { zaloUserId },
      select: {
        id: true,
        name: true,
        phone: true,
        normalizedPhone: true,
        zaloUserId: true,
        role: true,
      },
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
      select: {
        id: true,
        name: true,
        phone: true,
        normalizedPhone: true,
        zaloUserId: true,
        role: true,
      },
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
    };
  },
) {
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

export async function grantOpsTool(input: {
  phone?: string | null;
  zaloUserId?: string | null;
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

  return serializeOpsToolGrant(row);
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
