import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { listingPatchSchema } from "@/lib/validation/listing";
import {
  assertLicenseGate,
  assertProjectUnitConsistency,
} from "@/lib/rules/listing-rules";
import { computeFingerprint } from "@/lib/content/fingerprint";
import { upsertCanonicalForListing } from "@/lib/data/canonical";
import { reindexListingSafe } from "@/lib/search/reindex";
import { assertPublishGate } from "@/lib/rules/listing-publish-gate";
import { mediaCountsFor, recomputeListingRanking } from "@/lib/data/ranking";
import { recordStatusChange } from "@/lib/data/status-history";
import { resolveBrokerId } from "@/lib/api/current-broker";

const CONTENT_FIELDS = [
  "description",
  "price",
  "area",
  "propertyType",
  "province",
  "district",
  "ward",
  "projectId",
  "unitTypeId",
] as const;

// PATCH /api/listings/:listingRef — sửa tin (listingRef = uuid).
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    const { listingRef: id } = await params;
    const patch = listingPatchSchema.parse(await req.json());

    const existing = await prisma.listing.findUnique({
      where: { id },
      select: {
        id: true,
        brokerId: true,
        projectId: true,
        unitTypeId: true,
        tier: true,
        status: true,
        propertyType: true,
        province: true,
        district: true,
        ward: true,
        price: true,
        area: true,
        description: true,
        broker: { select: { brokerType: true, licenseVerified: true } },
      },
    });
    if (!existing) {
      return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
    }

    if ("tier" in patch && patch.tier) {
      const gate = assertLicenseGate(existing.broker, patch.tier);
      if (!gate.ok) {
        return fail(403, gate.code, gate.message);
      }
    }

    if ("projectId" in patch || "unitTypeId" in patch) {
      const effectiveProjectId =
        "projectId" in patch ? patch.projectId : existing.projectId;
      const effectiveUnitTypeId =
        "unitTypeId" in patch ? patch.unitTypeId : existing.unitTypeId;

      const unitGate = await assertProjectUnitConsistency(prisma, {
        projectId: effectiveProjectId,
        unitTypeId: effectiveUnitTypeId,
      });
      if (!unitGate.ok) {
        return fail(422, unitGate.code, unitGate.message);
      }
    }

    if (patch.status === "ACTIVE" && existing.status !== "ACTIVE") {
      const counts = await mediaCountsFor(prisma, id);
      const effectiveDesc =
        "description" in patch ? patch.description : existing.description;
      const publishGate = assertPublishGate({
        readyImageCount: counts.readyImageCount,
        totalVideoCount: counts.totalVideoCount,
        readyVideoCount: counts.readyVideoCount,
        descriptionLength: effectiveDesc?.length ?? 0,
      });
      if (!publishGate.ok) {
        return fail(422, publishGate.code, publishGate.message);
      }
    }

    const contentChanged = CONTENT_FIELDS.some((f) => f in patch);
    const actorBrokerId =
      (await resolveBrokerId(req)) ?? existing.brokerId;

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.listing.update({
        where: { id },
        data: patch,
        include: {
          media: { orderBy: { position: "asc" } },
          project: { select: { id: true, slug: true, name: true } },
        },
      });

      if (patch.status && patch.status !== existing.status) {
        await recordStatusChange(tx, {
          entity: "listing",
          entityId: id,
          fromStatus: existing.status,
          toStatus: patch.status,
          actor: actorBrokerId,
        });
      }

      if (contentChanged) {
        const fp = computeFingerprint({
          brokerId: existing.brokerId,
          propertyType: u.propertyType,
          province: u.province,
          district: u.district,
          ward: u.ward,
          price: Number(u.price.toString()),
          area: u.area,
          projectId: u.projectId,
          unitTypeId: u.unitTypeId,
          description: u.description,
        });
        const canonicalId = await upsertCanonicalForListing(tx, {
          clusterKey: fp.canonicalKey,
          projectId: u.projectId,
          unitTypeId: u.unitTypeId,
          propertyType: u.propertyType,
          province: u.province,
          district: u.district,
        });
        await tx.listingFingerprint.upsert({
          where: { listingId: id },
          create: {
            listingId: id,
            dupeKey: fp.dupeKey,
            contentHash: fp.contentHash,
            canonicalId,
          },
          update: {
            dupeKey: fp.dupeKey,
            contentHash: fp.contentHash,
            canonicalId,
          },
        });
      }

      return u;
    });

    await recomputeListingRanking(id);
    await reindexListingSafe(id);
    return ok(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/listings/:listingRef — soft delete (listingRef = uuid).
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    const { listingRef: id } = await params;
    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, status: true, brokerId: true, deletedAt: true },
    });
    if (!existing) {
      return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
    }
    if (existing.deletedAt) {
      return ok({ id, alreadyDeleted: true });
    }

    const actorBrokerId =
      (await resolveBrokerId(req)) ?? existing.brokerId;

    await prisma.$transaction(async (tx) => {
      await tx.listing.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      await recordStatusChange(tx, {
        entity: "listing",
        entityId: id,
        fromStatus: existing.status,
        toStatus: "DELETED",
        reason: "soft_delete",
        actor: actorBrokerId,
      });
    });

    await reindexListingSafe(id);
    return ok({ id, deleted: true });
  } catch (err) {
    return handleApiError(err);
  }
}
