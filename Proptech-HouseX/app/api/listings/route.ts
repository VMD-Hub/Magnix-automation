import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError, ok } from "@/lib/api/http";
import { resolveBrokerId } from "@/lib/api/current-broker";
import {
  listingCreateSchema,
  listingListQuerySchema,
} from "@/lib/validation/listing";
import {
  assertLicenseGate,
  assertProjectUnitConsistency,
  generateListingCode,
} from "@/lib/rules/listing-rules";
import { computeFingerprint } from "@/lib/content/fingerprint";
import {
  evaluateContent,
  type ContentCandidate,
} from "@/lib/rules/listing-content-gate";
import { upsertCanonicalForListing } from "@/lib/data/canonical";
import { reindexListingSafe } from "@/lib/search/reindex";
import { assertPublishGate } from "@/lib/rules/listing-publish-gate";
import { recomputeListingRanking } from "@/lib/data/ranking";
import { isListingsApiRateLimited } from "@/lib/security/api-rate-limit";
import {
  INTERNAL_DEMO_LISTING_CODES,
  INTERNAL_DEMO_PROJECT_SLUGS,
} from "@/lib/deploy/internal-demo-content";

export async function GET(req: NextRequest) {
  try {
    if (await isListingsApiRateLimited(req)) {
      return fail(429, "RATE_LIMITED", "Quá nhiều yêu cầu. Vui lòng thử lại sau.");
    }
    const query = listingListQuerySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams),
    );

    const where: Prisma.ListingWhereInput = {
      ...(query.province ? { province: query.province } : {}),
      ...(query.district ? { district: query.district } : {}),
      ...(query.propertyType ? { propertyType: query.propertyType } : {}),
      ...(query.transactionType
        ? { transactionType: query.transactionType }
        : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      // Mặc định public chỉ thấy tin ACTIVE; cho phép lọc status tường minh.
      status: query.status ?? "ACTIVE",
      deletedAt: null,
      code: { notIn: [...INTERNAL_DEMO_LISTING_CODES] },
      OR: [
        { projectId: null },
        { project: { slug: { notIn: [...INTERNAL_DEMO_PROJECT_SLUGS] } } },
      ],
    };

    const [items, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy: [{ rankScore: "desc" }, { createdAt: "desc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        include: {
          broker: { select: { id: true, fullName: true, brokerType: true } },
          project: { select: { id: true, slug: true, name: true } },
          media: {
            where: { status: "READY" },
            orderBy: { position: "asc" },
            take: 1,
          },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return ok({
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = listingCreateSchema.parse(await req.json());
    const brokerId = await resolveBrokerId(req, body.brokerId);

    if (!brokerId) {
      return fail(
        400,
        "BROKER_REQUIRED",
        "Thiếu brokerId (truyền trong body hoặc header x-broker-id).",
      );
    }

    const broker = await prisma.broker.findUnique({
      where: { id: brokerId },
      select: { id: true, brokerType: true, licenseVerified: true },
    });
    if (!broker) {
      return fail(404, "BROKER_NOT_FOUND", "Không tìm thấy broker.");
    }

    const { isServiceActive } = await import("@/lib/data/agent-services");
    if (!(await isServiceActive(broker.id, "LISTING_POST"))) {
      return fail(
        403,
        "SERVICE_LOCKED",
        "Dịch vụ đăng tin chưa mở. Hoàn thành mục liên quan trong HouseX Agent hoặc liên hệ Ops.",
      );
    }

    const tier = body.tier ?? "FREE";

    // Rule #2 — license gate
    const licenseGate = assertLicenseGate(broker, tier);
    if (!licenseGate.ok) {
      return fail(403, licenseGate.code, licenseGate.message);
    }

    // Rule #1 — project/unit consistency
    const unitGate = await assertProjectUnitConsistency(prisma, {
      projectId: body.projectId,
      unitTypeId: body.unitTypeId,
    });
    if (!unitGate.ok) {
      return fail(422, unitGate.code, unitGate.message);
    }

    const { brokerId: _ignored, media, status, ...listingData } = body;

    // P2 — media/quality gate khi đăng thẳng ACTIVE.
    if (status === "ACTIVE") {
      const imgs = (media ?? []).filter((m) => m.type !== "video");
      const vids = (media ?? []).filter((m) => m.type === "video");
      const publishGate = assertPublishGate({
        readyImageCount: imgs.length,
        totalVideoCount: vids.length,
        readyVideoCount: vids.length, // video upload trực tiếp trong POST coi như READY
        descriptionLength: body.description?.length ?? 0,
      });
      if (!publishGate.ok) {
        return fail(422, publishGate.code, publishGate.message);
      }
    }

    // Rule P1 — content dedup gate.
    const fingerprint = computeFingerprint({
      brokerId: broker.id,
      propertyType: body.propertyType,
      province: body.province,
      district: body.district,
      ward: body.ward,
      price: body.price,
      area: body.area,
      projectId: body.projectId,
      unitTypeId: body.unitTypeId,
      description: body.description,
    });

    const candidateRows = await prisma.listingFingerprint.findMany({
      where: {
        OR: [
          { dupeKey: fingerprint.dupeKey },
          { listing: { brokerId: broker.id, status: { in: ["ACTIVE", "DRAFT"] } } },
        ],
      },
      select: {
        listingId: true,
        dupeKey: true,
        contentHash: true,
        listing: { select: { brokerId: true } },
      },
      take: 300,
    });
    const candidates: ContentCandidate[] = candidateRows.map((r) => ({
      listingId: r.listingId,
      brokerId: r.listing.brokerId,
      dupeKey: r.dupeKey,
      contentHash: r.contentHash,
    }));

    const contentGate = evaluateContent({
      brokerId: broker.id,
      fingerprint,
      candidates,
    });
    if (contentGate.decision === "hard_dupe") {
      return fail(409, contentGate.code, contentGate.message, {
        matchedListingId: contentGate.matchedListingId,
      });
    }

    // Retry vài lần phòng khi trùng code (xác suất cực thấp).
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const listing = await prisma.$transaction(async (tx) => {
          const createdListing = await tx.listing.create({
            data: {
              ...listingData,
              tier,
              ...(status ? { status } : {}),
              code: generateListingCode(),
              brokerId: broker.id,
              media: media?.length ? { create: media } : undefined,
            },
            include: {
              media: true,
              broker: { select: { id: true, fullName: true } },
            },
          });

          const canonicalId = await upsertCanonicalForListing(tx, {
            clusterKey: fingerprint.canonicalKey,
            projectId: body.projectId,
            unitTypeId: body.unitTypeId,
            propertyType: body.propertyType,
            province: body.province,
            district: body.district,
          });

          await tx.listingFingerprint.create({
            data: {
              listingId: createdListing.id,
              dupeKey: fingerprint.dupeKey,
              contentHash: fingerprint.contentHash,
              canonicalId,
            },
          });

          return createdListing;
        });
        await recomputeListingRanking(listing.id);
        await reindexListingSafe(listing.id);
        return created(listing);
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002" &&
          Array.isArray(e.meta?.target) &&
          (e.meta.target as string[]).includes("code")
        ) {
          continue;
        }
        throw e;
      }
    }

    return fail(500, "CODE_GENERATION_FAILED", "Không sinh được mã tin đăng.");
  } catch (err) {
    return handleApiError(err);
  }
}
