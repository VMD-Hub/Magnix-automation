import { join } from "node:path";
import sharp from "sharp";
import {
  HOUSEX_HEADER_LOGO_SRC,
  HOUSEX_HEADER_PAPER_TILE,
  HOUSEX_HEADER_PAPER_STRIP,
} from "../lib/brand/housex-logo-assets";

/** Lấy mẫu nền giấy logo + xuất texture tile/strip cho thanh tiêu đề. */
async function main() {
  const srcPath = join(
    process.cwd(),
    "public",
    HOUSEX_HEADER_LOGO_SRC.replace(/^\//, ""),
  );
  const tilePath = join(
    process.cwd(),
    "public",
    HOUSEX_HEADER_PAPER_TILE.replace(/^\//, ""),
  );
  const stripPath = join(
    process.cwd(),
    "public",
    HOUSEX_HEADER_PAPER_STRIP.replace(/^\//, ""),
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

  const paper: Array<[number, number, number]> = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (dist <= 40 && max - min <= 28) paper.push([r, g, b]);
    }
  }

  paper.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
  const mean = paper
    .reduce(
      (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
      [0, 0, 0],
    )
    .map((v) => Math.round(v / paper.length));
  const hex =
    "#" +
    mean.map((v) => v.toString(16).padStart(2, "0")).join("");

  await sharp(srcPath)
    .extract({ left: 0, top: 0, width: 128, height: 128 })
    .webp({ quality: 95, lossless: false })
    .toFile(tilePath);

  await sharp(srcPath)
    .extract({ left: 0, top: 0, width, height: 48 })
    .webp({ quality: 95, lossless: false })
    .toFile(stripPath);

  console.log(
    JSON.stringify({
      paperHex: hex,
      paperPixels: paper.length,
      tile: HOUSEX_HEADER_PAPER_TILE,
      strip: HOUSEX_HEADER_PAPER_STRIP,
    }),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
