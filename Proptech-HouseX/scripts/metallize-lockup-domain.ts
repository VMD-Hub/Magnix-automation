/**
 * Domain → gold đặc đều (1 màu), dễ đọc trên header.
 * Fill mọi pixel chữ trong bbox domain (kể cả nâu tối / AA), không gradient.
 *
 * Usage: npx tsx scripts/metallize-lockup-domain.ts
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "public/brand/housex-lockup-user-source.png");

const OUT = {
  mark: "public/brand/housex-lockup-mark-v5.png",
  paper: "public/brand/housex-lockup-mark-paper-v5.png",
  footer: "public/brand/housex-footer-logo-transparent.png",
  header: "public/brand/housex-header-logo.png",
} as const;

/** Gold đọc rõ — gần gold-400 brand, hơi sáng hơn O mean. */
const DOMAIN_GOLD = { r: 232, g: 197, b: 71 } as const; // #e8c547

function isNearBlack(r: number, g: number, b: number): boolean {
  return r <= 28 && g <= 28 && b <= 28;
}

function isWhiteFlat(r: number, g: number, b: number): boolean {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max >= 185 && max - min <= 40;
}

/** Seed: cam/vàng domain rõ. */
function isDomainSeed(r: number, g: number, b: number, a: number): boolean {
  if (a < 40) return false;
  if (isNearBlack(r, g, b) || isWhiteFlat(r, g, b)) return false;
  if (r < 140 || b > 150) return false;
  return r - b >= 35 && g >= 50;
}

/** Mọi pixel chữ trong band (kể nâu tối / AA vàng). */
function isDomainGlyph(r: number, g: number, b: number, a: number): boolean {
  if (a < 28) return false;
  if (isNearBlack(r, g, b)) return false;
  if (isWhiteFlat(r, g, b)) return false;
  // Loại pixel gần bạc/xám trung tính
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 18 && max < 160) return false;
  // Warm-ish hoặc nâu tối của domain gốc
  return r >= 60 && g >= 35 && b <= 160 && r + 10 >= g;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(`Missing ${SRC}`);
    process.exit(1);
  }

  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const at = (x: number, y: number) => (y * width + x) * 4;

  const y0 = Math.floor(height * 0.68);
  const x1 = Math.floor(width * 0.58);

  let dMinX = width;
  let dMaxX = 0;
  let dMinY = height;
  let dMaxY = 0;

  for (let y = y0; y < height; y++) {
    for (let x = 0; x < x1; x++) {
      const i = at(x, y);
      if (
        !isDomainSeed(data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!)
      ) {
        continue;
      }
      dMinX = Math.min(dMinX, x);
      dMaxX = Math.max(dMaxX, x);
      dMinY = Math.min(dMinY, y);
      dMaxY = Math.max(dMaxY, y);
    }
  }

  // Pad bbox bắt AA
  dMinX = Math.max(0, dMinX - 2);
  dMaxX = Math.min(x1 - 1, dMaxX + 2);
  dMinY = Math.max(y0, dMinY - 2);
  dMaxY = Math.min(height - 1, dMaxY + 2);

  let painted = 0;
  for (let y = dMinY; y <= dMaxY; y++) {
    for (let x = dMinX; x <= dMaxX; x++) {
      const i = at(x, y);
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;
      const a = data[i + 3]!;
      if (!isDomainGlyph(r, g, b, a)) continue;

      // Gold đặc — giữ alpha gốc (AA), RGB cố định
      data[i] = DOMAIN_GOLD.r;
      data[i + 1] = DOMAIN_GOLD.g;
      data[i + 2] = DOMAIN_GOLD.b;
      painted++;
    }
  }

  let cleared = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (isNearBlack(data[i]!, data[i + 1]!, data[i + 2]!)) {
      data[i + 3] = 0;
      cleared++;
    }
  }

  const png = await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();

  for (const rel of Object.values(OUT)) {
    await sharp(png).toFile(join(ROOT, rel));
    console.log(`wrote ${rel}`);
  }

  console.log(
    JSON.stringify(
      {
        painted,
        cleared,
        gold: DOMAIN_GOLD,
        box: { dMinX, dMaxX, dMinY, dMaxY },
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
