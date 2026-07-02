import { prisma } from "@/lib/prisma";

export type CommissionSummary = {
  broker: { id: string; fullName: string } | null;
  items: Awaited<ReturnType<typeof fetchCommissionItems>>;
  totalsByStatus: Record<string, { count: number; amount: number }>;
  totalAmount: number;
};

function fetchCommissionItems(brokerId: string) {
  return prisma.commission.findMany({
    where: { brokerId },
    orderBy: { createdAt: "desc" },
    include: {
      lead: {
        select: {
          id: true,
          status: true,
          listing: { select: { code: true } },
          project: { select: { slug: true, name: true } },
        },
      },
      referral: { select: { code: true } },
    },
  });
}

export async function getBrokerCommissions(
  brokerId: string,
): Promise<CommissionSummary> {
  const [broker, items] = await Promise.all([
    prisma.broker.findUnique({
      where: { id: brokerId },
      select: { id: true, fullName: true },
    }),
    fetchCommissionItems(brokerId),
  ]);

  const totalsByStatus: Record<string, { count: number; amount: number }> = {};
  let totalAmount = 0;

  for (const c of items) {
    const amount = Number(c.amount.toString());
    totalAmount += amount;
    const bucket = (totalsByStatus[c.status] ??= { count: 0, amount: 0 });
    bucket.count += 1;
    bucket.amount += amount;
  }

  return { broker, items, totalsByStatus, totalAmount };
}
