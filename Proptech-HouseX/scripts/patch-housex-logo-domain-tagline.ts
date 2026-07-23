/**
 * Xóa band tagline EN trong lockup PNG.
 * Domain `timnhaxahoi.com` render bằng HTML (header/footer) — đọc được ở cỡ logo nhỏ;
 * không bake chữ vào PNG (kéo giãn / cỡ nhỏ đều fail).
 *
 * Usage: npx tsx scripts/patch-housex-logo-domain-tagline.ts
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

/** Band xóa EN cũ (dưới HOUSE). */
const CLEAR = {
  x0: 20,
  x1: 830,
  y0: 292,
  y1: 358,
} as const;

const SOURCE_BAK =
  "public/brand/housex-footer-logo-transparent.pre-domain-tagline.bak.png";

const OUTPUTS = [
  "public/brand/housex-lockup-mark-v2.png",
  "public/brand/housex-lockup-mark-paper-v2.png",
  "public/brand/housex-footer-logo-transparent.png",
  "public/brand/housex-header-logo.png",
] as const;

async function clearBand(
  data: Buffer,
  width: number,
  height: number,
): Promise<void> {
  const { x0, x1, y0, y1 } = CLEAR;
  for (let y = y0; y <= y1 && y < height; y++) {
    for (let x = x0; x <= x1 && x < width; x++) {
      const i = (y * width + x) * 4;
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
  }
  for (let y = y0 - 3; y <= y1 + 3; y++) {
    for (let x = x0 - 4; x <= x1 + 4; x++) {
      if (y < 0 || x < 0 || y >= height || x >= width) continue;
      if (y >= y0 && y <= y1 && x >= x0 && x <= x1) continue;
      const i = (y * width + x) * 4;
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;
      if (a < 25) continue;
      const max = Math.max(r, g, b);
      const sat = max - Math.min(r, g, b);
      if (max >= 150 && sat <= 40) data[i + 3] = 0;
    }
  }
}

async function main() {
  const bakPath = join(ROOT, SOURCE_BAK);
  if (!existsSync(bakPath)) {
    console.error(`Missing source backup: ${SOURCE_BAK}`);
    process.exit(1);
  }

  const { data, info } = await sharp(bakPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  await clearBand(data, width, height);

  const cleared = await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  for (const outRel of OUTPUTS) {
    const outPath = join(ROOT, outRel);
    const perBak = outPath.replace(/\.png$/i, ".pre-domain-tagline.bak.png");
    if (!existsSync(perBak) && existsSync(outPath)) {
      copyFileSync(outPath, perBak);
    }
    await sharp(cleared).toFile(outPath);
    console.log(`wrote ${outRel} (EN band cleared, no baked domain)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
