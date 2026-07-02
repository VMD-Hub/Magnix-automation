import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { mediaInitSchema } from "@/lib/validation/media";
import { getMediaProvider } from "@/lib/media/provider";
import { evaluateMediaQuality } from "@/lib/media/quality";
import { recomputeListingRanking } from "@/lib/data/ranking";
import { reindexListingSafe } from "@/lib/search/reindex";

// POST /api/listings/:listingRef/media — listingRef = uuid.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    const { listingRef: id } = await params;
    const body = mediaInitSchema.parse(await req.json());

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!listing) {
      return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
    }

    if (body.kind === "video") {
      const provider = getMediaProvider();
      const upload = await provider.createVideoUpload({
        listingId: id,
        title: body.title,
      });

      const media = await prisma.listingMedia.create({
        data: {
          listingId: id,
          type: "video",
          url: upload.playbackUrl ?? "",
          provider: provider.name,
          playbackId: upload.assetId,
          status: "UPLOADING",
          position: body.position ?? 0,
        },
      });

      return created({
        media,
        upload: { uploadUrl: upload.uploadUrl, assetId: upload.assetId },
      });
    }

    if (!body.url) {
      return fail(422, "IMAGE_URL_REQUIRED", "Ảnh cần `url` đã upload lên CDN.");
    }

    let status = "PROCESSING";
    let rejectReason: string | null = null;
    if (body.width && body.height) {
      const q = evaluateMediaQuality({
        kind: "image",
        width: body.width,
        height: body.height,
      });
      if (q.ok) status = "READY";
      else {
        status = "REJECTED";
        rejectReason = q.reasons.join(" ");
      }
    }

    const media = await prisma.listingMedia.create({
      data: {
        listingId: id,
        type: "image",
        url: body.url,
        provider: "image_cdn",
        status,
        rejectReason,
        width: body.width,
        height: body.height,
        position: body.position ?? 0,
      },
    });

    if (status === "READY") {
      await recomputeListingRanking(id);
      await reindexListingSafe(id);
    }

    return created({ media });
  } catch (err) {
    return handleApiError(err);
  }
}
