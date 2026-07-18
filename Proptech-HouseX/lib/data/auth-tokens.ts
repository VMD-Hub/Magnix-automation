import type { AuthTokenType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateSecureToken, hashAuthToken } from "@/lib/auth/secure-token";

const TTL_HOURS: Record<AuthTokenType, number> = {
  EMAIL_VERIFY: 72,
  PASSWORD_RESET: 1,
};

export async function issueUserAuthToken(
  userAccountId: string,
  type: AuthTokenType,
  ttlHours?: number,
): Promise<string> {
  const raw = generateSecureToken();
  const tokenHash = hashAuthToken(raw);
  const hours = ttlHours ?? TTL_HOURS[type];
  const expiresAt = new Date(Date.now() + hours * 3_600_000);

  await prisma.$transaction([
    prisma.userAuthToken.updateMany({
      where: { userAccountId, type, usedAt: null },
      data: { usedAt: new Date() },
    }),
    prisma.userAuthToken.create({
      data: { userAccountId, type, tokenHash, expiresAt },
    }),
  ]);

  return raw;
}

export async function consumeUserAuthToken(
  raw: string,
  expectedType: AuthTokenType,
): Promise<{ userAccountId: string } | null> {
  const tokenHash = hashAuthToken(raw);
  const row = await prisma.userAuthToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userAccountId: true,
      type: true,
      expiresAt: true,
      usedAt: true,
    },
  });

  if (!row || row.type !== expectedType || row.usedAt) return null;
  if (row.expiresAt.getTime() < Date.now()) return null;

  await prisma.userAuthToken.update({
    where: { id: row.id },
    data: { usedAt: new Date() },
  });

  return { userAccountId: row.userAccountId };
}
