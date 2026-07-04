import type { ListingStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { mediaCountsFor, recomputeListingRanking } from "@/lib/data/ranking";
import { recordStatusChange } from "@/lib/data/status-history";
import { sendListingRemovalEmail } from "@/lib/email/editorial-mailer";
import {
  getListingRemovalReason,
  type ListingRemovalReasonCode,
} from "@/lib/email/listing-removal-reasons";
import { assertPublishGate } from "@/lib/rules/listing-publish-gate";
import { reindexListingSafe } from "@/lib/search/reindex";
import { propertyTypeLabel } from "@/lib/format";

const ADMIN_ACTOR = "admin";
const LISTING_TTL_MS = 30 * 24 * 3600 * 1000;

const adminListingSelect = {
  id: true,
  code: true,
  status: true,
  transactionType: true,
  propertyType: true,
  price: true,
  area: true,
  address: true,
  province: true,
  district: true,
  ward: true,
  description: true,
  rejectReason: true,
  submittedAt: true,
  reviewedAt: true,
  photoCount: true,
  qualityScore: true,
  createdAt: true,
  updatedAt: true,
  broker: {
    select: {
      id: true,
      fullName: true,
      phone: true,
      brokerType: true,
      licenseVerified: true,
      userAccount: {
        select: { email: true, emailVerified: true },
      },
    },
  },
  media: {
    where: { type: "image" },
    orderBy: { position: "asc" as const },
    select: {
      id: true,
      url: true,
      status: true,
      width: true,
      height: true,
      position: true,
    },
  },
} satisfies Prisma.ListingSelect;

export type AdminListingRow = Prisma.ListingGetPayload<{
  select: typeof adminListingSelect;
}>;

export async function listListingsForAdmin(
  status?: ListingStatus | "ALL",
): Promise<AdminListingRow[]> {
  return prisma.listing.findMany({
    where: {
      deletedAt: null,
      ...(status && status !== "ALL" ? { status } : {}),
    },
    orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
    select: adminListingSelect,
  });
}

function listingTitle(row: Pick<AdminListingRow, "propertyType" | "district" | "code">): string {
  const type = propertyTypeLabel(row.propertyType) ?? row.propertyType;
  return `${type} · ${row.district} (${row.code})`;
}

export async function approveListing(listingId: string): Promise<{ code: string }> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      code: true,
      status: true,
      description: true,
      expireAt: true,
      propertyType: true,
      district: true,
    },
  });

  if (!listing || listing.status !== "PENDING_REVIEW") {
    throw new Error("LISTING_NOT_PENDING");
  }

  const counts = await mediaCountsFor(prisma, listingId);
  const publishGate = assertPublishGate({
    readyImageCount: counts.readyImageCount,
    totalVideoCount: counts.totalVideoCount,
    readyVideoCount: counts.readyVideoCount,
    descriptionLength: listing.description?.length ?? 0,
  });
  if (!publishGate.ok) {
    throw new Error(`GATE_${publishGate.code}`);
  }

  const expireAt = listing.expireAt ?? new Date(Date.now() + LISTING_TTL_MS);

  await prisma.$transaction(async (tx) => {
    await tx.listing.update({
      where: { id: listingId },
      data: {
        status: "ACTIVE",
        reviewedAt: new Date(),
        rejectReason: null,
        expireAt,
      },
    });
    await recordStatusChange(tx, {
      entity: "listing",
      entityId: listingId,
      fromStatus: listing.status,
      toStatus: "ACTIVE",
      actor: ADMIN_ACTOR,
    });
  });

  await recomputeListingRanking(listingId);
  await reindexListingSafe(listingId);
  return { code: listing.code };
}

export async function rejectListing(
  listingId: string,
  rejectReason: string,
  reasonCode?: ListingRemovalReasonCode,
): Promise<void> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      code: true,
      status: true,
      propertyType: true,
      district: true,
      broker: {
        select: {
          fullName: true,
          userAccount: { select: { email: true, emailVerified: true } },
        },
      },
    },
  });

  if (!listing || listing.status !== "PENDING_REVIEW") {
    throw new Error("LISTING_NOT_PENDING");
  }

  await prisma.$transaction(async (tx) => {
    await tx.listing.update({
      where: { id: listingId },
      data: {
        status: "REJECTED",
        rejectReason,
        reviewedAt: new Date(),
      },
    });
    await recordStatusChange(tx, {
      entity: "listing",
      entityId: listingId,
      fromStatus: listing.status,
      toStatus: "REJECTED",
      reason: reasonCode ?? rejectReason,
      actor: ADMIN_ACTOR,
    });
  });

  await reindexListingSafe(listingId);

  const email = listing.broker.userAccount.email;
  if (email && listing.broker.userAccount.emailVerified) {
    const code = reasonCode ?? "legal_violation";
    try {
      await sendListingRemovalEmail({
        to: email,
        posterName: listing.broker.fullName,
        listingId: listing.code,
        listingTitle: listingTitle(listing),
        noticeDate: new Date().toLocaleDateString("vi-VN"),
        reason: code,
        action: "hidden",
      });
    } catch (err) {
      console.error("[listing-admin] removal email failed", listing.code, err);
    }
  }
}

export function formatRejectReason(
  reasonCode: ListingRemovalReasonCode | undefined,
  customReason: string,
): string {
  if (reasonCode) {
    const copy = getListingRemovalReason(reasonCode);
    return customReason.trim()
      ? `${copy.labelVi}: ${customReason.trim()}`
      : copy.reasonVi;
  }
  return customReason.trim();
}
