import type { PrismaClient } from "@prisma/client";
import { defaultBookingExpiresAt } from "@/lib/rules/unit-booking-rules";

type BookingSeed = {
  unitCode: string;
  customerName: string;
  phone: string;
  status: "CONFIRMED" | "CONVERTED_TO_DEPOSIT" | "CANCELLED";
  code: string;
};

const RIVERSIDE_BOOKINGS: BookingSeed[] = [
  { unitCode: "A-05-01", customerName: "Nguyễn Văn A", phone: "0901111001", status: "CONFIRMED", code: "BK-100001" },
  { unitCode: "A-05-01", customerName: "Trần Thị B", phone: "0901111002", status: "CONFIRMED", code: "BK-100002" },
  { unitCode: "A-05-02", customerName: "Lê Văn C", phone: "0901111003", status: "CONFIRMED", code: "BK-100003" },
  { unitCode: "B-08-03", customerName: "Phạm Thị D", phone: "0901111004", status: "CONFIRMED", code: "BK-100004" },
  { unitCode: "B-08-03", customerName: "Hoàng Văn E", phone: "0901111005", status: "CONFIRMED", code: "BK-100005" },
  { unitCode: "B-08-03", customerName: "Võ Thị F", phone: "0901111006", status: "CONFIRMED", code: "BK-100006" },
  { unitCode: "C-03-05", customerName: "Đặng Văn G", phone: "0901111007", status: "CONVERTED_TO_DEPOSIT", code: "BK-100007" },
];

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").replace(/^84/, "0");
}

/** Nạp suất giữ mẫu — nhiều suất/căn; C-03-05 đã chuyển cọc thủ công. */
export async function seedHousexRiversideUnitBookings(
  db: PrismaClient,
  projectId: string,
) {
  const units = await db.projectUnit.findMany({
    where: { projectId },
    select: { id: true, code: true, status: true },
  });
  const unitByCode = new Map(units.map((u) => [u.code, u]));

  for (const b of RIVERSIDE_BOOKINGS) {
    const unit = unitByCode.get(b.unitCode);
    if (!unit) continue;

    const normalizedPhone = normalizePhone(b.phone);
    const customer = await db.customer.upsert({
      where: { normalizedPhone },
      update: { name: b.customerName },
      create: {
        name: b.customerName,
        phone: b.phone,
        normalizedPhone,
      },
    });

    const expiresAt = defaultBookingExpiresAt(7);
    const booking = await db.unitBooking.upsert({
      where: { code: b.code },
      update: {
        status: b.status,
        customerName: b.customerName,
        expiresAt,
        ...(b.status === "CONVERTED_TO_DEPOSIT"
          ? { convertedAt: new Date(), convertedBy: "seed" }
          : {}),
      },
      create: {
        code: b.code,
        projectId,
        unitId: unit.id,
        customerId: customer.id,
        customerName: b.customerName,
        phone: b.phone,
        normalizedPhone,
        status: b.status,
        expiresAt,
        ...(b.status === "CONVERTED_TO_DEPOSIT"
          ? { convertedAt: new Date(), convertedBy: "seed" }
          : {}),
      },
    });

    if (b.status === "CONVERTED_TO_DEPOSIT" && unit.status === "DEPOSITED") {
      await db.projectUnit.update({
        where: { id: unit.id },
        data: {
          depositBookingId: booking.id,
          depositLockedAt: booking.convertedAt ?? new Date(),
        },
      });
    }
  }
}
