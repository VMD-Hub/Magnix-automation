import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api/http";
import { mediaWebhookSchema } from "@/lib/validation/media";
import { getMediaProvider } from "@/lib/media/provider";
import { evaluateMediaQuality } from "@/lib/media/quality";
import { recomputeListingRanking } from "@/lib/data/ranking";
import { reindexListingSafe } from "@/lib/search/reindex";

export const dynamic = "force-dynamic";

// POST /api/webhooks/media — provider báo transcode xong.
// Chạy QC trên metadata → set READY (+ playback url/dims) hoặc REJECTED.
// Bảo vệ bằng header x-media-secret = MEDIA_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.MEDIA_WEBHOOK_SECRET;
    if (secret && req.headers.get("x-media-secret") !== secret) {
      return fail(401, "UNAUTHORIZED", "Webhook secret không hợp lệ.");
    }

    const body = mediaWebhookSchema.parse(await req.json());

    const media = await prisma.listingMedia.findFirst({
      where: { playbackId: body.assetId },
      select: { id: true, listingId: true },
    });
    if (!media) {
      return fail(404, "MEDIA_NOT_FOUND", "Không tìm thấy media theo assetId.");
    }

    const quality = evaluateMediaQuality({
      kind: body.kind,
      width: body.width,
      height: body.height,
      durationSec: body.durationSec,
    });

    const playbackUrl =
      body.playbackUrl ?? getMediaProvider().playbackUrl(body.assetId);

    const updated = await prisma.listingMedia.update({
      where: { id: media.id },
      data: quality.ok
        ? {
            status: "READY",
            url: playbackUrl,
            width: body.width,
            height: body.height,
            durationSec: body.durationSec,
            rejectReason: null,
          }
        : {
            status: "REJECTED",
            rejectReason: quality.reasons.join(" "),
          },
    });

    // Media state đổi → cập nhật quality/rank + đồng bộ search.
    await recomputeListingRanking(media.listingId);
    await reindexListingSafe(media.listingId);

    return ok({ media: updated });
  } catch (err) {
    return handleApiError(err);
  }
}
