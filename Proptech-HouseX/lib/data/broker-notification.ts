import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Db = Prisma.TransactionClient | typeof prisma;

export async function createBrokerNotification(
  db: Db,
  data: {
    brokerId: string;
    type: string;
    title: string;
    body: string;
    caseId?: string;
  },
) {
  return db.brokerNotification.create({ data });
}

export async function listBrokerNotifications(
  brokerId: string,
  limit = 30,
) {
  const [items, unreadCount] = await Promise.all([
    prisma.brokerNotification.findMany({
      where: { brokerId },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.brokerNotification.count({
      where: { brokerId, readAt: null },
    }),
  ]);
  return { items, unreadCount };
}

export async function markNotificationsRead(
  brokerId: string,
  ids?: string[],
) {
  const where: Prisma.BrokerNotificationWhereInput = {
    brokerId,
    readAt: null,
  };
  if (ids?.length) {
    where.id = { in: ids };
  }

  const result = await prisma.brokerNotification.updateMany({
    where,
    data: { readAt: new Date() },
  });
  return result.count;
}
