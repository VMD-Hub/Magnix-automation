import type { AccountRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "@/lib/auth/session";
import { maskPhone } from "@/lib/privacy/phone";

export type SessionProfile = {
  id: string;
  role: AccountRole;
  name: string;
  phoneMasked: string;
  email: string;
  emailVerified: boolean;
  marketingOptIn: boolean;
  customerId?: string;
  brokerId?: string;
  brokerType?: string;
  ctvCode?: string | null;
  ctvApplicationStatus?: string | null;
  opsTools?: { telesales: boolean };
};

export async function loadSessionProfile(
  session: SessionUser,
): Promise<SessionProfile | null> {
  const account = await prisma.userAccount.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      role: true,
      name: true,
      phone: true,
      email: true,
      emailVerified: true,
      marketingOptIn: true,
      customer: { select: { id: true } },
      broker: {
        select: {
          id: true,
          brokerType: true,
          ctvCode: true,
          ctvApplication: { select: { status: true } },
        },
      },
    },
  });

  if (!account) return null;

  const telesalesGrant = await prisma.opsToolGrant.findUnique({
    where: {
      userAccountId_tool: {
        userAccountId: account.id,
        tool: "TELESALES_CRM",
      },
    },
    select: { status: true },
  });

  return {
    id: account.id,
    role: account.role,
    name: account.name,
    phoneMasked: maskPhone(account.phone),
    email: account.email,
    emailVerified: account.emailVerified,
    marketingOptIn: account.marketingOptIn,
    customerId: account.customer?.id,
    brokerId: account.broker?.id,
    brokerType: account.broker?.brokerType,
    ctvCode: account.broker?.ctvCode,
    ctvApplicationStatus: account.broker?.ctvApplication?.status ?? null,
    opsTools: { telesales: telesalesGrant?.status === "ACTIVE" },
  };
}

/** Broker id của phiên hiện tại (nếu role BROKER). */
export async function brokerIdForSession(
  session: SessionUser,
): Promise<string | null> {
  const broker = await prisma.broker.findUnique({
    where: { userAccountId: session.id },
    select: { id: true },
  });
  return broker?.id ?? null;
}
