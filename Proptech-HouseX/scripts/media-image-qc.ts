/**
 * Worker QC ảnh (chạy NGOÀI web-VPS). Decode ảnh bằng sharp → pHash + lấy kích
 * thước → chấm chất lượng → cập nhật ListingMedia + nạp pHash vào fingerprint.
 *
 * Dùng:
 *   npm run media:qc -- --media <mediaId> --file ./path/to.jpg
 *   npm run media:qc -- --media <mediaId> --url https://cdn/...jpg
 */
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import { dctPhash } from "../lib/media/phash";
import { evaluateMediaQuality } from "../lib/media/quality";
import { recomputeListingRanking } from "../lib/data/ranking";

const prisma = new PrismaClient();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function loadBytes(): Promise<Buffer> {
  const file = arg("file");
  const url = arg("url");
  if (file) {
    const fs = await import("fs/promises");
    return fs.readFile(file);
  }
  if (url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch ảnh thất bại: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  throw new Error("Cần --file hoặc --url");
}

async function main() {
  const mediaId = arg("media");
  if (!mediaId) throw new Error("Cần --media <mediaId>");

  const bytes = await loadBytes();
  const img = sharp(bytes);
  const meta = await img.metadata();

  // 32x32 grayscale raw → mảng 1024 pixel cho pHash.
  const gray = await sharp(bytes)
    .resize(32, 32, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer();
  const phash = dctPhash(Array.from(gray.subarray(0, 32 * 32)));

  const quality = evaluateMediaQuality({
    kind: "image",
    width: meta.width,
    height: meta.height,
  });

  const updated = await prisma.listingMedia.update({
    where: { id: mediaId },
    data: quality.ok
      ? {
          status: "READY",
          width: meta.width,
          height: meta.height,
          phash,
          rejectReason: null,
        }
      : {
          status: "REJECTED",
          width: meta.width,
          height: meta.height,
          phash,
          rejectReason: quality.reasons.join(" "),
        },
  });

  // Nạp pHash vào fingerprint của listing (phục vụ dedup ảnh sau này).
  const fp = await prisma.listingFingerprint.findUnique({
    where: { listingId: updated.listingId },
    select: { id: true },
  });
  if (fp) {
    await prisma.listingFingerprint.update({
      where: { id: fp.id },
      data: { imagePhash: { push: phash } },
    });
  }

  // QC xong → cập nhật quality/rank cho listing.
  await recomputeListingRanking(updated.listingId, prisma);

  console.log(
    `media ${mediaId}: ${updated.status} (${meta.width}x${meta.height}) phash=${phash}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
