import { prisma } from "@/lib/prisma";

const listingInclude = {
  project: { select: { id: true, slug: true, name: true } },
  media: {
    where: { status: "READY", type: "image" },
    orderBy: { position: "asc" as const },
    take: 1,
    select: { url: true },
  },
} as const;

export async function listBrokerListings(brokerId: string, take = 50) {
  return prisma.listing.findMany({
    where: { brokerId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    take,
    include: listingInclude,
  });
}

export async function getBrokerListing(brokerId: string, listingId: string) {
  return prisma.listing.findFirst({
    where: { id: listingId, brokerId, deletedAt: null },
    include: {
      project: { select: { id: true, slug: true, name: true } },
      media: { orderBy: { position: "asc" } },
    },
  });
}
