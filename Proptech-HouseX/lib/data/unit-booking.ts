import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { freezeNoxhCaseOnDeposit } from "@/lib/data/noxh-case";
import { getProjectUnitByRef } from "@/lib/data/project-unit";
import { recordStatusChange } from "@/lib/data/status-history";
import {
  assertProjectAcceptsBookings,
  assertUnitAcceptsBookings,
} from "@/lib/rules/sale-eligibility-gate";
import {
  ACTIVE_UNIT_BOOKING_STATUSES,
  defaultBookingExpiresAt,
  generateUnitBookingCode,
} from "@/lib/rules/unit-booking-rules";
import type { UnitBookingCreateInput } from "@/lib/validation/unit-booking";
import { normalizeVnPhone, isValidVnPhone } from "@/lib/phone";
import { resolveAttribution, type ReferralTouch } from "@/lib/rules/attribution-lock";
import { enqueueEvent } from "@/lib/events/outbox";
import type { OutboxPayloads } from "@/lib/events/types";

const bookingInclude = {
  unit: { select: { id: true, code: true, status: true } },
  project: { select: { id: true, slug: true, name: true } },
} as const;

export type UnitBookingDetail = Prisma.UnitBookingGetPayload<{
  include: typeof bookingInclude;
}>;

export async function createUnitBooking(params: {
  slugOrId: string;
  unitRef: string;
  input: UnitBookingCreateInput;
  referralTouch: ReferralTouch;
  bookingTtlDays?: number;
}) {
  const normalizedPhone = normalizeVnPhone(params.input.phone);
  if (!isValidVnPhone(normalizedPhone)) {
    return { ok: false as const, code: "INVALID_PHONE", message: "Số điện thoại không hợp lệ." };
  }

  const resolved = await getProjectUnitByRef(params.slugOrId, params.unitRef);
  if (!resolved?.project || !resolved.unit) {
    return { ok: false as const, code: "NOT_FOUND", message: "Không tìm thấy căn." };
  }

  const projectGate = assertProjectAcceptsBookings({
    projectStatus: resolved.project.status,
    projectType: resolved.project.projectType,
  });
  if (!projectGate.ok) {
    return { ok: false as const, code: projectGate.code, message: projectGate.message };
  }

  const unitGate = assertUnitAcceptsBookings(resolved.unit.status);
  if (!unitGate.ok) {
    return { ok: false as const, code: unitGate.code, message: unitGate.message };
  }

  const booking = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { normalizedPhone },
      update: { name: params.input.name, email: params.input.email ?? undefined },
      create: {
        name: params.input.name,
        phone: params.input.phone,
        normalizedPhone,
        email: params.input.email,
      },
    });

    const attribution = await resolveAttribution(tx, {
      customerId: customer.id,
      customerNormalizedPhone: normalizedPhone,
      referral: params.referralTouch,
    });

    let code = generateUnitBookingCode();
    for (let i = 0; i < 5; i++) {
      const exists = await tx.unitBooking.findUnique({ where: { code } });
      if (!exists) break;
      code = generateUnitBookingCode();
    }

    const created = await tx.unitBooking.create({
      data: {
        code,
        projectId: resolved.unit!.projectId,
        unitId: resolved.unit!.id,
        customerId: customer.id,
        brokerId: attribution.assignedBrokerId,
        referralId: attribution.referralId,
        customerName: params.input.name,
        phone: params.input.phone,
        normalizedPhone,
        email: params.input.email,
        message: params.input.message,
        status: "CONFIRMED",
        expiresAt: defaultBookingExpiresAt(params.bookingTtlDays ?? 7),
      },
      include: bookingInclude,
    });

    const eventPayload: OutboxPayloads["ops.request_created"] = {
      requestId: created.id,
      kind: "unit_booking",
      title: `Giữ suất ${created.project.name} · ${created.unit.code}`,
      detail: `Mã giữ suất ${created.code}${
        created.expiresAt ? `; hết hạn ${created.expiresAt.toISOString()}` : ""
      }`,
      priority: "urgent",
      source: "project_unit_booking",
      contact: {
        name: created.customerName,
        phone: created.phone,
        email: created.email,
      },
      adminUrl: `https://timnhaxahoi.com/admin/unit-bookings`,
      createdAt: created.createdAt.toISOString(),
    };

    await enqueueEvent(
      tx,
      "ops.request_created",
      eventPayload,
      `ops.request_created:unit_booking:${created.id}`,
    );

    return created;
  });

  return { ok: true as const, booking };
}

