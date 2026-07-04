import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { created, fail, handleApiError } from "@/lib/api/http";
import { resolveBrokerId } from "@/lib/api/current-broker";
import { evaluateMediaQuality } from "@/lib/media/quality";
import { recomputeListingRanking } from "@/lib/data/ranking";
import { reindexListingSafe } from "@/lib/search/reindex";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);

function publicUrl(relativePath: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  return `${base}${relativePath}`;
}

// POST /api/listings/:listingRef/media/upload — multipart field "file"
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ listingRef: string }> },
) {
  try {
    const { listingRef: id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { id: true, brokerId: true, deletedAt: true },
    });
    if (!listing || listing.deletedAt) {
      return fail(404, "NOT_FOUND", "Không tìm thấy tin đăng.");
    }

    const sessionBrokerId = await resolveBrokerId(req);
    if (!sessionBrokerId || sessionBrokerId !== listing.brokerId) {
      return fail(403, "FORBIDDEN", "Chỉ môi giới đăng tin mới upload ảnh.");
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return fail(422, "FILE_REQUIRED", "Thiếu file ảnh (field `file`).");
    }

    if (!ALLOWED.has(file.type)) {
      return fail(422, "INVALID_TYPE", "Chỉ chấp nhận JPG, PNG hoặc WebP.");
    }
    if (file.size > MAX_BYTES) {
      return fail(422, "FILE_TOO_LARGE", "Ảnh tối đa 12 MB.");
    }

    const position = Number(form.get("position") ?? "0");
    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await sharp(buffer)
      .rotate()
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });

    const width = processed.info.width ?? 0;
    const height = processed.info.height ?? 0;
    const quality = evaluateMediaQuality({
      kind: "image",
      width,
      height,
    });

    const status = quality.ok ? "READY" : "REJECTED";
    const rejectReason = quality.ok ? null : quality.reasons.join(" ");

    const dir = path.join(process.cwd(), "public", "uploads", "listings", id);
    await mkdir(dir, { recursive: true });
    const filename = `${randomUUID()}.webp`;
    const diskPath = path.join(dir, filename);
    await writeFile(diskPath, processed.data);

    const url = publicUrl(`/uploads/listings/${id}/${filename}`);

    const media = await prisma.listingMedia.create({
      data: {
        listingId: id,
        type: "image",
        url,
        provider: "local_upload",
        status,
        rejectReason,
        width,
        height,
        position: Number.isFinite(position) ? Math.max(0, position) : 0,
      },
    });

    if (status === "READY") {
      await recomputeListingRanking(id);
      await reindexListingSafe(id);
    }

    return created({ media, url, quality: quality.ok ? "ok" : quality.reasons });
  } catch (err) {
    return handleApiError(err);
  }
}
