import type { PrismaClient, UnitBookingStatus } from "@prisma/client";

type Db = Pick<PrismaClient, "unitBooking" | "projectUnit">;

/** Suất đang hiệu lực — nhiều suất/căn được phép. */
export const ACTIVE_UNIT_BOOKING_STATUSES: UnitBookingStatus[] = [
  "PENDING",
  "CONFIRMED",
];

export function generateUnitBookingCode(): string {
  const n = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `BK-${n}`;
}

export function defaultBookingExpiresAt(days = 7): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

/** Cron — hết hạn suất (không đụng trạng thái căn). */
export async function expireUnitBookings(db: Db) {
  const now = new Date();
  const rows = await db.unitBooking.findMany({
    where: {
      status: { in: ACTIVE_UNIT_BOOKING_STATUSES },
      expiresAt: { lt: now },
    },
    select: { id: true },
  });

  if (rows.length === 0) return { expired: 0, ids: [] as string[] };

  await db.unitBooking.updateMany({
    where: { id: { in: rows.map((r) => r.id) } },
    data: { status: "EXPIRED" },
  });

  return { expired: rows.length, ids: rows.map((r) => r.id) };
}
