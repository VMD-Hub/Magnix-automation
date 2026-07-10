import sharp from "sharp";

/** Bo góc favicon — ~22% cạnh, gần kiểu app icon iOS. */
export const FAVICON_CORNER_RATIO = 0.22;

export function faviconCornerRadius(size: number): number {
  return Math.max(2, Math.round(size * FAVICON_CORNER_RATIO));
}

function roundedMaskSvg(size: number, radius: number): Buffer {
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`,
  );
}

/** Vuông bo góc — góc ngoài trong suốt (thân thiện trên tab trình duyệt). */
export async function roundedSquarePng(
  src: string | Buffer,
  size: number,
): Promise<Buffer> {
  const radius = faviconCornerRadius(size);
  const resized = await sharp(src)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .png()
    .toBuffer();

  return sharp(resized)
    .composite([{ input: roundedMaskSvg(size, radius), blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

export async function writeRoundedSquarePng(
  src: string | Buffer,
  size: number,
  outPath: string,
): Promise<void> {
  const buf = await roundedSquarePng(src, size);
  await sharp(buf).toFile(outPath);
}
