import { join } from "node:path";
import sharp from "sharp";
import {
  HOUSEX_HEADER_LOGO_MARK_SRC,
  HOUSEX_HEADER_LOGO_SRC,
} from "../lib/brand/housex-logo-assets";

/** Tách nền giấy logo → trong suốt; thanh tiêu đề dùng chung texture bên dưới. */
async function main() {
  const srcPath = join(
    process.cwd(),
    "public",
    HOUSEX_HEADER_LOGO_SRC.replace(/^\//, ""),
  );
  const outPath = join(
    process.cwd(),
    "public",
    HOUSEX_HEADER_LOGO_MARK_SRC.replace(/^\//, ""),
  );

  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const corners: Array<[number, number]> = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  let bgR = 0;
  let bgG = 0;
  let bgB = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    bgR += data[i]!;
    bgG += data[i + 1]!;
    bgB += data[i + 2]!;
  }
  bgR = Math.round(bgR / corners.length);
  bgG = Math.round(bgG / corners.length);
  bgB = Math.round(bgB / corners.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max - min;

      if (dist <= 18 && sat <= 20) {
        data[i + 3] = 0;
      } else if (dist <= 44 && sat <= 30) {
        const t = (dist - 18) / 26;
        data[i + 3] = Math.round(Math.min(1, Math.max(0, t)) * 255);
      }
    }
  }

  await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outPath);

  console.log(`Generated ${HOUSEX_HEADER_LOGO_MARK_SRC}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