/** Admin — xác nhận hoặc huỷ suất (không lock căn). */
export async function patchUnitBookingStatus(
  bookingId: string,
  status: "CONFIRMED" | "CANCELLED",
  cancelReason?: string,
) {
  const existing = await prisma.unitBooking.findUnique({ where: { id: bookingId } });
  if (!existing) return null;
  if (!["PENDING", "CONFIRMED"].includes(existing.status)) {
    throw new Error("BOOKING_NOT_ACTIVE");
  }

  return prisma.unitBooking.update({
    where: { id: bookingId },
    data: {
      status,
      ...(status === "CANCELLED"
        ? { cancelledAt: new Date(), cancelReason: cancelReason ?? "admin_cancel" }
        : {}),
    },
    include: bookingInclude,
  });
}

/**
 * Admin — chuyển cọc thủ công: lock căn DEPOSITED, huỷ các suất còn lại trên căn.
 */
export async function convertUnitBookingToDeposit(
  bookingId: string,
  convertedBy = "admin",
) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.unitBooking.findUnique({
      where: { id: bookingId },
      include: { unit: true },
    });
    if (!booking) return null;

    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      throw new Error("BOOKING_NOT_CONVERTIBLE");
    }
    if (booking.unit.status !== "AVAILABLE") {
      throw new Error("UNIT_ALREADY_LOCKED");
    }

    const now = new Date();

    await tx.projectUnit.update({
      where: { id: booking.unitId },
      data: {
        status: "DEPOSITED",
        depositBookingId: booking.id,
        depositLockedAt: now,
      },
    });

    await recordStatusChange(tx, {
      entity: "project_unit",
      entityId: booking.unitId,
      fromStatus: booking.unit.status,
      toStatus: "DEPOSITED",
      reason: "deposit_manual",
      actor: convertedBy,
    });

    const winner = await tx.unitBooking.update({
      where: { id: bookingId },
      data: {
        status: "CONVERTED_TO_DEPOSIT",
        convertedAt: now,
        convertedBy,
      },
      include: bookingInclude,
    });

    await tx.unitBooking.updateMany({
      where: {
        unitId: booking.unitId,
        id: { not: bookingId },
        status: { in: ACTIVE_UNIT_BOOKING_STATUSES },
      },
      data: {
        status: "CANCELLED",
        cancelledAt: now,
        cancelReason: "other_customer_deposited",
      },
    });

    await freezeNoxhCaseOnDeposit(tx, booking.normalizedPhone, bookingId);

    return winner;
  });
}

export async function countActiveBookingsForUnit(unitId: string) {
  return prisma.unitBooking.count({
    where: {
      unitId,
      status: { in: ACTIVE_UNIT_BOOKING_STATUSES },
    },
  });
}

const adminListInclude = {
  unit: { select: { id: true, code: true, status: true, block: true } },
  project: { select: { id: true, slug: true, name: true } },
  broker: { select: { id: true, fullName: true, phone: true } },
} as const;

export type UnitBookingAdminRow = Prisma.UnitBookingGetPayload<{
  include: typeof adminListInclude;
}>;

export async function listUnitBookingsForAdmin(
  status: "ACTIVE" | "ALL" = "ACTIVE",
) {
  return prisma.unitBooking.findMany({
    where:
      status === "ACTIVE"
        ? { status: { in: ACTIVE_UNIT_BOOKING_STATUSES } }
        : undefined,
    orderBy: [{ createdAt: "desc" }],
    include: adminListInclude,
  });
}
