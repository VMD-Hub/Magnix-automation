import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type Db = Prisma.TransactionClient | typeof prisma;

export const CUSTOMER_NOTIFY_TYPE = {
  WAITLIST_WELCOME: "waitlist_welcome",
  WAITLIST_POLICY: "waitlist_policy",
  WAITLIST_PROGRESS: "waitlist_progress",
  WAITLIST_LAUNCH: "waitlist_launch",
} as const;

export async function createCustomerNotification(
  db: Db,
  data: {
    customerId: string;
    type: string;
    title: string;
    body: string;
    projectId?: string | null;
    leadId?: string | null;
    href?: string | null;
    dedupeKey?: string | null;
  },
) {
  if (data.dedupeKey) {
    const existing = await db.customerNotification.findUnique({
      where: { dedupeKey: data.dedupeKey },
    });
    if (existing) return { notification: existing, created: false as const };
  }

  try {
    const notification = await db.customerNotification.create({
      data: {
        customerId: data.customerId,
        type: data.type,
        title: data.title,
        body: data.body,
        projectId: data.projectId ?? null,
        leadId: data.leadId ?? null,
        href: data.href ?? null,
        dedupeKey: data.dedupeKey ?? null,
      },
    });
    return { notification, created: true as const };
  } catch (err) {
    // Race on unique dedupeKey
    if (data.dedupeKey) {
      const existing = await db.customerNotification.findUnique({
        where: { dedupeKey: data.dedupeKey },
      });
      if (existing) return { notification: existing, created: false as const };
    }
    throw err;
  }
}

export async function listCustomerNotifications(
  customerId: string,
  limit = 40,
) {
  const [items, unreadCount] = await Promise.all([
    prisma.customerNotification.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.customerNotification.count({
      where: { customerId, readAt: null },
    }),
  ]);
  return { items, unreadCount };
}

export async function markCustomerNotificationsRead(
  customerId: string,
  ids?: string[],
) {
  const where: Prisma.CustomerNotificationWhereInput = {
    customerId,
    readAt: null,
  };
  if (ids?.length) where.id = { in: ids };

  const result = await prisma.customerNotification.updateMany({
    where,
    data: { readAt: new Date() },
  });
  return result.count;
}
