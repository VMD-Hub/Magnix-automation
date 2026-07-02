import { prisma } from "@/lib/prisma";

const leadInclude = {
  listing: {
    select: { id: true, code: true, district: true, province: true },
  },
  project: { select: { id: true, slug: true, name: true } },
} as const;

const bookingInclude = {
  unit: { select: { id: true, code: true, status: true } },
  project: { select: { id: true, slug: true, name: true } },
} as const;

export type CustomerLeadRow = Awaited<
  ReturnType<typeof listCustomerLeads>
>[number];

export type CustomerBookingRow = Awaited<
  ReturnType<typeof listCustomerBookings>
>[number];

export async function listCustomerLeads(customerId: string, take = 20) {
  return prisma.lead.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    take,
    include: leadInclude,
  });
}

export async function listCustomerBookings(customerId: string, take = 20) {
  return prisma.unitBooking.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    take,
    include: bookingInclude,
  });
}

export async function getCustomerAccountSummary(customerId: string) {
  const [leads, bookings] = await Promise.all([
    listCustomerLeads(customerId),
    listCustomerBookings(customerId),
  ]);
  return { leads, bookings };
}
